import { ConfigModule } from "./config-module";
import { ConfigServer } from "./config-server";


export const VALID_EXPORTS = ["GET", "POST", "PUT", "PATCH", "DELETE"];


export type Server = {
    modules:Module[];
    config:{
        instance:ConfigServer;
        path:string;
    }
}


export type Module = {
    endpoints:Endpoint[];
    subroute:string[];
    config:{
        instance:ConfigModule;
        path:string;
    };
}


export type Endpoint = {
    filename:string;
    filetype:string;
    filepath:string;
    exports:string[];
    route:Route[];
};


export type Route = {
    name:string;
    isDynamic:boolean;
    orginal?:string;
    isSubroute?:boolean;
};

