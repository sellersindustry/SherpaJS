import { Generator } from "./generator";
import { Bundle } from "./generator/bundler";
import { Linter } from "./linter";
import { Endpoint, Route } from "./models";
import { Utility } from "./utilities";


const PATH_ENDPOINTS = "/routes";



export class SherpaJS {



    public static BuildModule(path:string, subroute:Route[], output:string) {
        //! get module config
        //! lint module config
        let endpoints = this.getEndpoints(path);
        Utility.Log.Output(Linter.Endpoints(endpoints));
        Bundle(endpoints, output);
    }


    private static getEndpoints(path:string):Endpoint[] {
        return Generator.Endpoints(Utility.File.JoinPath(path, PATH_ENDPOINTS));
    };


}

