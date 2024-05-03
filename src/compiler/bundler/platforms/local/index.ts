/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Local Bundler
 *
 */


import { Endpoint } from "../../../models.js";
import { Tooling } from "../../../utilities/tooling/index.js";
import { Path } from "../../../utilities/path/index.js";
import { Bundler } from "../abstract.js";
import { RequestUtilities } from "../../../../native/request/utilities.js";


export class Local extends Bundler {


    async build() {
        await super.build();
        await Tooling.build({
            buffer:  this.getBuffer(),
            output:  Path.join(this.getFilepath(), "index.js"),
            resolve: this.options.input,
            options: this.options,
            esbuild: {
                platform: "node",
            }
        });

    }


    private getBuffer() {
        // FIXME - load view from static
        return `
            import path from "path";
            import { ServerLocal } from "${Path.join(Path.getRootDirectory(), "dist/src/server-local/index.js")}";
            import { Handler, RequestLocal, ResponseLocal } from "${Path.join(Path.getRootDirectory(), "dist/src/internal/index.js")}";

            const portArg = process.argv[2];
            const port    = portArg && !isNaN(parseInt(portArg)) ? parseInt(portArg) : 3000;
            const server  = new ServerLocal(port);
            const dirname = import.meta.dirname;
            ${this.endpoints.list.map((endpoint:Endpoint, index:number) => {
                return `
                    ${endpoint.filepath ?
                        `import * as endpoint_${index} from "${endpoint.filepath}";` :
                        `const endpoint_${index} = {};`
                    }
                    ${this.views[index] ?
                        `const view_${index} = "${encodeURIComponent(this.views[index].html)}";` :
                        `const view_${index} = "";`
                    }
                    import import_context_${index} from "${endpoint.module.contextFilepath}";

                    const context_${index} = import_context_${index}.context;
                    const segments_${index} = ${JSON.stringify(endpoint.segments)};
                    const url_${index} = "${RequestUtilities.getDynamicURL(endpoint.segments)}";
                    server.addEndpoint(url_${index}, async (nativeRequest, nativeResponse) => {
                        let req = await RequestLocal(nativeRequest, segments_${index});
                        let res = await Handler(endpoint_${index}, ${`view_${index}`}, context_${index}, req);
                        ResponseLocal(req, res, nativeResponse);
                    });

                `;
            }).join("\n")}

            ${this.assets.list.map((asset, index) => {
                return `
                    const asset_url_${index} = "${RequestUtilities.getDynamicURL(asset.segments)}${asset.segments.length > 0 ? "/" : ""}${asset.filename}";
                    const asset_filepath_${index} = path.join(dirname, "public", asset_url_${index});
                    server.addAsset(asset_url_${index}, asset_filepath_${index});
                `;
            }).join("\n")}

            server.start();
        `;
    }

    
}


// A wise son brings joy to his father, but a foolish son brings grief to his mother.
// - Proverbs 10:1
