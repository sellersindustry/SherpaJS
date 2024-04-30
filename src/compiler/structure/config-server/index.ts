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


import {
    FILENAME_CONFIG_MODULE, FILENAME_CONFIG_SERVER,
    SUPPORTED_FILE_EXTENSIONS, ServerConfig, ServerConfigFile
} from "../../models.js";
import { Path } from "../../utilities/path/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { Level, Message } from "../../utilities/logger/model.js";
import { getModuleConfig } from "../config-module/index.js";


export async function getServerConfig(entry:string):Promise<{ logs:Message[], server?:ServerConfigFile }> {
    let logs:Message[] = [];
    
    let { filepath, logs: logsFilepath } = getFilepath(entry);
    logs.push(...logsFilepath);
    if (!filepath) return { logs };

    let { instance, logs: logsInstance } = await getInstance(filepath);
    logs.push(...logsInstance);
    if (!instance) return { logs };

    logs.push(...await verifyModuleConfig(entry));
    logs.push(...await Tooling.typeValidation(filepath, "Server config"));

    return {
        server: {
            filepath: filepath,
            instance: instance
        },
        logs
    }
}


function getFilepath(entry:string):{ logs:Message[], filepath?:string } {
    let filepath = Path.resolveExtension(
        entry,
        FILENAME_CONFIG_SERVER,
        SUPPORTED_FILE_EXTENSIONS
    );
    if (filepath) {
        return { filepath, logs: [] };
    }
    return {
        logs: [{
            level: Level.ERROR,
            text: "Server config file could not be found.",
            content: `Must have server config, "${FILENAME_CONFIG_SERVER}" `
                + `of type "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
            file: { filepath: entry }
        }]
    };
}


async function getInstance(filepath:string):Promise<{ logs:Message[], instance?:ServerConfig }> {
    let { module, logs } = await Tooling.getExportedLoader(filepath, "Server Config", "SherpaJS.New.server", "sherpa-core");
    if (!module) {
        return { logs };
    }
    try {
        return {
            logs: await Tooling.typeValidation(filepath, "Server Config"),
            instance: await Tooling.getDefaultExport(filepath) as ServerConfig
        }
    } catch (e) {
        return {
            logs: [{
                level: Level.ERROR,
                text: "Server config file could not be loaded.",
                content: e.message,
                file: { filepath: filepath }
            }]
        };
    }
}


async function verifyModuleConfig(entry:string):Promise<Message[]> {
    if (hasModuleConfig(entry)) {
        return (await getModuleConfig(entry, undefined, undefined)).logs;
    }
    return [];
}


function hasModuleConfig(entry:string):boolean {
    return Path.resolveExtension(
        entry,
        FILENAME_CONFIG_MODULE,
        SUPPORTED_FILE_EXTENSIONS
    ) != undefined;
}


// Therefore I tell you, whatever you ask for in prayer, believe that you have
// received it, and it will be yours.
// - Mark 11:24
