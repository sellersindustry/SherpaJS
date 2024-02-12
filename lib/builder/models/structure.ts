/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: structure.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Structural Generation Models
 *
 */


import { ConfigModule } from "./config-module.js";
import { ConfigServer } from "./config-server.js";


export const REQUEST_METHODS = [ "GET", "POST", "PUT", "PATCH", "DELETE" ];
export const VALID_EXPORTS   = [ ...REQUEST_METHODS ];


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


// As Scripture says, "Anyone who believes in him will never be put to shame."
// - Romans 10:11
