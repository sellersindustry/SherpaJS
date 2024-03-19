/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: model.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Directory Structure Models
 *
 */

export type DirectoryStructureFile = {
    filename: string;
    filepath: string;
    segments: string[];
}


export type DirectoryStructureTree = {
    files: DirectoryStructureFile[];
    directories: { [key:string]:DirectoryStructureTree };
}


export type DirectoryStructure = {
    tree: DirectoryStructureTree;
    list: DirectoryStructureFile[];
}


// For everyone born of God overcomes the world. This is the victory that has
// overcome the world, even our faith.
// - 1 John 5:4
