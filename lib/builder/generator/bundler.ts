import { BuildOptions as ESBuildOptions, build as ESBuild } from "esbuild";
import { BuildOptions, BundleParamaters as BundleParams, Endpoint, Server, VALID_EXPORTS } from "../models";
import fs from "fs";
import { remove } from "fs-extra";
import { Utility } from "../utilities";
import { SherpaSDK } from "../../sdk";


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
    await cleanBuildDirectory(options);
    await buildAllEndpoints(server, options);
    await buildServer(server, options);
}


async function buildAllEndpoints(server:Server, options:BuildOptions) {
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
    } catch (error) {
        Utility.Log.Error({
            message: "Failed to build endpoint.",
            content: error.message,
            path: ep.endpoint.filepath,
        });
    }
}


function getEndpointHandlerCode(ep:BundleParams) {
    let varibles = ep.endpoint.exports.filter(o => VALID_EXPORTS.includes(o));
    return [
        `import { ${varibles.join(", ")} } from "./index.ts";`,
        `import config from "${ep.server.config.path}";`,
        `import { SherpaSDK } from "${Utility.File.JoinPath(__dirname, "../../sdk/index.ts")}";`,
        `export default async function index(_request, event) {`,
            `let request = SherpaSDK.ProcessRequest(_request);`,
            `let sherpa  = new SherpaSDK(config, ${JSON.stringify(ep.endpoint)});`,
            `\tswitch (request.method) {`,
                `${varibles.map((v) => `\t\tcase "${v}": return ${v}(request, sherpa);`).join("\n")}`,
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


async function cleanBuildDirectory(options:BuildOptions) {
    let path = getOutput(options);
    try {
        await remove(path);
    } catch (error) {
        Utility.Log.Error({
            message: "Failed to clean build directory.",
            path: path
        });
    }
}


function getOutput(options:BuildOptions, ...path:string[]):string {
    return Utility.File.JoinPath(
        options.output,
        ".vercel/output",
        ...path
    );
}

