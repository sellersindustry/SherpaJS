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

import { BuildOptions, BundlerType, EndpointStructure } from "../models.js";
import { Local } from "./platforms/local/index.js";
import { Vercel } from "./platforms/vercel/index.js";
import { Logger } from "../utilities/logger/index.js";
import { Message } from "../utilities/logger/model.js";
import { Bundler } from "./platforms/abstract.js";


export function NewBundler(endpoints:EndpointStructure, options:BuildOptions, errors?:Message[]):Bundler {
    if (options.bundler === BundlerType.Vercel) {
        return new Vercel(endpoints, options, errors);
    } else if (options.bundler === BundlerType.local) {
        return new Local(endpoints, options, errors);
    } else {
        Logger.raise({ text: `Invalid bundler "${options.bundler}"` });
        return undefined as unknown as Bundler;
    }
}


// A cheerful heart is good medicine, but a crushed spirit dries up the bones.
// - Proverbs 17:22
