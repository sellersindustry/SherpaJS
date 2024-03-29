/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Server Config Structure
 *
 */


import { FILENAME_CONFIG_SERVER, SUPPORTED_FILE_EXTENSIONS, ServerConfig, ServerStructure } from "../../models.js";
import { Files } from "../../utilities/files/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { Level, Message } from "../../utilities/logger/model.js";


export async function getServerStructure(entry:string):Promise<{ errors:Message[], server?:ServerStructure }> {
    let { filepath, errors: errorsFilepath } = getFilepath(entry);
    if (!filepath) return { errors: errorsFilepath };

    let { instance, errors: errorsInstance } = await getInstance(filepath);
    if (!instance) return { errors: errorsInstance };

    let errorsTypes = Tooling.typeCheck(filepath, "Server config", "SherpaJS.New.server", {
        filepath: Files.join(Files.getRootDirectory(), "src/compiler/models"),
        name: "ServerConfig",
    });

    return {
        server: {
            filepath: filepath,
            config: instance
        },
        errors: errorsTypes
    }
}


function getFilepath(entry:string):{ errors:Message[], filepath?:string } {
    let filepath = Files.getFilepathVariableExtension(
        entry,
        FILENAME_CONFIG_SERVER,
        SUPPORTED_FILE_EXTENSIONS
    );
    if (filepath) {
        return { filepath, errors: [] };
    }
    return {
        errors: [{
            level: Level.ERROR,
            text: "Server config file could not be found.",
            content: `Must have server config, "${FILENAME_CONFIG_SERVER}" `
                + `of type "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
            file: { filepath: entry }
        }]
    };
}


async function getInstance(filepath:string):Promise<{ errors:Message[], instance?:ServerConfig }> {
    try {
        if (!Tooling.hasDefaultExport(filepath)) {
            return {
                errors: [{
                    level: Level.ERROR,
                    text: "Server config file has no default export.",
                    file: { filepath: filepath }
                }]
            };
        }
        return {
            errors: [],
            instance: await Tooling.getDefaultExport(filepath) as ServerConfig
        }
    } catch (e) {
        return {
            errors: [{
                level: Level.ERROR,
                text: "Server config file could not be processed.",
                content: `Ensure server config has default export.`,
                file: { filepath: filepath }
            }]
        };
    }
}


// Therefore I tell you, whatever you ask for in prayer, believe that you have
// received it, and it will be yours.
// - Mark 11:24
