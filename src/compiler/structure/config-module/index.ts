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
    ModuleStructure, SUPPORTED_FILE_EXTENSIONS,
    ModuleConfig, Context, HasContext
} from "../../models.js";
import { Files } from "../../utilities/files/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { Level, Message } from "../../utilities/logger/model.js";


export async function getModuleStructure(entry:string, context:Context, contextFilepath:string):Promise<{ errors:Message[], module?:ModuleStructure }> {
    let { filepath, errors: errorsFilepath } = getFilepath(entry);
    if (!filepath) return { errors: errorsFilepath };

    let { instance, errors: errorsInstance } = await getInstance(filepath);
    if (!instance) return { errors: errorsInstance };

    return {
        module: {
            filepath: filepath,
            context: context,
            contextFilepath: contextFilepath,
            config: instance
        },
        errors: []
    }
}


function getFilepath(entry:string):{ errors:Message[], filepath?:string } {
    let filepath = Files.getFilepathVariableExtension(
        entry,
        FILENAME_CONFIG_MODULE,
        SUPPORTED_FILE_EXTENSIONS
    );
    if (filepath) {
        return { filepath, errors: [] };
    }
    return {
        errors: [{
            level: Level.ERROR,
            text: "Module config file could not be found.",
            content: `Must have module config, "${FILENAME_CONFIG_MODULE}" `
                + `of type "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
            file: { filepath: entry }
        }]
    };
}


async function getInstance(filepath:string):Promise<{ errors:Message[], instance?:ModuleConfig<HasContext<unknown>, unknown> }> {
    try {
        //! FIXME - ENSURE IMPORT OF OF SHERPAJS from sherpa-core
        if (!Tooling.hasExportedLoader(filepath, "SherpaJS.New.module")) {
            return {
                errors: [{
                    level: Level.ERROR,
                    text: "Module config file has no default export.",
                    content: "Ensure you are default exporting using \"SherpaJS.New.module\".",
                    file: { filepath: filepath }
                }]
            };
        }
        return {
            errors: Tooling.typeCheck(filepath, "Module Config"),
            instance: await Tooling.getDefaultExport(filepath) as ModuleConfig<HasContext<unknown>, unknown>
        }
    } catch (e) {
        return {
            errors: [{
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
