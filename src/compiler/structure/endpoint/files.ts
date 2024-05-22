/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: files.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Get Endpoint File Structure
 *
 */


import fs from "fs";
import { Path } from "../../utilities/path/index.js";
import {
    DirectoryStructure, DirectoryStructureFile,
    DirectoryStructureTree
} from "../../utilities/path/directory-structure/model.js";
import { Level, Message } from "../../utilities/logger/model.js";
import { FILENAME, FILE_EXTENSIONS } from "../../models.js";
import { Logger } from "../../utilities/logger/index.js";


const REGEX_SEGMENT = /^([a-zA-Z0-9-]+)|(\[[a-zA-Z0-9-]+\])$/;


export function getEndpointFiles(entry:string):{ logs:Message[], files?:DirectoryStructure } {
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
        errors.push(...validateFile(file));
    }
    errors.push(...validateSegments(structure.tree, filepath));
    return errors;
}


function validateFile(file:DirectoryStructureFile):Message[] {
    let filename = Path.getName(file.filename);
    let extension = Path.getExtension(file.filename);

    if (FILENAME.ENDPOINT.FUNCTIONS == filename) {
        if (!FILE_EXTENSIONS.ENDPOINT.FUNCTIONS.includes(extension)) {
            return [{
                level: Level.ERROR,
                text: "Invalid file extension for functions endpoint.",
                content: `Must be "${FILE_EXTENSIONS.ENDPOINT.FUNCTIONS.join("\", \"")}".`,
                file: { filepath: file.filepath.absolute }
            }];
        } else {
            return [];
        }
    } else if (FILENAME.ENDPOINT.MODULE == filename) {
        if (!FILE_EXTENSIONS.ENDPOINT.MODULE.includes(extension)) {
            return [{
                level: Level.ERROR,
                text: "Invalid file extension for module endpoint.",
                content: `Must be "${FILE_EXTENSIONS.ENDPOINT.MODULE.join("\", \"")}".`,
                file: { filepath: file.filepath.absolute }
            }];
        } else {
            return [];
        }
    } else if (FILENAME.ENDPOINT.VIEW == filename) {
        if (!FILE_EXTENSIONS.ENDPOINT.VIEW.includes(extension)) {
            return [{
                level: Level.ERROR,
                text: "Invalid file extension for view endpoint.",
                content: `Must be "${FILE_EXTENSIONS.ENDPOINT.VIEW.join("\", \"")}".`,
                file: { filepath: file.filepath.absolute }
            }];
        } else {
            return [];
        }
    }
    return [{
        level: Level.ERROR,
        text: `Invalid file name for endpoint.`,
        content: `Files must be named one of the following... "${Object.values(FILENAME.ENDPOINT).join("\", \"")}".`,
        file: { filepath: file.filepath.absolute }
    }];
}


function validateSegments(structure:DirectoryStructureTree, filepath:string):Message[] {
    let errors:Message[] = [];
    errors.push(...validateMultipleDynamicSegments(Object.keys(structure.directories), filepath));
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
        text: `Invalid endpoint segment route "${segment}".`,
        content: "Endpoint segment routes should only contain letters, numbers, and dashes.",
        file: filepath ? { filepath: filepath } : undefined
    }];
}


function validateMultipleDynamicSegments(segments:string[], filepath:string):Message[] {
    let hasMultipleDynamicPaths = segments.map((segment) => {
        return segment.startsWith("[") && segment.endsWith("]");
    }).filter((segment) => segment).length > 1;
    if (hasMultipleDynamicPaths) {
        return [{
            level: Level.ERROR,
            text: "Only one dynamic endpoint per route is allowed.",
            file: { filepath: filepath }
        }];
    }
    return [];
}


// Who is it that overcomes the world? Only the one who believes that Jesus
// is the Son of God.
// - 1 John 5:5
