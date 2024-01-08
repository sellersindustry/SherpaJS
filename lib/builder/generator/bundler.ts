import path from "path";
import { build, transform } from "esbuild";
import type { BuildOptions, TransformOptions } from "esbuild";
import { Endpoint, VALID_EXPORTS } from "../models";
import fs from "fs";
import { Utility } from "../utilities";


const TARGET_CONFIG:Partial<BuildOptions|TransformOptions> = {
    target: "es2020",
    format: "esm"
};
const ESBUILD_CONFIG:Partial<BuildOptions> = {
    bundle: true,
    allowOverwrite: true,
    treeShaking: true,
    minify: true,  
    loader: { ".ts": "ts" },
    jsx: "transform",
    legalComments: "none",
};
const VERCEL_FUNCTION_CONFIG = {
    "runtime": "edge",
    "entrypoint": "index.js"
};


export async function Bundle(endpoints:Endpoint[], output:string) {
    for (let endpoint of endpoints) {
        await bundleEndpoint(endpoint, output);
    }
    fs.writeFileSync(Utility.File.JoinPath(output, "config.json"), JSON.stringify(
        {
            "version": 3,
            "routes": [
                {
                  "src": "/test/(.*)",
                  "dest": "/test/[test]?test=$1",
                }
            ]
        }
    ));
}


async function bundleEndpoint(endpoint:Endpoint, output:string) {
    let route    = endpoint.route.map((route) => route.isDynamic ? `[${route.name}]` : route.name).join("/");
    let location = Utility.File.JoinPath(output, "functions", route, "/index.func");
    try {
        let buffer = fs.readFileSync(endpoint.filepath);
        let code   = (await transform(buffer, TARGET_CONFIG as TransformOptions)).code;
        await build({
            ...(TARGET_CONFIG as BuildOptions),
            ...(ESBUILD_CONFIG as BuildOptions),
            stdin: {
                contents: code,
                resolveDir: Utility.File.GetDirectory(endpoint.filepath)
            },
            outfile: Utility.File.JoinPath(location, "endpoint.js"),
        });
        buildEdgeConfig(location);
        buildHandler(endpoint, location);
    } catch (e) {
        console.error(e);
    }
}


function buildEdgeConfig(output:string) {
    let buffer = JSON.stringify(VERCEL_FUNCTION_CONFIG);
    fs.writeFileSync(Utility.File.JoinPath(output, ".vc-config.json"), buffer);
}


function buildHandler(endpoint:Endpoint, location:string) {
    let buffer = getEdgeHandlerCode(endpoint);
    fs.writeFileSync(Utility.File.JoinPath(location, "index.js"), buffer);
}


function getEdgeHandlerCode(endpoint:Endpoint) {
    let varibles = endpoint.exports.filter(o => VALID_EXPORTS.includes(o));
    return `// Generated by SherpaJS
        import { ${varibles.join(", ")} } from "./endpoint";

        export default async function index(request, event) {
            switch (request.method) {
                ${varibles.map((variable) => {
                    return `case "${variable}": return ${variable}(request);`;
                }).join("\n")}
            }
            return new Response("Unsupported method \\"" + request.method + "\\".", { status: 405 });
        }
    `.split("\n").map(o => o.startsWith("        ") ? o.replace("        ", "") : o).join("\n");
}

