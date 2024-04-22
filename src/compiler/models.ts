/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: models.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Models
 *
 */


import { BuildOptions as ESBuildOptions } from "esbuild";


export const CONTEXT_SCHEMA_TYPE_NAME  = "ContextSchema";
export const SUPPORTED_FILE_EXTENSIONS = ["JS", "TS"];
export const FILENAME_CONFIG_MODULE    = "sherpa.module";
export const FILENAME_CONFIG_SERVER    = "sherpa.server";
export const EXPORT_VARIABLES_METHODS  = ["GET", "POST", "PATCH", "DELETE", "PUT"];
export const EXPORT_VARIABLES          = [...EXPORT_VARIABLES_METHODS];


export type Context = unknown;


export type ServerConfig<T=Context> = (T extends undefined ? {
    context?: unknown
} : {
    context: T
});


export type ServerConfigFile = {
    filepath:string;
    instance:ServerConfig;
};


export interface ModuleInterface<Schema> {
    context:Schema;
}


export class CreateModuleInterface<Schema> implements ModuleInterface<Schema> {
    context:Schema;
    constructor(context:Schema) { this.context = context; }
}


export type InstantiableModuleInterface<Interface extends ModuleInterface<Schema>, Schema> = {
    new (context:Schema):Interface;
};


export type ModuleConfig<Interface extends ModuleInterface<Schema>, Schema> = {
    name:string;
    interface:InstantiableModuleInterface<Interface, Schema>;
};


export type ModuleLoader<Interface extends ModuleInterface<Schema>, Schema> = ModuleConfig<Interface, Schema> & {
    load:(context:Schema) => Interface;
};


export type ModuleConfigFile = {
    entry:string;
    filepath:string;
    instance:ModuleConfig<ModuleInterface<unknown>, unknown>;
    context:Context;
    contextFilepath:string;
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


export type Endpoint = {
    filepath:string;
    methods:Method[];
    module:ModuleConfigFile;
    segments:Segment[];
}


export type EndpointTree = {
    [key:string]:EndpointTree|Endpoint;
}


export type EndpointStructure = {
    list:Endpoint[];
    tree:EndpointTree;
}


export enum BundlerType {
    Vercel = "Vercel",
    local  = "local",
}


export type EnvironmentVariables = { [key:string]:string|number|boolean };


export type BuildOptions = {
    input:string;
    output:string;
    bundler:BundlerType;
    developer?:{
        bundler?:{
            esbuild?:Partial<ESBuildOptions>;
        },
        environment?:{
            variables?:EnvironmentVariables,
            files?:string[]
        }
    }
}


// Because you know that the testing of your faith produces perseverance.
// - James 1:3
