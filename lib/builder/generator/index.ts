/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Generate Structure
 *
 */


import { GetConfigServer } from "./config-server";
import { GetConfigModule } from "./config-module";
import { GetEndpoints } from "./endpoints";
import { Bundler } from "./bundler/abstract";
import { NewBundler } from "./bundler";


export const Generator = {
    GetConfigServer,
    GetConfigModule,
    GetEndpoints,
    NewBundler,
    Bundler,
};


// Jesus answered, "The work of God is this: to believe in the one he has sent."
// - John 6:29
