/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Wed Mar 20 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Vercel Builder
 *
 */


import fs from "fs";
import path from "path";
import { Bundler } from "../abstract.js";
import { Endpoint, Segment } from "../../../models.js";
import { Path } from "../../../utilities/path/index.js";
import { Tooling } from "../../../utilities/tooling/index.js";
import { RequestUtilities } from "../../../../environment/io/request/utilities.js";


export class Vercel extends Bundler {


    getFilepath():string {
        return Path.join(this.options.output, ".vercel");
    }


    async build() {
        await super.build();
        this.makeDirectory();
        this.writeRootConfig();
        for (let endpoint of this.endpoints.list) {
            let route    = RequestUtilities.getDynamicURL(endpoint.segments);
            let filepath = this.getDirectory(route, "index.func");
            this.writeEndpointConfig(filepath);
            await Tooling.build({
                buffer:  this.getBuffer(endpoint),
                output:  Path.join(filepath, "index.js"),
                resolve: Path.getDirectory(endpoint.filepath),
                options: this.options,
                esbuild: { 
                    platform: "node",
                }
            });
        }
    }


    private getBuffer(endpoint:Endpoint) {
        let sherpaCorePath = process.env.VERCEL !== undefined ? "sherpa-core" : Path.join(Path.getRootDirectory(), "dist/index.js");
        return `
            import { __internal__ as SherpaJS } from "${sherpaCorePath}";
            import * as endpoint from "${endpoint.filepath}";
            import import_context from "${endpoint.module.contextFilepath}";

            let context  = import_context.context;
            let segments = ${JSON.stringify(endpoint.segments)};
            let url      = "${RequestUtilities.getDynamicURL(endpoint.segments)}";

            export default async function index(nativeRequest, event) {
                let req = await SherpaJS.RequestTransform.Vercel(nativeRequest, segments);
                let res = await SherpaJS.Handler(endpoint, context, req);
                return SherpaJS.ResponseTransform.Vercel(req, res);
            }
        `;
    }



    private getDirectory(...path:string[]):string {
        return this.makeDirectory(...path);
    }


    private makeDirectory(...path:string[]):string {
        let directory = Path.join(this.options.output, ".vercel/output/functions", ...path);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        return directory;
    }


    private writeEndpointConfig(path:string) {
        let buffer   = JSON.stringify(this.getEndpointConfig(), null, 3);
        let filepath = Path.join(path, ".vc-config.json");
        fs.writeFileSync(filepath, buffer);
    }


    private getEndpointConfig():Record<string, unknown> {
        return {
            "runtime": "edge",
            "entrypoint": "index.js"
        };
    }


    private writeRootConfig() {
        let buffer   = JSON.stringify(this.getRootConfig(), null, 3);
        let filepath = Path.join(this.options.output, ".vercel/output/config.json");
        fs.writeFileSync(filepath, buffer);
    }


    private getRootConfig():Record<string, unknown> {
        return {
            version: 3,
            routes: this.endpoints.list.filter((endpoint) => {
                return endpoint.segments.filter((segment) => segment.isDynamic).length > 0
            }).map((endpoint) => {
                let { source: src, destination: dest } = this.pathParamRedirects(endpoint.segments)
                return { src, dest };
            })
        }
    }


    private pathParamRedirects(segments:Segment[]):{ source:string, destination:string } {
        return {
            source: "/" + segments.map((segment) => segment.isDynamic ? "([^/]+)" : segment.name).join("/"),
            destination: "/" + RequestUtilities.getDynamicURL(segments)
        }
    }


}


// Give careful thought to the paths for your feet and be steadfast in all
// your ways.
// - Proverbs 4:26
