/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: files.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: File Utilities
 *
 */


import fs from "fs";
import path from "path";


export class UtilityFile {

    
    public static Walk(directory:string):string[] {
        return this._Walk(directory, directory);
    }


    private static _Walk(directory:string, root:string):string[] {
        return fs.readdirSync(directory).map((file:string) => {
            let filepath = path.join(directory, file);
            if (fs.statSync(filepath).isDirectory()) {
                return this._Walk(filepath, root);
            } else {
                return this.Relative(root, filepath);
            }
        }).flat();
    }


    public static GetName(filepath:string):string {
        return path.basename(filepath, path.extname(filepath));
    }


    public static GetExtension(filepath:string):string {
        return path.extname(filepath).slice(1).toUpperCase();
    }


    public static GetDirectory(filepath:string):string {      
        return path.dirname(filepath);
    }


    public static JoinPath(...paths:string[]):string {
        return path.join(...paths).replace(/\\/g, "/");
    }


    public static Exists(filepath:string):boolean {
        return fs.existsSync(filepath);
    }


    public static Relative(from:string, to:string):string {
        return path.relative(from, to).replace(/\\/g, "/");
    }


    public static GetFileVaribleExtensions(path:string, name:string, extensions:string[]):string|undefined {
        for (let type of extensions) {
            let filename = name + "." + type.toLowerCase();
            let filepath = this.JoinPath(path, filename);
            if (this.Exists(filepath)) {
                return filepath;
            }
        }
        return undefined;
    }


}


// Be on your guard; stand firm in the faith; be courageous; be strong.
// - 1 Corinthians 16:13
