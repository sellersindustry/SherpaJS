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


import fs from "fs";
import path from "path";
import { Path } from "../compiler/utilities/path/index.js";
import { Level, Message } from "../compiler/utilities/logger/model.js";


export function getEnvironmentFiles(input:string):string[] {
    let envFilepath = Path.join(input, ".env");
    if (fs.existsSync(envFilepath)) {
        return [envFilepath];
    }
    return [];
}


export function getAbsolutePath(filepath:string|undefined, fallback:string):string {
    if (!filepath) {
        filepath = fallback;
    }
    return Path.unix(path.resolve(filepath));
}


export function getKeyValuePairs(values:string[]|undefined):{ logs:Message[], values:Record<string, string> } {
    if (!values) {
        return { logs: [], values: {} };
    }

    let logs:Message[] = [];
    let result:Record<string, string> = {};
    for (let entry of values) {
        let [key, value] = entry.split("=");
        if (!key || !value) {
            logs.push({
                level: Level.ERROR,
                text: `Invalid key/value pair: "${entry}"`,
                content: `The key and value must be separated by an equal sign. Ex. "key=value".`
            });
            continue;
        }
        result[key] = value;
    }
    return { logs: logs, values: result };
}


export function getVersion():string|undefined {
    try {
        let filepath = Path.join(Path.getRootDirectory(), "package.json");
        return JSON.parse(fs.readFileSync(filepath, "utf8")).version;
    } catch (error) {
        return undefined;
    }
}


// If anyone acknowledges that Jesus is the Son of God, God lives in them and
// they in God.
// - 1 John 4:15
