/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Bundler Selector
 *
 */

import { BuildOptions, BundlerType, Structure } from "../models.js";
import { Local } from "./platforms/local/index.js";
import { Vercel } from "./platforms/vercel/index.js";
import { Logger } from "../utilities/logger/index.js";
import { Message } from "../utilities/logger/model.js";
import { Bundler } from "./platforms/abstract.js";


export function NewBundler(structure:Structure, options:BuildOptions, errors?:Message[]):Bundler {
    if (options.bundler === BundlerType.Vercel) {
        return new Vercel(structure, options, errors);
    } else if (options.bundler === BundlerType.local) {
        return new Local(structure, options, errors);
    } else {
        Logger.raise({ text: `Invalid bundler "${options.bundler}"` });
        return undefined as unknown as Bundler;
    }
}


export function clean(filepath:string) {
    let structure = { assets: {}, endpoints: {}, server: {} } as Structure;
    let options   = { bundler: BundlerType.local, input: filepath, output: filepath };
    new Vercel(structure, options).clean();
    new Local(structure, options).clean();
}


// A cheerful heart is good medicine, but a crushed spirit dries up the bones.
// - Proverbs 17:22
