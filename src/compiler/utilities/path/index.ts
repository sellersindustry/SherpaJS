/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: File Utilities
 *
 */


import fs from "fs";
import path from "path";
import { getDirectoryStructure } from "./directory-structure/index.js";
import { DirectoryStructure } from "./directory-structure/model.js";


export class Path {


    public static getName(filepath:string):string {
        return path.basename(filepath, path.extname(filepath));
    }


    public static getExtension(filepath:string):string {
        return path.extname(filepath).slice(1).toUpperCase();
    }


    public static unix(filepath:string):string {
        return filepath
            .replace("file://", "")
            .replace(/^\/?[A-Za-z]:/, "")
            .replace(/\\/g, "/");
    }


    public static getDirectory(filepath:string):string {      
        return this.unix(path.dirname(filepath));
    }


    public static join(...paths:string[]):string {
        return this.unix(path.join(...paths));
    }


    public static getRootDirectory() {
        return this.join(this.getDirectory(this.unix(import.meta.url)), "../../../../../");
    }


    public static resolve(filepath:string, resolveDir:string):string|undefined {
        let npm = Path.join(resolveDir, "../../../node_modules", filepath);
        if (fs.existsSync(npm)) {
            return npm;
        }
        return Path.getDirectory(Path.join(resolveDir, filepath));
    }


    public static resolveExtension(filepath:string, filename:string, extensions:string[]):string|undefined {
        for (let type of extensions) {
            let _filename = filename + "." + type.toLowerCase();
            let _filepath = Path.join(filepath, _filename);
            if (fs.existsSync(_filepath)) {
                return this.unix(_filepath);
            }
        }
        return undefined;
    }


    public static getDirectoryStructure(filepath:string):DirectoryStructure {
        return getDirectoryStructure(filepath);
    }



    public static isAbsolute(filepath:string):boolean {
        return path.isAbsolute(filepath);
    }


}


// Be on your guard; stand firm in the faith; be courageous; be strong.
// - 1 Corinthians 16:13
