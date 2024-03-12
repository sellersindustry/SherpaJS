/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: endpoints.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Endpoint Linter
 *
 */


import { Log, LogLevel } from "../logger/index.js";
import { Endpoint, VALID_EXPORTS } from "../models/index.js";
import { Validate } from "./validator/index.js";


const VALID_FILE_TYPES = ["JS", "CJS", "TS"];


export function Linter(endpoints:Endpoint[]):Log[] {
    let messages:Log[] = [];
    for (let endpoint of endpoints) {
        messages.push(...filetype(endpoint));
        messages.push(...filename(endpoint));
        messages.push(...routes(endpoint));
        messages.push(...exported(endpoint));
    }
    return messages;
}


function filetype(endpoint:Endpoint):Log[] {
    if (VALID_FILE_TYPES.includes(endpoint.filetype.toUpperCase())) return [];
    return [{
        level: LogLevel.ERROR,
        message: "Invalid File Type. Must be " + VALID_FILE_TYPES.join(", ") + ".",
        path: endpoint.filepath
    }];
}


function filename(endpoint:Endpoint):Log[] {
    if (endpoint.filename == "index") return [];
    return [{
        level: LogLevel.ERROR,
        message: "Invalid File Name. File must be named \"index\".",
        path: endpoint.filepath
    }];
}


function routes(endpoint:Endpoint):Log[] {
    let fullRoute = endpoint.route.map(r => r.original).join("/");
    for (let subroute of endpoint.route) {
        if (!Validate.AlphaNumericDash(subroute.name)) {
            return [{
                level: LogLevel.ERROR,
                message: `Routes should only contain letters, numbers, and `
                    + `dashes. The following route is invalid: "${fullRoute}".`,
                path: endpoint.filepath
            }];
        }
        if (subroute.original.toLowerCase() != subroute.original && !subroute.isDynamic) {
            return [{
                level: LogLevel.WARN,
                message: `Routes should be lowercase "${fullRoute}".`,
                path: endpoint.filepath
            }];
        }
    }
    return [];
}


function exported(endpoint:Endpoint):Log[] {
    let messages:Log[] = [];
    for (let variable of endpoint.exports) {
        if (!VALID_EXPORTS.includes(variable)) {
            messages.push({
                level: LogLevel.WARN,
                message: `Invalid Export. "${variable}" will be ignored. `
                    + "Must be " + VALID_EXPORTS.join(", ") + ".",
                path: endpoint.filepath
            });
        }
    }
    if ( endpoint.exports.filter((name) => VALID_EXPORTS.includes(name)).length == 0) {
        messages.push({
            level: LogLevel.ERROR,
            message: "No Valid Exports. No route will be generated.",
            path: endpoint.filepath
        });
    }
    return messages;
}


// In the same way, faith by itself, if it is not accompanied by action, is dead.
// - James 2:17
