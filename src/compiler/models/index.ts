
export const CONTEXT_SCHEMA_TYPE_NAME  = "ContextSchema";
export const SUPPORTED_FILE_EXTENSIONS = ["JS", "CJS", "TS"];
export const FILENAME_CONFIG_MODULE    = "sherpa.module";
export const FILENAME_CONFIG_SERVER    = "sherpa.server";


export type Context = unknown;


export type ServerConfig = {
    context?:Context;
};


export type ServerStructure = {
    filepath:string;
    instance:ServerConfig;
};


export type ModuleConfig = {
    name:string;
};


export type ModuleStructure = {
    filepath:string;
    instance:ModuleConfig;
    hasContextSchema:boolean;
};


export enum Method {
    GET="GET",
    PUT="PUT",
    POST="POST",
    PATCH="PATCH",
    DELETE="DELETE"
}


export enum RouteType {
    Segment,
    Module,
    Endpoint
}


export type Route = RouteSegment|RouteModule|RouteEndpoint;


export type RouteEndpoint = {
    type:RouteType.Endpoint;
    filepath:string;
    methods:Method[];
    module:ModuleStructure;
    //! Add routes + dynamic routes (segments??)
}


export type RouteSegment = {
    type:RouteType.Segment;
    segments:{ [key:string]:Route };
}


export type RouteModule = {
    type:RouteType.Module;
    entry:string;
}

