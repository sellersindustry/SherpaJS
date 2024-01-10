import { Generator } from "./generator";
import { Linter } from "./linter";
import { DeveloperParamaters as DevParams, Endpoint, Module } from "./models";
import { Utility } from "./utilities";


const PATH_ENDPOINTS = "/routes";


export class SherpaJS {


    public static async Build(input:string, output:string, devParm?:DevParams) {
        // let server = await this.LintServer(input);
        // Generator.Bundler(server, output, devParm);

        //! Development
        let module = await this.LintModule(input, []);
        Generator.Bundler(module, output, devParm);
        //! Development
    }


    // public static async LintServer(input:string):Promise<Server> {
        // for (let module of server.module) {
        //    let module = await this.LintModule(input, subroute);
        // }
    // }


    public static async LintModule(input:string, subroute:string[]=[]):Promise<Module> {
        let config = await Generator.GetConfigModule(input);
        Utility.Log.Output(Linter.ConfigModule(config.instance));
        let endpoints = this.getEndpoints(input, subroute);
        Utility.Log.Output(Linter.Endpoints(endpoints));
        return { endpoints, config, subroute };
    }


    private static getEndpoints(input:string, subroute:string[]):Endpoint[] {
        let endpointDir = Utility.File.JoinPath(input, PATH_ENDPOINTS);
        return Generator.GetEndpoints(endpointDir, subroute);
    };


}

