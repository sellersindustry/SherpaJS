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
import { Bundler, View } from "../abstract.js";
import { Endpoint, Segment } from "../../../models.js";
import { Path } from "../../../utilities/path/index.js";
import { Tooling } from "../../../utilities/tooling/index.js";
import { RequestUtilities } from "../../../../native/request/utilities.js";


export class Vercel extends Bundler {


    getFilepath():string {
        return Path.join(this.options.output, ".vercel");
    }


    getFilepathAssets(): string {
        return Path.join(this.getFilepath(), "output/static");
    }


    async build() {
        await super.build();
        this.makeDirectory();
        this.writeRootConfig();
        await Promise.all(this.endpoints.list.map(async (endpoint, index) => {
            let route    = RequestUtilities.getDynamicURL(endpoint.segments);
            let filepath = this.getDirectory(route, "index.func");
            let resolve  = endpoint.filepath ? Path.getDirectory(endpoint.filepath) : Path.getDirectory(endpoint.viewFilepath as string);
            this.writeEndpointConfig(filepath);
            await Tooling.build({
                buffer:  this.getBuffer(endpoint, this.views[index]),
                output:  Path.join(filepath, "index.js"),
                resolve: resolve,
                options: this.options,
                esbuild: { 
                    platform: "node",
                }
            });
        }));
    }


    private getBuffer(endpoint:Endpoint, view:View|undefined) {
        let sherpaCorePath = process.env.VERCEL !== undefined ? "sherpa-core/internal" : Path.join(Path.getRootDirectory(), "dist/src/internal/index.js");
        return `
            import path from "path";
            import { Handler, RequestVercel, ResponseVercel } from "${sherpaCorePath}";
            ${endpoint.filepath ?
                `import * as endpoint from "${endpoint.filepath}";` :
                `const endpoint = {};`
            }
            ${view ?
                `const view = "${encodeURIComponent(view.html)}";` :
                `const view = "";`
            }
            import import_context from "${endpoint.module.contextFilepath}";

            const context  = import_context.context;
            const segments = ${JSON.stringify(endpoint.segments)};
            const url      = "${RequestUtilities.getDynamicURL(endpoint.segments)}";

            export default async function index(nativeRequest, event) {
                let req = await RequestVercel(nativeRequest, segments);
                let res = await Handler(endpoint, view, context, req);
                return ResponseVercel(req, res);
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
        let buffer   = JSON.stringify(this.getRootConfig(), null, 4);
        let filepath = Path.join(this.options.output, ".vercel/output/config.json");
        fs.writeFileSync(filepath, buffer);
    }


    private getRootConfig():Record<string, unknown> {
        return {
            version: 3,
            routes: [
                ...this.endpoints.list.filter((endpoint) => {
                    return RequestUtilities.isDynamicURL(endpoint.segments);
                }).map((endpoint) => {
                    return this.pathParamRedirects(endpoint.segments);
                }),
                ...this.assets.list.filter((asset) => {
                    return RequestUtilities.isDynamicURL(asset.segments);
                }).map((asset) => {
                    return this.pathParamRedirects(asset.segments, asset.filename);
                })
            ]
        }
    }


    private pathParamRedirects(segments:Segment[], filename?:string):{ src:string, dest:string } {
        return {
            src: "/" + segments.map((segment) => segment.isDynamic ? "([^/]+)" : segment.name).join("/") + (filename ? `/${filename}` : ""),
            dest: "/" + RequestUtilities.getDynamicURL(segments) + (filename ? `/${filename}` : "")
        }
    }


}


// Give careful thought to the paths for your feet and be steadfast in all
// your ways.
// - Proverbs 4:26
