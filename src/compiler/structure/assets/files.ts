/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Fri May 3 2024
 *   file: files.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Get Asset File Structure
 *
 */


import fs from "fs";
import { Path } from "../../utilities/path/index.js";
import {
    DirectoryStructure, DirectoryStructureFile,
    DirectoryStructureTree
} from "../../utilities/path/directory-structure/model.js";
import { Level, Message } from "../../utilities/logger/model.js";
import { Logger } from "../../utilities/logger/index.js";


const MEGABYTES = 10e6;
const REGEX_SEGMENT = /^([a-zA-Z0-9-]+)$/;


export const EMPTY_ASSET_STRUCTURE:DirectoryStructure = {
    list: [],
    tree: {
        files: [],
        directories: {}
    }
};


export function getAssetFiles(entry:string):{ logs:Message[], files:DirectoryStructure } {
    let directory = Path.join(entry, "public");

    if (!fs.existsSync(directory)) {
        return { logs: [], files: EMPTY_ASSET_STRUCTURE };
    }
    
    let files  = Path.getDirectoryStructure(directory);
    let logs   = getDiagnostics(files, directory);

    if (Logger.hasError(logs)) {
        return { logs, files };
    }

    return { logs, files: files };
}


function getDiagnostics(assets:DirectoryStructure, filepath:string):Message[] {
    let errors:Message[] = [];
    for (let file of assets.list) {
        errors.push(...validateFileSize(file));
        errors.push(...validateFileExtension(file));
    }
    errors.push(...validateSegments(assets.tree, filepath));
    return errors;
}


function validateFileExtension(file:DirectoryStructureFile):Message[] {
    if (!file.filename.includes(".")) {
        return [{
            level: Level.ERROR,
            text: "File has no extension.",
            file: { filepath: file.filepath.absolute }
        }];
    }
    return [];
}


function validateFileSize(file:DirectoryStructureFile):Message[] {
    let bytes = fs.statSync(file.filepath.absolute).size;
    if (bytes > 100 * MEGABYTES) {
        return [{
            level: Level.ERROR,
            text: "File is too large.",
            content: "Files must be less than 100MB.",
            file: { filepath: file.filepath.absolute }
        }];
    }
    return [];
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
        text: `Invalid asset segment route "${segment}".`,
        content: "Asset segment routes should only contain letters, numbers, and dashes.",
        file: filepath ? { filepath: filepath } : undefined
    }];
}


// Since we live by the Spirit, let us keep in step with the Spirit.
// - Galatians 5:25
