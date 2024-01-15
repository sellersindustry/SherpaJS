import { Generator } from "./generator";
import { Linter } from "./linter";
import { BuildOptions, ConfigServerApp, Endpoint, Module, Server } from "./models";
import { Utility } from "./utilities";


const PATH_ENDPOINTS = "/routes";


export class SherpaJS {


    public static async Build(options:BuildOptions) {
        Generator.Bundler(await this.LintServer(options.input), options);
    }


    public static async LintServer(input:string):Promise<Server> {
        let config = await Generator.GetConfigServer(input);
        Utility.Log.Output(Linter.ConfigServer(config.instance, config.path));
        let modules = [];
        for (let module of this.getModules(config.instance.app)) {
            modules.push(await this.LintModule(module.path, module.subroute));
        }
        return { config, modules };
    }


    public static async LintModule(input:string, subroute:string[]=[]):Promise<Module> {
        let config = await Generator.GetConfigModule(input);
        Utility.Log.Output(Linter.ConfigModule(config.instance, config.path));
        let endpoints = this.getEndpoints(input, subroute);
        Utility.Log.Output(Linter.Endpoints(endpoints));
        return { endpoints, config, subroute };
    }


    private static getEndpoints(input:string, subroute:string[]):Endpoint[] {
        let endpointDir = Utility.File.JoinPath(input, PATH_ENDPOINTS);
        return Generator.GetEndpoints(endpointDir, subroute);
    };


    private static getModules(apps:ConfigServerApp, subroute:string[] = []):{ path:string, subroute:string[] }[] {
        if (!apps) return [];
        if (!apps["module"]) return Object.keys(apps).map((key) => {
            let route = key.startsWith("/") ? key.replace("/", "") : key;
            return this.getModules(apps[key], [...subroute, route]);
        }).flat();
        return [{ path: apps["module"], subroute: subroute }];
    }
    

}

