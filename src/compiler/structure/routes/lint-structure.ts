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


import path from "path";
import { Files } from "../../files/index.js";
import { Tooling } from "../../tooling/index.js";
import { Level, Message } from "../../logger/model.js";
import { SUPPORTED_FILE_EXTENSIONS } from "../../models/index.js";
import { FileStructure, ListFileStructure, TreeFileStructure } from "./walk.js";


const REGEX_SEGMENT = /^([a-zA-Z0-9-]+)|(\[[a-zA-Z0-9-]+\])$/;
const VALID_EXPORTS = ["GET", "POST", "PATCH", "DELETE", "PUT"];


export function lintStructure(structure:FileStructure, filepath:string):Message[] {
    let errors:Message[] = [];
    for (let file of structure.list) {
        errors.push(...filetype(file));
        errors.push(...filename(file));
        errors.push(...exported(file));
    }
    errors.push(...routes(structure.tree, filepath));
    return errors;
}


function filetype(file:ListFileStructure):Message[] {
    let extension = Files.getExtension(file.filepath);
    if (SUPPORTED_FILE_EXTENSIONS.includes(extension))
        return [];
    return [{
        level: Level.ERROR,
        text: `Invalid File Type. Must be "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
        file: {
            filepath: file.filepath
        }
    }];
}


function filename(file:ListFileStructure):Message[] {
    if (Files.getName(file.filename) == "index")
        return [];
    return [{
        level: Level.ERROR,
        text: "Invalid File Name. Files must be named \"index\".",
        file: {
            filepath: file.filepath
        }
    }];
}


function exported(file:ListFileStructure):Message[] {
    let errors:Message[] = [];
    let variables = Tooling.getExportedVariableNames(file.filepath);
    //! FIXME OR HAS DEFAULT EXPORT
    for (let variable of variables) {
        if (!VALID_EXPORTS.includes(variable)) {
            errors.push({
                level: Level.WARN,
                text: `Invalid Export "${variable}" will be ignored.`,
                content: `The only valid exports are: "${VALID_EXPORTS.join("\", \"")}".`,
                file: {
                    filepath: file.filepath
                }
            });
        }
    }
    if (variables.filter((name) => VALID_EXPORTS.includes(name)).length == 0) {
        errors.push({
            level: Level.ERROR,
            text: "No Valid Exports. No route will be generated.",
            content: `The only valid exports are: "${VALID_EXPORTS.join("\", \"")}".`,
            file: {
                filepath: file.filepath
            }
        });
    }
    return errors;
}


function routes(structure:TreeFileStructure, filepath:string):Message[] {
    let errors:Message[] = [];
    for (let dirName of Object.keys(structure.directories)) {
        let _filepath     = path.join(filepath, dirName);
        errors.push(...validateSegment(dirName, _filepath));
        errors.push(...routes(structure.directories[dirName], _filepath));
    }
    return errors;
}


function validateSegment(segment:string, filepath?:string):Message[] {
    let errors:Message[] = [];
    if (!REGEX_SEGMENT.test(segment)) {
        errors.push({
            level: Level.ERROR,
            text: `Invalid segment route "${segment}".`,
            content: "Segment routes should only contain letters, numbers, and dashes.",
            file: filepath ? {
                filepath: filepath
            } : undefined
        });
    }
    if (segment.toLowerCase() != segment) {
        errors.push({
            level: Level.WARN,
            text: `Segment route should only be lowercase "${segment}".`,
            file: filepath ? {
                filepath: filepath
            } : undefined
        });
    }
    return errors;
}


// In the same way, faith by itself, if it is not accompanied by action, is dead.
// - James 2:17
