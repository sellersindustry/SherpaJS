/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu Mar 28 2024
 *   file: utilities.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: CLI Utilities
 *
 */


import path from "path";
import { Files } from "../compiler/utilities/files/index.js";


export function getEnvironmentFiles(input:string):string[] {
    let envFilepath = Files.join(input, ".env");
    if (Files.exists(envFilepath)) {
        return [envFilepath];
    }
    return [];
}


export function getAbsolutePath(filepath:string|undefined, fallback:string):string {
    if (!filepath) {
        filepath = fallback;
    }
    return path.resolve(filepath);
}


// If anyone acknowledges that Jesus is the Son of God, God lives in them and
// they in God.
// - 1 John 4:15
