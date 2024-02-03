import { ConfigAppProperties, ConfigServer, Endpoint } from "../builder/models";
import { SherpaRequest } from "./request";


export class SherpaSDK {
    
    private moduleID:string[];
    private server:ConfigServer;
    private properties:ConfigAppProperties;


    constructor (server:ConfigServer, endpoint:Endpoint) {
        this.server     = server;
        this.moduleID   = SherpaSDK.initModuleID(endpoint);
        this.properties = SherpaSDK.initProperties(server, this.moduleID);
    }


    GetServerConfig():ConfigServer {
        return this.server;
    }


    GetModuleID():string {
        return this.moduleID.join(".");
    }


    GetAppProperties():ConfigAppProperties {
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


}


export type { SherpaRequest };
