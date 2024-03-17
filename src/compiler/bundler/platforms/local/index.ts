import { Endpoint, Segment } from "../../../models.js";
import { Tooling } from "../../../utilities/tooling/index.js";
import { Files } from "../../../utilities/files/index.js";
import { Bundler } from "../abstract.js";



export class Local extends Bundler {


    async build() {
        await super.build();
        await Tooling.build({
            buffer:  this.getBuffer(),
            output:  Files.join(this.getFilepath(), "index.js"),
            resolve: this.options.input,
            options: { 
                ...this.options?.developer?.bundler?.esbuild,
                platform: "node",
            }
        });
    }


    private getBuffer() {
        let __dirname = new URL(".", import.meta.url).pathname.replace("C:/", "");
        return `
            import { __internal__ as SherpaJS } from "${Files.join(__dirname, "../../../../environment/index.js")}";

            let portArg = process.argv[2];
            let port    = portArg && !isNaN(parseInt(portArg)) ? parseInt(portArg) : 3000;
            let server  = new SherpaJS.LocalServer(port);
            ${this.endpoints.map((endpoint:Endpoint, index:number) => {
                return `
                    import * as endpoint_${index} from "${endpoint.filepath.replace("C:/", "/")}";
                    import import_context_${index} from "${endpoint.module.contextFilepath.replace("C:/", "/")}";

                    let context_${index} = import_context_${index}.context;
                    let segments_${index} = ${JSON.stringify(endpoint.segments)};
                    let url_${index} = "${this.getDynamicURL(endpoint.segments)}";
                    server.addRoute(url_${index}, async (nativeRequest, nativeResponse) => {
                        let req = await SherpaJS.RequestTransform.Local(nativeRequest, segments_${index});
                        let res = await SherpaJS.Handler(endpoint_${index}, context_${index}, req);
                        SherpaJS.ResponseTransform.Local(res, nativeResponse);
                    });

                `;
            }).join("\n")}

            server.start();
        `;
    }


    private getDynamicURL(segments:Segment[]):string {
        return segments.map((segment) => {
            return segment.isDynamic ? `[${segment.name}]` : segment.name;
        }).join("/");
    }

    
}


