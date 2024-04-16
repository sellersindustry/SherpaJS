/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Directory Structure
 *
 */


import fs from "fs";
import {
    DirectoryStructureFile as File,
    DirectoryStructureTree as Tree,
    DirectoryStructure as Structure
} from "./model.js";
import { Files } from "../../utilities/files/index.js";


export function getDirectoryStructure(directory:string):Structure {
    let tree = getTreeStructure(directory);
    return {
        tree: tree,
        list: flattenTreeStructure(tree)
    }
}


function getTreeStructure(directory:string, segments:string[]=[]):Tree {
    return {
        files: getFiles(directory, segments),
        directories: getDirectories(directory).reduce((directories, segment) => {
            let nextDirectory = Files.join(directory, segment);
            let nextSegments  = [...segments, segment];
            return {
                ...directories,
                [segment]: getTreeStructure(nextDirectory, nextSegments)
            };
        }, {})
    }
}


function getFiles(directory:string, segments:string[]):File[] {
    return fs.readdirSync(directory).filter((segment:string) => {
        return fs.statSync(Files.join(directory, segment)).isFile();
    }).map((filename) => {
        return {
            filename: filename,
            filepath: Files.join(directory, filename),
            segments: segments
        }
    });
}


function getDirectories(directory:string):string[] {
    return fs.readdirSync(directory).filter((segment:string) => {
        return fs.statSync(Files.join(directory, segment)).isDirectory();
    });
}


function flattenTreeStructure(structure:Tree):File[] {
    return [
        ...structure.files,
        ...Object.keys(structure.directories).map((dirName) => {
            return flattenTreeStructure(structure.directories[dirName])
        }).flat()
    ]
}


// For it is with your heart that you believe and are justified, and it is with
// your mouth that you profess your faith and are saved.
// - Romans 10:10
