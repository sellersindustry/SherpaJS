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
import { Files } from "../index.js";
import {
    DirectoryStructure as DirStruct,
    DirectoryStructureFile as File,
    DirectoryStructureTree as Tree
} from "./model.js";


export function getDirectoryStructure(directory:string):DirStruct {
    let tree = getDirectoryStructureTree(directory, "");
    return {
        tree: tree,
        list: flattenTreeStructure(tree)
    }
}


function getDirectoryStructureTree(dirAbsolute:string, dirRelative:string):Tree {
    return {
        files: getFiles(dirAbsolute, dirRelative),
        directories: getDirectories(dirAbsolute).reduce((directories, dirname) => {
            return {
                ...directories,
                [dirname]: getDirectoryStructureTree(
                    Files.join(dirAbsolute, dirname),
                    Files.join(dirRelative, dirname)
                )
            };
        }, {})
    }
}


function getFiles(dirAbsolute:string, dirRelative:string):File[] {
    return fs.readdirSync(dirAbsolute).filter((filename:string) => {
        return fs.statSync(Files.join(dirAbsolute, filename)).isFile();
    }).map((filename) => {
        return {
            filename: filename,
            filepath: {
                absolute: Files.join(dirAbsolute, filename),
                relative: Files.join(dirRelative, filename)
            }
        }
    });
}


function getDirectories(dirAbsolute:string):string[] {
    return fs.readdirSync(dirAbsolute).filter((dirname:string) => {
        return fs.statSync(Files.join(dirAbsolute, dirname)).isDirectory();
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
