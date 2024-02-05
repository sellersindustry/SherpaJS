import { Endpoint } from "../../models";
import { BundlerType } from "../../models/build";
import { SourceCode } from "../../sourcecode";
import { Utility } from "../../utilities";
import { Bundler } from "./abstract";


export class BundlerExpressJS extends Bundler {

    
    GetPath(...path:string[]):string {
        return Utility.File.JoinPath(
            this.build.output,
            ".sherpa",
            ...path
        );
    }


    async Build() {
        await SourceCode.Build({
            buffer:  this.getHandlerCode(),
            output:  this.GetPath("index.js"),
            resolve: this.build.input,
            options: { 
                ...this.build?.developer?.bundler?.esbuild,
                platform: "node",
            }
        });
    }


    private getHandlerCode():string {
        let port = this.build.port ? this.build.port : 3000;
        return [
            `import { Handler, ExpressJSResponse } from "${Utility.File.JoinPath(__dirname, "../handler/index")}";`,
            `import config from "${this.server.config.path}";`,
            `import express from "express";`,
            `const app = express();`,
            ...this.server.modules.map((module, mIndex) => {
                return module.endpoints.map((endpoint, eIndex) => {
                    let index = mIndex * module.endpoints.length + eIndex;
                    return this.getEndpointHandlerCode(endpoint, index);
                });
            }).flat(),
            `app.listen(${port}, () => {`,
                `\t\tconsole.log("SherpaJS Server, started on port \\"${port}\\"");`,
            `});`
        ].join("\n");
    }


    private getEndpointHandlerCode(endpoint:Endpoint, id:number):string {
        let route = endpoint.route.map((r) => r.isDynamic ? `:${r.name}` : r.name).join("/");
        return [
            `import * as functions_${id} from "${endpoint.filepath}";`,
            `app.all("/${route}", async (request, resolve) => {`,
                `\tlet endpoint = ${JSON.stringify(endpoint)}`,
                `\tlet response = Handler(request, functions_${id}, endpoint, config, "${BundlerType.ExpressJS.toString()}");`,
                `\tawait ExpressJSResponse(response, resolve);`,
            `});`,
        ].join("\n");
    }


}

