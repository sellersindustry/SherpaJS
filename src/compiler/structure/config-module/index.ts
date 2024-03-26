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
    CONTEXT_SCHEMA_TYPE_NAME, FILENAME_CONFIG_MODULE,
    ModuleStructure, SUPPORTED_FILE_EXTENSIONS,
    ModuleConfig, Context
} from "../../models.js";
import { Files } from "../../utilities/files/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { Level, Message } from "../../utilities/logger/model.js";


export async function getModuleStructure(entry:string, context:Context|undefined, contextFilepath:string):Promise<{ errors:Message[], module?:ModuleStructure }> {
    let { filepath, errors: errorsFilepath } = getFilepath(entry);
    if (!filepath) return { errors: errorsFilepath };

    let { instance, errors: errorsInstance } = await getInstance(filepath);
    if (!instance) return { errors: errorsInstance };

    let hasContextSchema  = getHasContextSchema(filepath);
    let errorsModuleTypes = Tooling.typeCheck(filepath, "Module Config", "SherpaJS.New.module", {
        filepath: Files.join(Files.getRootDirectory(), "src/compiler/models"),
        name: "ModuleConfig"
    });
    let errorsLoaderTypes = Tooling.typeCheck(contextFilepath, "Module Loader", "SherpaJS.Load.module", {
        filepath: Files.join(Files.getRootDirectory(), "src/compiler/models"),
        name: "LoadModule",
        subtype: hasContextSchema ? {
            name: CONTEXT_SCHEMA_TYPE_NAME,
            filepath: filepath.replace(/\.[a-zA-Z0-9]+$/, "")
        } : undefined
    }).map((message:Message) => {
        if (message.text.includes(CONTEXT_SCHEMA_TYPE_NAME)) {
            message.content = `${CONTEXT_SCHEMA_TYPE_NAME} at (${filepath})`
        }
        return message;
    });

    return {
        module: {
            filepath: filepath,
            context: context,
            contextFilepath: contextFilepath,
            config: instance,
            hasContextSchema: hasContextSchema
        },
        errors: [...errorsModuleTypes, ...errorsLoaderTypes]
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


async function getInstance(filepath:string):Promise<{ errors:Message[], instance?:ModuleConfig }> {
    try {
        return {
            errors: [],
            instance: await Tooling.getDefaultExport(filepath) as ModuleConfig
        }
    } catch (e) {
        return {
            errors: [{
                level: Level.ERROR,
                text: "Module config file could not be processed.",
                content: `Ensure module config has default export.`,
                file: { filepath: filepath }
            }]
        };
    }
}


function getHasContextSchema(filepath:string):boolean {
    let exportedVariables = Tooling.getExportedVariableNames(filepath);
    let exportedSchema    = exportedVariables.includes(CONTEXT_SCHEMA_TYPE_NAME);
    let isTypescript      = Files.getExtension(filepath) == "TS";
    return exportedSchema && isTypescript;
}


// Whoever believes and is baptized will be saved, but whoever does not believe
// will be condemned.
// - Mark 16:16
