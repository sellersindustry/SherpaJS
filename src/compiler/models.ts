
export const CONTEXT_SCHEMA_TYPE_NAME  = "ContextSchema";
export const SUPPORTED_FILE_EXTENSIONS = ["JS", "CJS", "TS"];
export const FILENAME_CONFIG_MODULE    = "sherpa.module";
export const FILENAME_CONFIG_SERVER    = "sherpa.server";
export const VALID_EXPORTS             = ["GET", "POST", "PATCH", "DELETE", "PUT"];


export type Context = unknown;


export type ServerConfig = {
    context?:Context;
};


export type ServerStructure = {
    filepath:string;
    config:ServerConfig;
};


export type ModuleConfig = {
    name:string;
};


export type ModuleStructure = {
    filepath:string;
    context:Context;
    config:ModuleConfig;
    hasContextSchema:boolean;
};


export enum Method {
    GET="GET",
    PUT="PUT",
    POST="POST",
    PATCH="PATCH",
    DELETE="DELETE"
}


export type Segment = {
    name:string;
    isDynamic:boolean;
}


export type Route = {
    [key:string]:Route|Endpoint;
}


export type Endpoint = {
    filepath:string;
    methods:Method[];
    module:ModuleStructure;
    segments:Segment[];
}


export type LoadModule = {
    entry:string;
    context?:Context;
}

