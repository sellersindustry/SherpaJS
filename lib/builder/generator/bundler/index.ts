/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Bundler Generator Selector
 *
 */



import { Logger } from "../../logger";
import { BuildOptions, Server } from "../../models";
import { BundlerType } from "../../models/build";
import { Bundler } from "./abstract";
import { BundlerExpressJS } from "./expressjs";
import { BundlerVercel } from "./vercel";


export function NewBundler(server:Server, options:BuildOptions):Bundler {
    if (options.bundler === BundlerType.Vercel) {
        return new BundlerVercel(server, options);
    } else if (options.bundler === BundlerType.ExpressJS) {
        return new BundlerExpressJS(server, options);
    } else {
        Logger.RaiseError({ message: "Invalid bundler." });
    }
}


// A cheerful heart is good medicine, but a crushed spirit dries up the bones.
// - Proverbs 17:22
