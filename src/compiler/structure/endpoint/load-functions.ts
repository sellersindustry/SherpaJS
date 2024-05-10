/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Fri Apr 19 2024
 *   file: load-functions.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Get Endpoint Functions
 *
 */


import { ExportedVariable, Tooling } from "../../utilities/tooling/index.js";
import { Level, Message } from "../../utilities/logger/model.js";
import {
    EndpointTree, ModuleConfigFile, Segment,
    EXPORT_VARIABLES, EXPORT_VARIABLES_METHODS, Method,
    FILENAME
} from "../../models.js";


export async function getEndpointFunctions(module:ModuleConfigFile, functionsFilepath:string|undefined, viewFilepath:string|undefined, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let logs:Message[]               = [];
    let variables:ExportedVariable[] = [];
    let hasView:boolean              = viewFilepath != undefined;

    if (functionsFilepath != undefined) {
        variables = await Tooling.getExportedVariables(functionsFilepath);
        logs.push(...validateExports(functionsFilepath, variables, hasView));
        if (!hasView && !hasExportMethodHandlers(variables)) {
            return { logs };
        }
    }

    if (hasView) {
        variables.push({ name: Method.GET });
    }

    return {
        logs: logs,
        endpoints: {
            ".": {
                filepath: functionsFilepath as string,
                viewFilepath: viewFilepath,
                methods: getExportedMethods(variables),
                module: module,
                segments: segments
            }
        }
    }
}


function validateExports(filepath:string, variables:ExportedVariable[], hasView:boolean):Message[] {
    let logs:Message[] = [];
    if (variables.length == 1 && variables[0].name == "default") {
        logs.push({
            level: Level.ERROR,
            text: `Invalid export "default" cannot be used with a functions endpoint.`,
            content: `You might be trying to use a module endpoint, if this is the case, name the file "${FILENAME.ENDPOINT.MODULE}".`,
            file: { filepath: filepath }
        });
        return logs;
    }
    for (let variable of variables) {
        if (!EXPORT_VARIABLES.includes(variable.name)) {
            logs.push({
                level: Level.WARN,
                text: `Invalid Export "${variable.name}" will be ignored.`,
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
