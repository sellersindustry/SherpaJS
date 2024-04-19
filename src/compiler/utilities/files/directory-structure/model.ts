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


export type DirectoryStructure = {
    list: DirectoryStructureFile[];
    tree: DirectoryStructureTree;
}


export type DirectoryStructureFile = {
    filename:string;
    filepath:{
        absolute:string;
        relative:string;
    };
}


export type DirectoryStructureTree = {
    files: DirectoryStructureFile[];
    directories: { [key:string]:DirectoryStructureTree };
}


// For everyone born of God overcomes the world. This is the victory that has
// overcome the world, even our faith.
// - 1 John 5:4
