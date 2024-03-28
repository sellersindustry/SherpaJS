/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu Mar 28 2024
 *   file: dot-env.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Environment Variables
 *
 */


import fs from "fs";
import { BuildOptions, EnvironmentVariables } from "../../models.js";


export function getEnvironmentVariables(options:BuildOptions):EnvironmentVariables {
    return {
        ...process.env as EnvironmentVariables,
        ...getFiles(options).map(filepath => parseFile(filepath)).reduce((a, b) => { return { ...a, ...b } }, {}),
        ...options.developer?.environment?.variables
    };
}


function parseFile(filepath:string):EnvironmentVariables {
    if (!fs.existsSync(filepath)) {
        return {};
    }
    return Object.fromEntries(fs.readFileSync(filepath, "utf8").split("\n").map(entry => {
        return entry.trim();
    }).filter(entry => {
        return !entry.startsWith("#") && entry != "" && entry.includes("=");
    }).map(entry => {
        let sections = entry.split("=");
        return [sections[0].trim(), sections[1].trim()];
    }));
}


function getFiles(options:BuildOptions):string[] {
    if (!options?.developer?.environment?.files) {
        return [];
    }
    return options.developer.environment.files.filter((filepath) => {
        return fs.existsSync(filepath);
    });
}


// For you were once darkness, but now you are light in the Lord. Live as
// children of light.
// - Ephesians 5:8
