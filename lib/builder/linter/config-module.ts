/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: config-module.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Module Config Linter
 *
 */


import Ajv from "ajv";
import { CONFIG_MODULE_SCHEMA, ConfigModule } from "../models";
import { Log, LogLevel } from "../logger";


export function Linter(config:ConfigModule, path:string):Log[] {
    return schema(config, path);
}


function schema(config:ConfigModule, path:string):Log[] {
    let validator = (new Ajv()).compile(CONFIG_MODULE_SCHEMA);
    if (!validator(config)) {
        return validator.errors.map((error) => {
            return {
                level: LogLevel.ERROR,
                message: "Module Config Error: " + error.message,
                path: path,
                propertyRoute: error.instancePath.split("/").slice(1)
            };
        });
    }
    return [];
}


// For everyone born of God overcomes the world. This is the victory that has
// overcome the world, even our faith.
// - 1 John 5:4
