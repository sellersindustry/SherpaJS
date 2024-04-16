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


export class Files {


    public static getName(filepath:string):string {
        return path.basename(filepath, path.extname(filepath));
    }


    public static getExtension(filepath:string):string {
        return path.extname(filepath).slice(1).toUpperCase();
    }


    public static getDirectory(filepath:string):string {      
        return path.dirname(filepath);
    }


    public static join(...paths:string[]):string {
        return path.join(...paths).replace(/\\/g, "/");
    }


    public static exists(filepath:string):boolean {
        return fs.existsSync(filepath);
    }


    public static relative(from:string, to:string):string {
        return path.relative(from, to).replace(/\\/g, "/");
    }


    public static getFilepathVariableExtension(path:string, name:string, extensions:string[]):string|undefined {
        for (let type of extensions) {
            let filename = name + "." + type.toLowerCase();
            let filepath = Files.join(path, filename);
            if (Files.exists(filepath)) {
                return filepath;
            }
        }
        return undefined;
    }


    public static getRootDirectory() {
        return this.join(this.getDirectory(this.unix(import.meta.url)), "../../../../../");
    }


    public static unix(filepath:string):string {
        return filepath
            .replace("file://", "")
            .replace(/^\/?[A-Za-z]:/, "")
            .replace(/\\/g, "/");
    }



    public static resolve(filepath:string, resolveDir:string):string|undefined {
        let npm = Files.join(resolveDir, "../../../node_modules", filepath);
        if (Files.exists(npm)) {
            return npm;
        }
        return Files.getDirectory(Files.join(resolveDir, filepath));
    }


}


// Be on your guard; stand firm in the faith; be courageous; be strong.
// - 1 Corinthians 16:13
