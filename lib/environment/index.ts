/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Environment SDK
 *
 */


import { ConfigAppProperties, ConfigModule, ConfigServer, Endpoint } from "../builder/models";
import { SherpaRequest } from "./request";
import NewResponse from "./response";


export class Environment {
    
    private appID:string;
    private server:ConfigServer;
    private module: ConfigModule;
    private properties:ConfigAppProperties;


    constructor (server:ConfigServer, module:ConfigModule, endpoint:Endpoint) {
        this.server     = server;
        this.module     = module;
        this.appID      = Environment.initAppID(endpoint);
        this.properties = Environment.initProperties(server, endpoint);
    }


    GetServerConfig():ConfigServer {
        return this.server;
    }


    GetModuleConfig():ConfigModule {
        return this.module;
    }


    GetModuleID():string {
        return this.appID;
    }


    GetProperties():ConfigAppProperties {
        return this.properties;
    }


    private static initAppID(endpoint:Endpoint):string {
        let subroute = Environment.getSubroute(endpoint);
        return subroute.length == 0 ? "." : subroute.join(".");
    }


    private static initProperties(server:ConfigServer, endpoint:Endpoint):ConfigAppProperties {
        let subroute = Environment.getSubroute(endpoint);
        let obj = server.app;
        subroute.forEach((id) => {
            obj = obj["/" + id];
        });
        return obj["properties"];
    }


    private static getSubroute(endpoint:Endpoint):string[] {
        return endpoint.route.filter((r) => r.isSubroute).map((r) => r.name);
    }


    static Response(body?:unknown, options?:ResponseInit):Response {
        return NewResponse(body, options);
    }


}


export type { SherpaRequest };


// Now faith is confidence in what we hope for and assurance about what
// we do not see.
// - Hebrews 11:1
