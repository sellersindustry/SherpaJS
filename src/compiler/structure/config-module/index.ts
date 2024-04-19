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
    FILENAME_CONFIG_MODULE,
    ModuleConfigFile, SUPPORTED_FILE_EXTENSIONS,
    ModuleConfig, Context, ModuleInterface
} from "../../models.js";
import { Files } from "../../utilities/files/index.js";
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

    return {
        module: {
            entry: entry,
            filepath: filepath,
            context: context,
            contextFilepath: contextFilepath,
            instance: instance
        },
        logs: []
    }
}


function getFilepath(entry:string):{ logs:Message[], filepath?:string } {
    let filepath = Files.getFilepathVariableExtension(
        entry,
        FILENAME_CONFIG_MODULE,
        SUPPORTED_FILE_EXTENSIONS
    );
    if (filepath) {
        return { filepath, logs: [] };
    }
    return {
        logs: [{
            level: Level.ERROR,
            text: "Module config file could not be found.",
            content: `Must have module config, "${FILENAME_CONFIG_MODULE}" `
                + `of type "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
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
            logs: Tooling.typeCheck(filepath, "Module Config"),
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


// Whoever believes and is baptized will be saved, but whoever does not believe
// will be condemned.
// - Mark 16:16
