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


import fs from "fs";
import { Endpoint } from "../../../models.js";
import { Tooling } from "../../../utilities/tooling/index.js";
import { Path } from "../../../utilities/path/index.js";
import { Bundler } from "../abstract.js";
import { RequestUtilities } from "../../../../native/request/utilities.js";


export class Local extends Bundler {


    async build() {
        await super.build();
        await this.buildViewDirectory();
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


    async buildViewDirectory() {
        if (!this.views.some(views => views !== undefined)) {
            return;
        }

        fs.mkdirSync(Path.join(this.getFilepath(), "views"));
        for (let i = 0; i < this.views.length; i++) {
            if (this.views[i] == undefined) {
                continue;
            }
            let compiledFilepath = Path.join(this.getFilepath(), "views", `view_${i}.html`);
            fs.writeFileSync(compiledFilepath, this.views[i].html);
            this.views[i].compiledFilepath = compiledFilepath;
        }
    }


    private getBuffer() {
        return `
            import fs from "fs";
            import { ServerLocal } from "${Path.join(Path.getRootDirectory(), "dist/src/server-local/index.js")}";
            import { Handler, RequestLocal, ResponseLocal } from "${Path.join(Path.getRootDirectory(), "dist/src/internal/index.js")}";

            let portArg = process.argv[2];
            let port    = portArg && !isNaN(parseInt(portArg)) ? parseInt(portArg) : 3000;
            let server  = new ServerLocal(port);
            ${this.endpoints.list.map((endpoint:Endpoint, index:number) => {
                return `
                    ${endpoint.filepath ?
                        `import * as endpoint_${index} from "${endpoint.filepath}";` :
                        `const endpoint_${index} = {};`
                    }
                    ${this.views[index] ?
                        `const view_${index}_filepath = "${this.views[index].compiledFilepath}";` :
                        null
                    }
                    import import_context_${index} from "${endpoint.module.contextFilepath}";

                    let context_${index} = import_context_${index}.context;
                    let segments_${index} = ${JSON.stringify(endpoint.segments)};
                    let url_${index} = "${RequestUtilities.getDynamicURL(endpoint.segments)}";
                    server.addRoute(url_${index}, async (nativeRequest, nativeResponse) => {
                        let req = await RequestLocal(nativeRequest, segments_${index});
                        let res = await Handler(endpoint_${index}, ${this.views[index] ? `view_${index}_filepath` : null}, context_${index}, req);
                        ResponseLocal(req, res, nativeResponse);
                    });

                `;
            }).join("\n")}

            server.start();
        `;
    }

    
}


// A wise son brings joy to his father, but a foolish son brings grief to his mother.
// - Proverbs 10:1
