/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Models
 *
 */


import { CONFIG_MODULE_SCHEMA, ConfigModule } from "./config-module.js";
import { CONFIG_SERVER_SCHEMA, ConfigServer, ConfigAppProperties } from "./config-server.js";
import { Module, Endpoint, Route, VALID_EXPORTS, Server, REQUEST_METHODS } from "./structure.js";
import { BuildOptions, BundlerType } from "./build.js";


export {
    VALID_EXPORTS,
    REQUEST_METHODS,
    CONFIG_MODULE_SCHEMA,
    CONFIG_SERVER_SCHEMA,
    BundlerType
};

export type {
    BuildOptions,
    Server,
    Module,
    ConfigModule,
    ConfigServer,
    ConfigAppProperties,
    Endpoint,
    Route,
};


// Because you know that the testing of your faith produces perseverance.
// - James 1:3
