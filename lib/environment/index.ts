import { ConfigAppProperties, ConfigServer, Endpoint } from "../builder/models";
import { SherpaRequest } from "./request";
import NewResponse from "./response";


export class Environment {
    
    private moduleID:string[];
    private server:ConfigServer;
    private properties:ConfigAppProperties;


    constructor (server:ConfigServer, endpoint:Endpoint) {
        this.server     = server;
        this.moduleID   = Environment.initModuleID(endpoint);
        this.properties = Environment.initProperties(server, this.moduleID);
    }


    GetServerConfig():ConfigServer {
        return this.server;
    }


    GetModuleID():string {
        return this.moduleID.join(".");
    }


    GetProperties():ConfigAppProperties {
        return this.properties;
    }


    private static initModuleID(endpoint:Endpoint):string[] {
        return endpoint.route.filter((r) => r.isSubroute).map((r) => r.name);
    }


    private static initProperties(server:ConfigServer, moduleID:string[]):ConfigAppProperties {
        let obj = server.app;
        moduleID.forEach((id) => {
            obj = obj["/" + id];
        });
        return obj;
    }


    static Response(body?:unknown, options?:ResponseInit):Response {
        return NewResponse(body, options);
    }


}


export type { SherpaRequest };
