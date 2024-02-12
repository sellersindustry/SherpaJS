/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: endpoints.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Generate Endpoint Structure
 *
 */


import { Logger } from "../logger/index.js";
import { Endpoint, Route } from "../models/index.js";
import { SourceCode } from "../sourcecode/index.js";
import { Utility } from "../utilities/index.js";


export function GetEndpoints(path:string, subroute:string[]):Endpoint[] {
    if (!Utility.File.Exists(path))
        Logger.RaiseError({
            message: "Directory does not exist. Unable to generate endpoints.",
            path: path
        });
    let endpoints = Utility.File.Walk(path).map(filepath => {
        filepath = Utility.File.JoinPath(path, filepath);
        return {
            filename: Utility.File.GetName(filepath),
            filetype: Utility.File.GetExtension(filepath),
            filepath: filepath,
            exports: getExportedVariables(filepath),
            route: [...getSubroute(subroute), ...getRoute(filepath, path)]
        };
    }).filter(endpoint => !endpoint.filename.includes(".map"));
    return endpoints;
}


function getExportedVariables(filepath:string):string[] {
    try {
        return SourceCode.GetExportedVariableNames(filepath);
    } catch {
        Logger.RaiseError({
            message: `Unable to extract exported variables.`,
            path: filepath
        });
    }
}


function getSubroute(subroute:string[]):Route[] {
    return subroute.map((name) => {
        return {
            name: name.toLowerCase(),
            orginal: name,
            isDynamic: false,
            isSubroute: true
        }
    });
}


function getRoute(filepath:string, path:string):Route[] {
    return Utility.File.Relative(path, Utility.File.GetDirectory(filepath))
        .split("/")
        .filter(s => s != "")
        .map((name) => {
            return {
                name: getRouteName(name),
                isDynamic: isDynamic(name),
                orginal: name
            }
        });
}


function isDynamic(name:string):boolean {
    return name.startsWith("[") && name.endsWith("]");
}


function getRouteName(name:string):string {
    return (isDynamic(name) ? name.slice(1, -1) : name).toLowerCase()
}


// Who is it that overcomes the world? Only the one who believes that Jesus
// is the Son of God.
// - 1 John 5:5
