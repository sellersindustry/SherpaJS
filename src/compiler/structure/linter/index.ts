/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Endpoint Linter
 *
 */


import { Files } from "../../utilities/files/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { Level, Message } from "../../utilities/logger/model.js";
import { LoadModule, SUPPORTED_FILE_EXTENSIONS, VALID_EXPORTS } from "../../models.js";
import {
    DirectoryStructureFile as DirStructFile,
    DirectoryStructure as DirStruct,
    DirectoryStructureTree as DirStructTree
} from "../directory-structure/model.js";


const REGEX_SEGMENT = /^([a-zA-Z0-9-]+)|(\[[a-zA-Z0-9-]+\])$/;

export async function lint(structure:DirStruct, filepath:string):Promise<Message[]> {
    let errors:Message[] = [];
    for (let file of structure.list) {
        errors.push(...validateFileType(file));
        errors.push(...validateFileName(file));
        errors.push(...(await validateExports(file)));
    }
    errors.push(...validateSegments(structure.tree, filepath));
    return errors;
}


function validateFileType(file:DirStructFile):Message[] {
    let extension = Files.getExtension(file.filepath);
    if (SUPPORTED_FILE_EXTENSIONS.includes(extension))
        return [];
    return [{
        level: Level.ERROR,
        text: `Invalid File Type. Must be "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
        file: { filepath: file.filepath }
    }];
}


function validateFileName(file:DirStructFile):Message[] {
    if (Files.getName(file.filename) == "index")
        return [];
    return [{
        level: Level.ERROR,
        text: "Invalid File Name. Files must be named \"index\".",
        file: { filepath: file.filepath }
    }];
}


async function validateExports(file:DirStructFile):Promise<Message[]> {
    if (Tooling.hasDefaultExport(file.filepath)) {
        return await validateExportsModule(file);
    }
    return validateExportsEndpoints(file);
}


function validateExportsEndpoints(file:DirStructFile):Message[] {
    let errors:Message[] = [];
    let variables = Tooling.getExportedVariableNames(file.filepath);
    for (let variable of variables) {
        if (!VALID_EXPORTS.includes(variable)) {
            errors.push({
                level: Level.WARN,
                text: `Invalid Export "${variable}" will be ignored.`,
                content: `The only valid exports are: "${VALID_EXPORTS.join("\", \"")}".`,
                file: { filepath: file.filepath }
            });
        }
    }
    if (variables.filter((name) => VALID_EXPORTS.includes(name)).length == 0) {
        errors.push({
            level: Level.ERROR,
            text: "No Valid Exports. No route will be generated.",
            content: `The only valid exports are: "${VALID_EXPORTS.join("\", \"")}".`,
            file: { filepath: file.filepath }
        });
    }
    return errors;
}


async function validateExportsModule(file:DirStructFile):Promise<Message[]> {
    try {
        let moduleLoader = await Tooling.getDefaultExport(file.filepath) as LoadModule;
        if (!moduleLoader["entry"] || typeof moduleLoader["entry"] !== "string") {
            return [{
                level: Level.ERROR,
                text: `Module loader failed to define a module "entry" point.`,
                file: { filepath: file.filepath }
            }];
        }

        let entry = Tooling.resolve(moduleLoader.entry, file.filepath);
        if (!entry) {
            return [{
                level: Level.ERROR,
                text: `Unable to resolve module \"${moduleLoader.entry}\".`,
                file: { filepath: file.filepath }
            }];
        }

        return []; //! FIXME - VALIDATE CONTEXT BY SCHEMA LATER
    } catch {
        return [{
            level: Level.ERROR,
            text: "Failed to load module loader.",
            content: "Ensure a module loader are default exported.",
            file: { filepath: file.filepath }
        }];
    }
}


function validateSegments(structure:DirStructTree, filepath:string):Message[] {
    let errors:Message[] = [];
    for (let segmentName of Object.keys(structure.directories)) {
        let _filepath = Files.join(filepath, segmentName);
        errors.push(...validateSegmentName(segmentName, _filepath));
        errors.push(...validateSegments(structure.directories[segmentName], _filepath));
    }
    return errors;
}


function validateSegmentName(segment:string, filepath?:string):Message[] {
    let errors:Message[] = [];
    if (!REGEX_SEGMENT.test(segment)) {
        errors.push({
            level: Level.ERROR,
            text: `Invalid segment route "${segment}".`,
            content: "Segment routes should only contain letters, numbers, and dashes.",
            file: filepath ? { filepath: filepath } : undefined
        });
    }
    if (segment.toLowerCase() != segment) {
        errors.push({
            level: Level.WARN,
            text: `Segment route should only be lowercase "${segment}".`,
            file: filepath ? { filepath: filepath } : undefined
        });
    }
    return errors;
}


// In the same way, faith by itself, if it is not accompanied by action, is dead.
// - James 2:17
