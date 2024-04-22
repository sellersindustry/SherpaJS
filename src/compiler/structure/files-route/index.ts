/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Get Route Files
 *
 */

import fs from "fs";
import { Path } from "../../utilities/path/index.js";
import { DirectoryStructure, DirectoryStructureFile, DirectoryStructureTree } from "../../utilities/path/directory-structure/model.js";
import { Level, Message } from "../../utilities/logger/model.js";
import { SUPPORTED_FILE_EXTENSIONS } from "../../models.js";
import { Logger } from "../../utilities/logger/index.js";


const REGEX_SEGMENT = /^([a-zA-Z0-9-]+)|(\[[a-zA-Z0-9-]+\])$/;


export function getRouteFiles(entry:string):{ logs:Message[], files?:DirectoryStructure } {
    let directory = Path.join(entry, "routes");

    if (!fs.existsSync(directory)) {
        return { 
            logs: [{
                level: Level.WARN,
                text: "No \"/routes\" directory detected.",
                file: { filepath: entry }
            }]
        };
    }
    
    let files = Path.getDirectoryStructure(directory);
    let logs  = getDiagnostics(files, directory);

    if (Logger.hasError(logs)) {
        return { logs };
    }

    return { logs, files: files };
}


function getDiagnostics(structure:DirectoryStructure, filepath:string):Message[] {
    let errors:Message[] = [];
    for (let file of structure.list) {
        errors.push(...validateFileType(file));
        errors.push(...validateFileName(file));
    }
    errors.push(...validateSegments(structure.tree, filepath));
    return errors;
}


function validateFileType(file:DirectoryStructureFile):Message[] {
    let extension = Path.getExtension(file.filepath.absolute);
    if (SUPPORTED_FILE_EXTENSIONS.includes(extension))
        return [];
    return [{
        level: Level.ERROR,
        text: `Invalid File Type. Must be "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
        file: { filepath: file.filepath.absolute }
    }];
}


function validateFileName(file:DirectoryStructureFile):Message[] {
    if (Path.getName(file.filename) == "index")
        return [];
    return [{
        level: Level.ERROR,
        text: "Invalid File Name. Files must be named \"index\".",
        file: { filepath: file.filepath.absolute }
    }];
}


function validateSegments(structure:DirectoryStructureTree, filepath:string):Message[] {
    let errors:Message[] = [];
    for (let segmentName of Object.keys(structure.directories)) {
        let _filepath = Path.join(filepath, segmentName);
        errors.push(...validateSegmentName(segmentName, _filepath));
        errors.push(...validateSegments(structure.directories[segmentName], _filepath));
    }
    return errors;
}


function validateSegmentName(segment:string, filepath?:string):Message[] {
    if (REGEX_SEGMENT.test(segment))
        return [];
    return [{
        level: Level.ERROR,
        text: `Invalid segment route "${segment}".`,
        content: "Segment routes should only contain letters, numbers, and dashes.",
        file: filepath ? { filepath: filepath } : undefined
    }];
}


// Who is it that overcomes the world? Only the one who believes that Jesus
// is the Son of God.
// - 1 John 5:5
