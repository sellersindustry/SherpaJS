import fs from "fs";
import { BuildOptions as ESBuildOptions, build as ESBuild } from "esbuild";
import { Endpoint, VALID_EXPORTS } from "../../models";
import { Utility } from "../../utilities";
import { Bundler } from "./abstract";


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


export class BundlerVercel extends Bundler {


    async Build() {
        await this.buildEndpoints();
        await this.buildServerConfig();
    }


    async Clean() {
        try {
            await Utility.File.Remove(this.getPath());
        } catch (error) {
            Utility.Log.Error({
                message: "Failed to clean build directory.",
                path: this.getPath()
            });
        }
    }


    async buildEndpoints() {
        for (let module of this.server.modules) {
            for (let endpoint of module.endpoints) {
                try {
                    await this.buildEndpointHandler(endpoint);
                    await this.buildEndpointConfig(endpoint);
                } catch (error) {
                    Utility.Log.Error({
                        message: "Failed to build endpoint.",
                        content: error.message,
                        path: endpoint.filepath,
                    });
                }
            }
        }
    }


    async buildEndpointHandler(endpoint:Endpoint) {
        await ESBuild({
            stdin: {
                contents: this.getEndpointHandlerCode(endpoint),
                resolveDir: Utility.File.GetDirectory(endpoint.filepath),
                loader: "ts",
            },
            outfile: this.getEndpointPath(endpoint, "index.js"),
            ...DEFAULT_ESBUILD_TARGET as Partial<ESBuildOptions>,
            ...this.build?.developer?.bundler?.esbuild as Partial<ESBuildOptions>,
        });
    }


    private getEndpointHandlerCode(endpoint:Endpoint) {
        let varibles = endpoint.exports.filter(o => VALID_EXPORTS.includes(o));
        return [
            `import { ${varibles.join(", ")} } from "./index";`,
            `import config from "${this.server.config.path}";`,
            `import { SherpaSDK } from "${Utility.File.JoinPath(__dirname, "../../../sdk/index")}";`,
            `export default async function index(_request, event) {`,
                `let request = SherpaSDK.ProcessRequest(_request, "VERCEL");`,
                `let sherpa  = new SherpaSDK(config, ${JSON.stringify(endpoint)});`,
                `\tswitch (request.method) {`,
                    `${varibles.map((v) => `\t\tcase "${v}": return ${v}(request, sherpa);`).join("\n")}`,
                `\t}`,
                `\treturn new Response("Unsupported method \\"" + request.method + "\\".", { status: 405 });`,
            `}`
        ].join("\n");
    }


    private buildEndpointConfig(endpoint:Endpoint) {
        let minify  = this.build.developer.bundler.esbuild.minify;
        let fileout = this.getEndpointPath(endpoint, ".vc-config.json");
        let buffer  = JSON.stringify(VERCEL_FUNCTION_CONFIG, null, minify == false ? 4 : 0);
        fs.writeFileSync(fileout, buffer);
    }


    private async buildServerConfig() {
        let minify  = this.build.developer.bundler.esbuild.minify;
        fs.writeFileSync(this.getPath("/config.json"), JSON.stringify({
            "version": 3,
            "routes": this.getDynamicReroutes(),
        }, null, minify == false ? 4 : 0));
    }


    private getDynamicReroutes():{ src:string, dest:string }[] {
        let modules = this.server.modules.map((m) => m.endpoints).flat();
        return modules.filter((endpoint) => {
            return endpoint.route.filter((route) => route.isDynamic).length > 0;
        }).map((endpoint) => {
            let routes  = endpoint.route;
            let dynamic = routes.filter((route) => route.isDynamic);
            let src     = "/" + routes.map(r => r.isDynamic ? `(?<${r.name}>.*)` : r.name).join("/");
            let dest    = "/" + routes.map(r => r.isDynamic ? `[${r.name}]` : r.name).join("/");
            let query   = dynamic.map((r) => "PARAM--" + r.name + "=$" + r.name).join("&");
            return {
                src: src,
                dest: dest + "?" + query
            }
        });
    }


    private getEndpointPath(endpoint:Endpoint, ...path:string[]):string {
        return this.getPath(
            "functions",
            endpoint.route.map(r => r.isDynamic ? `[${r.name}]` : r.name).join("/"),
            "/index.func",
            ...path
        );
    }
    

    private getPath(...path:string[]):string {
        return Utility.File.JoinPath(
            this.build.output,
            ".vercel" + (path.length == 0 ? "" : "/output"),
            ...path
        );
    }
    

}

