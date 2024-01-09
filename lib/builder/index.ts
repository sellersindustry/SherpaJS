import { Generator } from "./generator";
import { Linter } from "./linter";
import { ConfigModuleModel, Endpoint, Route } from "./models";
import { Utility } from "./utilities";


const PATH_ENDPOINTS = "/routes";



export class SherpaJS {


    //! Loop for each module
    public static async BuildModule(path:string, output:string, subroute:string[] = []) {
        let module = await this.LintModule(path, subroute);
        Generator.Bundler(module.endpoints, module.mconfig.path, output); //! returns reroutes for dynamic routes for vercel build confit
    }


    public static async LintModule(
        path:string, subroute:string[] = []
    ):Promise<{
        endpoints:Endpoint[], mconfig:{ config:ConfigModuleModel, path:string }
    }> {
        let mconfig = await Generator.GetConfigModule(path);
        Utility.Log.Output(Linter.ConfigModule(mconfig.config));
        let endpoints = this.getEndpoints(path); //! add additional subroutes on here
        Utility.Log.Output(Linter.Endpoints(endpoints));
        return { mconfig, endpoints };
    }


    private static getEndpoints(path:string):Endpoint[] {
        return Generator.GetEndpoints(Utility.File.JoinPath(path, PATH_ENDPOINTS));
    };


}

