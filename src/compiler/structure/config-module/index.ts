/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Module Config Structure
 *
 */


import {
    ModuleConfigFile, ModuleConfig,
    Context, ModuleInterface,
    FILENAME, FILE_EXTENSIONS
} from "../../models.js";
import fs from "fs";
import { Path } from "../../utilities/path/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { Level, Message } from "../../utilities/logger/model.js";


export async function getModuleConfig(entry:string, context:Context, contextFilepath:string):Promise<{ logs:Message[], module?:ModuleConfigFile }> {
    let logs:Message[] = [];

    let { filepath, logs: logsFilepath } = getFilepath(entry);
    logs.push(...logsFilepath);
    if (!filepath) return {
        logs: logsFilepath };

    let { instance, logs: logsInstance } = await getInstance(filepath);
    if (!instance) return { logs: logsInstance };

    logs.push(...lint(entry));

    return {
        module: {
            entry: entry,
            filepath: filepath,
            context: context,
            contextFilepath: contextFilepath,
            instance: instance
        },
        logs
    }
}


function getFilepath(entry:string):{ logs:Message[], filepath?:string } {
    let filepath = Path.resolveExtension(
        entry,
        FILENAME.CONFIG.MODULE,
        FILE_EXTENSIONS.CONFIG.MODULE
    );
    if (filepath) {
        return { filepath, logs: [] };
    }
    return {
        logs: [{
            level: Level.ERROR,
            text: "Module config file could not be found.",
            content: `Must have module config, "${FILENAME.CONFIG.MODULE}" `
                + `of type "${FILE_EXTENSIONS.CONFIG.MODULE.join("\", \"")}".`,
            file: { filepath: entry }
        }]
    };
}


async function getInstance(filepath:string):Promise<{ logs:Message[], instance?:ModuleConfig<ModuleInterface<unknown>, unknown> }> {
    let { module, logs } = await Tooling.getExportedLoader(filepath, "Module Config", "SherpaJS.New.module", "sherpa-core");
    if (!module) {
        return { logs };
    }
    try {
        return {
            logs: await Tooling.typeValidation(filepath, "Module Config"),
            instance: await Tooling.getDefaultExport(filepath) as ModuleConfig<ModuleInterface<unknown>, unknown>
        }
    } catch (e) {
        return {
            logs: [{
                level: Level.ERROR,
                text: "Module config file could not be loaded.",
                content: e.message,
                file: { filepath: filepath }
            }]
        };
    }
}


function lint(entry:string):Message[] {
    return [
        ...lintPackageJSON(entry)
    ];
}


function lintPackageJSON(entry:string):Message[] {
    try {
        let logs:Message[] = [];
        let filepath       = Path.join(entry, "package.json");
        if (!fs.existsSync(filepath)) {
            return [];
        }

        let packageJSON = JSON.parse(fs.readFileSync(filepath, "utf8"));
        if (packageJSON.type !== "module") {
            logs.push({
                level: Level.WARN,
                text: `package.json is not configured properly.`,
                content: `Ensure the "type" attribute is set to "module".`,
                file: { filepath: filepath }
            });
        }
        logs.push(...lintPackageExports(filepath, entry, packageJSON));
        
        return logs;
    } catch {
        return [];
    }
}


function lintPackageExports(filepath:string, entry:string, packageJSON:Record<string, unknown>):Message[] {
    for (let exportFilepath of getAllExported(packageJSON.exports as string|string[]|Record<string, unknown>)) {
        let expectedFilepath = Path.resolveExtension(entry, FILENAME.CONFIG.MODULE, FILE_EXTENSIONS.CONFIG.MODULE);
        if (expectedFilepath == Path.join(entry, exportFilepath)) {
            return [];
        }
    }
    return [{
        level: Level.WARN,
        text: `package.json is not configured properly.`,
        content: `Ensure the "exports" attribute contains the "${FILENAME.CONFIG.MODULE}" file.`,
        file: { filepath: filepath }
    }];
}


function getAllExported(exports:string|string[]|Record<string, unknown>):string[] {
    if (typeof exports === "string") {
        return [exports];
    } else if (Array.isArray(exports)) {
        return exports;
    } else if (typeof exports === "object") {
        return Object.keys(exports).map(o => getAllExported(exports[o] as string|string[]|Record<string, unknown>)).flat(3);
    }
    return [];
}


// Whoever believes and is baptized will be saved, but whoever does not believe
// will be condemned.
// - Mark 16:16
