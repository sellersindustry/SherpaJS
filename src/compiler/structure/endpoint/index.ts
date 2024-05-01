/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Fri Apr 19 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Get Endpoint Structure
 *
 */


import { ExportedVariable, Tooling } from "../../utilities/tooling/index.js";
import { Level, Message } from "../../utilities/logger/model.js";
import {
    EndpointTree, ModuleConfigFile, Segment,
    EXPORT_VARIABLES, EXPORT_VARIABLES_METHODS, Method,
    SUPPORTED_FILE_EXTENSIONS
} from "../../models.js";
import { Path } from "../../utilities/path/index.js";


export async function getEndpoint(module:ModuleConfigFile, filepath:string, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let logs:Message[]    = [];
    let variables         = [];
    let functionsFilepath = getFunctionsFilepath(filepath);
    let hasFunctions      = functionsFilepath != undefined;
    let viewFilepath      = getViewFilepath(filepath);
    let hasView           = viewFilepath != undefined;

    if (hasFunctions) {
        variables = await Tooling.getExportedVariables(functionsFilepath);
        logs.push(...validateExports(functionsFilepath, variables, hasView));
        if (!hasView && !hasExportMethodHandlers(variables)) {
            return { logs };
        }
    }

    if (hasView) {
        variables.push(Method.GET);
    }

    return {
        logs: logs,
        endpoints: {
            ".": {
                filepath: functionsFilepath,
                viewFilepath: viewFilepath,
                methods: getExportedMethods(variables),
                module: module,
                segments: segments
            }
        }
    }
}


function getViewFilepath(filepath:string):string|undefined {
    let directory = Path.getDirectory(filepath);
    let filename  = Path.getName(filepath);
    return Path.resolveExtension(directory, filename, SUPPORTED_FILE_EXTENSIONS.ENDPOINT.VIEW);
}


function getFunctionsFilepath(filepath:string):string|undefined {
    let directory = Path.getDirectory(filepath);
    let filename  = Path.getName(filepath);
    return Path.resolveExtension(directory, filename, SUPPORTED_FILE_EXTENSIONS.ENDPOINT.FUNCTIONS);
}


function validateExports(filepath:string, variables:ExportedVariable[], hasView:boolean):Message[] {
    let logs:Message[] = [];
    for (let variable of variables) {
        if (!EXPORT_VARIABLES.includes(variable.name)) {
            logs.push({
                level: Level.WARN,
                text: `Invalid Export "${variable}" will be ignored.`,
                content: `The only valid exports are: "${EXPORT_VARIABLES.join("\", \"")}".`,
                file: { filepath: filepath }
            });
        }
        if (hasView && variable.name == Method.GET) {
            logs.push({
                level: Level.ERROR,
                text: `Invalid Export "GET" cannot be used with a view.`,
                file: { filepath: filepath }
            });
        }
    }
    if (!hasView && !hasExportMethodHandlers(variables)) {
        logs.push({
            level: Level.WARN,
            text: "No Valid Exports. No route will be generated.",
            content: `The only valid exports are: "${EXPORT_VARIABLES.join("\", \"")}".`,
            file: { filepath: filepath }
        });
    }
    return logs;
}


function getExportedMethods(variables:ExportedVariable[]):Method[] {
    return variables.filter(variable => {
        return EXPORT_VARIABLES_METHODS.includes(variable.name);
    }).map(variable => Method[variable.name as keyof typeof Method]);
}


function hasExportMethodHandlers(variables:ExportedVariable[]):boolean {
    return variables.some((variable) => EXPORT_VARIABLES_METHODS.includes(variable.name));
}


// In the same way, faith by itself, if it is not accompanied by action, is dead.
// - James 2:17
