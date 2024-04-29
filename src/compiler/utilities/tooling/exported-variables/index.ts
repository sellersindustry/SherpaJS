/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Apr 29 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Exported Loaders
 *
 */


import fs from "fs";
import { parse } from "es-module-lexer";


export type ExportedVariable = {
    name: string;
}


export async function getExportedVariables(filepath:string):Promise<ExportedVariable[]> {
    let [, exports] = await parse(getBuffer(filepath)!); // note: await is required
    return exports.map(_export => {
        return {
            name: _export.n
        };
    });
}


function getBuffer(filepath:string):string {
    if (!fs.existsSync(filepath)) {
        return "";
    }
    try {
        return fs.readFileSync(filepath, "utf8");
    } catch {
        return "";
    }
}


// As water reflects the face, so one's life reflects the heart.
// - Proverbs 27:19
