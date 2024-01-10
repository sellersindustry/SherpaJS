import { Generator } from "./generator";
import { Linter } from "./linter";
import { Endpoint, Module } from "./models";
import { Utility } from "./utilities";


const PATH_ENDPOINTS = "/routes";


export class SherpaJS {


    //! Loop for each module
    public static async BuildModule(path:string, output:string, subroute:string[]) {
        let module = await this.LintModule(path, subroute);
        Generator.Bundler(module, output); //! returns ModuleMiddleware to generate vercel config
    }


    public static async LintModule(path:string, subroute:string[]):Promise<Module> {
        let config = await Generator.GetConfigModule(path);
        Utility.Log.Output(Linter.ConfigModule(config.instance));
        let endpoints = this.getEndpoints(path, subroute);
        Utility.Log.Output(Linter.Endpoints(endpoints));
        return { endpoints, config, subroute };
    }


    private static getEndpoints(path:string, subroute:string[]):Endpoint[] {
        let endpointDir = Utility.File.JoinPath(path, PATH_ENDPOINTS);
        return Generator.GetEndpoints(endpointDir, subroute);
    };


}

