/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: config-module.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Module Config
 *
 */


import { Schema } from "ajv";


export type ConfigModule = {
    version:1;
    name:string;
}


export const CONFIG_MODULE_SCHEMA:Schema = {
    type: "object",
    properties: {
        version: {
            type: "integer",
            minimum: 1,
            maximum: 1
        },
        name: {
            type: "string",
            minLength: 3,
            maxLength: 32,
            pattern: "^[a-zA-Z0-9-]+$"
        }
    },
    required: ["version", "name"],
    additionalProperties: false
};


// Whoever believes in me, as Scripture has said, rivers of living water will
// flow from within them.
// - John 7:38
