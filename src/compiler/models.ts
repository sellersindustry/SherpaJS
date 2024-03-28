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
    contextFilepath:string;
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


export type LoadModule<T=undefined> = {
    entry: string;
} & (T extends undefined ? { context?: unknown } : { context: T });


export enum BundlerType {
    Vercel = "Vercel",
    local  = "local",
}


export type EnvironmentVariables = { [key:string]:string };


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
