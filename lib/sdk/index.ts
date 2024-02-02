import { ConfigAppProperties, ConfigServer, Endpoint } from "../builder/models";
import { BundlerType } from "../builder/models/build";
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


    static ProcessRequest(request:Request, type:BundlerType):SherpaRequest {
        if (type === BundlerType.Vercel) {
            return SherpaSDK.processRequestVercel(request);
        } else {
            throw new Error("Not implemented");
        }

    }


    private static processRequestVercel(request:Request):SherpaRequest {
        let params   = new URLSearchParams(request.url);
        let _request = request as SherpaRequest;
        _request["query"]  = {};
        _request["params"] = {};
        params.forEach((value, key) => {
            if (key.startsWith("PARAM--")) {
                _request["params"][key.replace("PARAM--", "")] = value;
            } else {
                _request["query"][key] = value;
            }
        });
        return _request;
    }


}


export type { SherpaRequest };
