/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: expressjs.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Local Bundler
 *
 */


import { Endpoint } from "../../../models.js";
import { Tooling } from "../../../utilities/tooling/index.js";
import { Files } from "../../../utilities/files/index.js";
import { Bundler } from "../abstract.js";
import { RequestUtilities } from "../../../../environment/io/request/utilities.js";


export class Local extends Bundler {


    async build() {
        await super.build();
        await Tooling.build({
            buffer:  this.getBuffer(),
            output:  Files.join(this.getFilepath(), "index.js"),
            resolve: this.options.input,
            options: this.options,
            esbuild: {
                platform: "node",
            }
        });
    }


    private getBuffer() {
        return `
            import { LocalServer, __internal__ as SherpaJS } from "${Files.unix(Files.join(Files.getRootDirectory(), "dist/index.js"))}";

            let portArg = process.argv[2];
            let port    = portArg && !isNaN(parseInt(portArg)) ? parseInt(portArg) : 3000;
            let server  = new LocalServer(port);
            ${this.endpoints.map((endpoint:Endpoint, index:number) => {
                return `
                    import * as endpoint_${index} from "${Files.unix(endpoint.filepath)}";
                    import import_context_${index} from "${Files.unix(endpoint.module.contextFilepath)}";

                    let context_${index} = import_context_${index}.context;
                    let segments_${index} = ${JSON.stringify(endpoint.segments)};
                    let url_${index} = "${RequestUtilities.getDynamicURL(endpoint.segments)}";
                    server.addRoute(url_${index}, async (nativeRequest, nativeResponse) => {
                        let req = await SherpaJS.RequestTransform.Local(nativeRequest, segments_${index});
                        let res = await SherpaJS.Handler(endpoint_${index}, context_${index}, req);
                        SherpaJS.ResponseTransform.Local(req, res, nativeResponse);
                    });

                `;
            }).join("\n")}

            server.start();
        `;
    }

    
}


// A wise son brings joy to his father, but a foolish son brings grief to his mother.
// - Proverbs 10:1
