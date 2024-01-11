import { BuildOptions as ESBuildOptions, build as ESBuild } from "esbuild";
import { BuildOptions, BundleParamaters as BundleParams, Endpoint, Module, Server, VALID_EXPORTS } from "../models";
import fs from "fs";
import { Utility } from "../utilities";


const VERCEL_FUNCTION_CONFIG = {
    "runtime": "edge",
    "entrypoint": "index.js"
};
const DEFAULT_ESBUILD_TARGET = {
    target: "es2020",
    format: "esm",
    bundle: true,
    allowOverwrite: true,
    treeShaking: true,
    minify: true,
};


export async function Bundler(server:Server, options:BuildOptions) {
    //! clear output folder
    await buildAllEndpoints(server, options);
    await buildServer(server, options);
}


async function buildAllEndpoints(server:Server, options:BuildOptions) {
    //! Wait for all
    for (let module of server.modules) {
        for (let endpoint of module.endpoints) {
            await buildEndpoint({ endpoint, module, server, options });
        }
    }
}


async function buildEndpoint(bp:BundleParams) {
    await buildEndpointHandler(bp);
    await buildEndpointConfig(bp);
}


async function buildEndpointHandler(ep:BundleParams) {
    try {
        await ESBuild({
            stdin: {
                contents: getEndpointHandlerCode(ep),
                resolveDir: Utility.File.GetDirectory(ep.endpoint.filepath),
                loader: "ts",
            },
            outfile: getEndpointOutput(ep, "index.js"),
            ...DEFAULT_ESBUILD_TARGET as Partial<ESBuildOptions>,
            ...ep?.options?.developer?.bundler?.esbuild as Partial<ESBuildOptions>,
        });
    } catch {
        //! Throw Error
    }
}


function getEndpointHandlerCode(ep:BundleParams) {
    let varibles = ep.endpoint.exports.filter(o => VALID_EXPORTS.includes(o));
    return [
        `import { ${varibles.join(", ")} } from "./index.ts";`,
        `export default async function index(request, event) {`,
            `\tswitch (request.method) {`,
                `${varibles.map((v) => `\t\tcase "${v}": return ${v}(request);`).join("\n")}`,
            `\t}`,
            `\treturn new Response("Unsupported method \\"" + request.method + "\\".", { status: 405 });`,
        `}`
    ].join("\n");    
}


async function buildEndpointConfig(ep:BundleParams) {
    let fileout = getEndpointOutput(ep, ".vc-config.json");
    let buffer  = JSON.stringify(VERCEL_FUNCTION_CONFIG);
    fs.writeFileSync(fileout, buffer);
}


async function buildServer(server:Server, options:BuildOptions) {
    await buildServerConfig(server, options);
}


async function buildServerConfig(server:Server, options:BuildOptions) {
    let modules = server.modules.map((m) => m.endpoints).flat();
    fs.writeFileSync(getOutput(options, "/config.json"), JSON.stringify(
        {
            "version": 3,
            "routes": getDynamicReroutes(modules),
        }
    ));
}


function getDynamicReroutes(endpoints:Endpoint[]):{ src:string, dest:string }[] {
    return endpoints.filter((endpoint) => {
        return endpoint.route.filter((route) => route.isDynamic).length > 0;
    }).map((endpoint) => {
        let routes  = endpoint.route;
        let dynamic = routes.filter((route) => route.isDynamic);
        let source  = "/" + routes.map(r => r.isDynamic ? `(?<${r.name}>.*)` : r.name).join("/");
        let dest    = "/" + routes.map(r => r.isDynamic ? `[${r.name}]` : r.name).join("/");
        let query   = dynamic.map((r) => r.name + "=$" + r.name).join("&");
        return {
            src: source,
            dest: dest + "?" + query
        }
    });
}


function getEndpointOutput(ep:BundleParams, ...path:string[]):string {
    return Utility.File.JoinPath(
        getOutput(ep.options),
        "functions",
        ep.endpoint.route.map(r => r.isDynamic ? `[${r.name}]` : r.name).join("/"),
        "/index.func",
        ...path
    );
}


function getOutput(options:BuildOptions, ...path:string[]):string {
    return Utility.File.JoinPath(
        options.output,
        ".vercel/output",
        ...path
    );
}

