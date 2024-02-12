/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: config-server.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Generate Server Config Structure
 *
 */


import { SourceCode } from "../sourcecode";
import { Logger } from "../logger";
import { ConfigServer, ConfigAppProperties } from "../models";
import { Utility } from "../utilities";


const CONFIG_FILE_NAME  = "sherpa.server";
const CONFIG_FILE_TYPES = ["JS", "CJS", "TS"];


export async function GetConfigServer(path:string):Promise<{ instance:ConfigServer, path:string }> {
    let filepath = GetConfigServerFilepath(path);
    if (!filepath) {
        Logger.RaiseError({
            message: "Server config file could not be found.",
            path: path
        });
    }
    let config = await loadDefaultExport(filepath) as ConfigServer;
    return {
        instance: resolveModulePath(config, path),
        path: filepath
    };
}


export function GetConfigServerFilepath(path:string):string|undefined {
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
            message: "Server Config failed to load.",
            content: "Ensure there is a default export.",
            path: file
        });
    }
}


function resolveModulePath(config:ConfigServer, path:string):ConfigServer {
    if (!config.app) return config;
    return { ...config, app: _resolveModulePath(config.app, path) };
}


function _resolveModulePath(route:ConfigAppProperties, path:string):ConfigAppProperties {
    if (route["module"]) {
        let reg = Utility.File.JoinPath(path, route["module"]);
        let npm = Utility.File.JoinPath(path, "node_modules", route["module"]);
        if (Utility.File.Exists(reg)) {
            route["filepath"] = reg;
        } else if (Utility.File.Exists(npm)) {
            route["filepath"] = npm;
        } else {
            Logger.RaiseError({
                message: `Module Server failed to load. Unable to find Sherpa `
                    + `module "${route["module"]}".`
            });
        }
    } else {
        let keys = Object.keys(route);
        for (let key of keys) {
            route[key] = _resolveModulePath(route[key], path);
        }
    }
    return route;
}


// Therefore I tell you, whatever you ask for in prayer, believe that you have
// received it, and it will be yours.
// - Mark 11:24
