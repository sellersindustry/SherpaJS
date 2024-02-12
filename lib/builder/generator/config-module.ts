/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: config-module.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Generate Module Config Structure
 *
 */


import { SourceCode } from "../sourcecode";
import { Logger } from "../logger";
import { ConfigModule } from "../models";
import { Utility } from "../utilities";


const CONFIG_FILE_NAME  = "sherpa.module";
const CONFIG_FILE_TYPES = ["JS", "CJS", "TS"];


export async function GetConfigModule(path:string):Promise<{ instance:ConfigModule, path:string }> {
    let filepath = GetConfigModuleFilepath(path);
    if (!filepath)
        Logger.RaiseError({
            message: "Module config file could not be found.",
            path: path
        });
    return {
        instance: await loadDefaultExport(filepath) as ConfigModule,
        path: filepath
    };
}


export function GetConfigModuleFilepath(path:string):string|undefined {
    return Utility.File.GetFileVaribleExtensions(
        path,
        CONFIG_FILE_NAME,
        CONFIG_FILE_TYPES
    );
}


async function loadDefaultExport(file:string):Promise<unknown> {  
    try {
        return SourceCode.GetDefaultExport(file);
    } catch (e) {
        Logger.RaiseError({
            message: "Module Config failed to load.",
            content: "Ensure there is a default export.",
            path: file
        });
    }
}


// Whoever believes and is baptized will be saved, but whoever does not believe
// will be condemned.
// - Mark 16:16
