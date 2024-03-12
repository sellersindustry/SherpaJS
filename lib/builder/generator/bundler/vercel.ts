/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: vercel.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Vercel Bundle Generator
 *
 */


import fs from "fs";
import { Endpoint, Module, BundlerType } from "../../models/index.js";
import { Utility } from "../../utilities/index.js";
import { Bundler } from "./abstract.js";
import { Logger } from "../../logger/index.js";
import { SourceCode } from "../../sourcecode/index.js";


const VERCEL_FUNCTION_CONFIG = {
    "runtime": "edge",
    "entrypoint": "index.js"
};


export class BundlerVercel extends Bundler {


    GetPath(...path:string[]):string {
        return Utility.File.JoinPath(
            this.build.output,
            ".vercel" + (path.length == 0 ? "" : "/output"),
            ...path
        );
    }

    
    async Build() {
        await this.buildEndpoints();
        await this.buildServerConfig();
    }


    async buildEndpoints() {
        for (let module of this.server.modules) {
            for (let endpoint of module.endpoints) {
                try {
                    await this.buildEndpointHandler(module, endpoint);
                    await this.buildEndpointConfig(endpoint);
                } catch (error) {
                    Logger.RaiseError({
                        message: "Failed to build endpoint.",
                        content: error.message,
                        path: endpoint.filepath,
                    });
                }
            }
        }
    }


    async buildEndpointHandler(module:Module, endpoint:Endpoint) {
        await SourceCode.Build({
            buffer:  this.getEndpointHandlerCode(module, endpoint),
            output:  this.getEndpointPath(endpoint, "index.js"),
            resolve: Utility.File.GetDirectory(endpoint.filepath),
            options: this.build?.developer?.bundler?.esbuild
        });
    }


    private getEndpointHandlerCode(module:Module, endpoint:Endpoint):string {
        let __dirname = new URL(".", import.meta.url).pathname.replace("/C:", "C:");
        return [
            `import { Handler } from "${Utility.File.JoinPath(__dirname, "../handler/index.js")}";`,
            `import configServer from "${this.server.config.path}";`,
            `import configModule from "${module.config.path}";`,
            `import * as functions from "./index";`,
            `export default async function index(request, event) {`,
                `\tlet endpoint = ${JSON.stringify(endpoint)}`,
                `\treturn await Handler(request, functions, endpoint, configModule, configServer, "${BundlerType.Vercel.toString()}")`,
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
        fs.writeFileSync(this.GetPath("/config.json"), JSON.stringify({
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
        return this.GetPath(
            "functions",
            endpoint.route.map(r => r.isDynamic ? `[${r.name}]` : r.name).join("/"),
            "/index.func",
            ...path
        );
    }
    

}


// Deceit is in the hearts of those who plot evil, but those who promote peace have joy.
// - Proverbs 12:20
