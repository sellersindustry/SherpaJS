import { BuildOptions, build as ESBuild } from "esbuild";
import { EndpointBundleParamaters as EndpointBundleParams, DeveloperParamaters as DevParams, Endpoint, Module, VALID_EXPORTS } from "../models";
import fs from "fs";
import { Utility } from "../utilities";


const VERCEL_FUNCTION_CONFIG = {
    "runtime": "edge",
    "entrypoint": "index.js"
};
const ESBUILD_TARGET = {
    target: "es2020",
    format: "esm",
    bundle: true,
    allowOverwrite: true,
    treeShaking: true,
    minify: true,
};





// export async function Bundler(server:Server, output:string, devParm?:DeveloperParamaters) {
export async function Bundler(module:Module, output:string, dev?:DevParams) {
    // clear output folder
    // make await all
    // for (let module of server.modules) {
    //     for (let endpoint of module.endpoints) {
    //         let _output = getOutput(endpoint, output);
    //         await buildEndpoint(endpoint, module, server, _output, devParm);
    //     }
    // }

    //! DEVELOPMENT
    for (let endpoint of module.endpoints) {
        await bundleEndpoint({
            endpoint,
            module,
            server: "",
            output: getOutput(endpoint, output),
            dev
        });
    }
    fs.writeFileSync(Utility.File.JoinPath(output, "config.json"), JSON.stringify(
        {
            "version": 3,
            "routes": dynamicRoutes(module.endpoints)
        }
    ));
    //! DEVELOPMENT
}


async function bundleEndpoint(ebp:EndpointBundleParams) {
    await buildHandler(ebp);
    await buildVercelConfig(ebp);
}


async function buildVercelConfig(ebp:EndpointBundleParams) {
    let fileout = Utility.File.JoinPath(ebp.output, ".vc-config.json");
    let buffer  = JSON.stringify(VERCEL_FUNCTION_CONFIG);
    fs.writeFileSync(fileout, buffer);
}


async function buildHandler(ebp:EndpointBundleParams) {
    try {
        await ESBuild({
            stdin: {
                contents: getEdgeHandlerCode(ebp),
                resolveDir: Utility.File.GetDirectory(ebp.endpoint.filepath),
                loader: "ts",
            },
            outfile: Utility.File.JoinPath(ebp.output, "index.js"),
            ...ESBUILD_TARGET as Partial<BuildOptions>,
            ...ebp?.dev?.bundler?.esbuild
        });
    } catch {
        //! DO SOMETHING!!!!
    }
}


function getEdgeHandlerCode(params:EndpointBundleParams) {
    let varibles = params.endpoint.exports.filter(o => VALID_EXPORTS.includes(o));
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


function dynamicRoutes(endpoints:Endpoint[]):{ src:string, dest:string }[] {
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


function getOutput(endpoint:Endpoint, output:string) {
    return Utility.File.JoinPath(
        output,
        "functions",
        endpoint.route.map(r => r.isDynamic ? `[${r.name}]` : r.name).join("/"),
        "/index.func"
    );
}

