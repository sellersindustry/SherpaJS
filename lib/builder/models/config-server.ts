/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: config-server.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Server Config
 *
 */


import { Schema } from "ajv";


export type ConfigAppProperties = {
    module:string;
    filepath?:string;
    properties?:unknown;
} | { [key:`/${string}`]:ConfigAppProperties };


export type ConfigServer = {
    version:1;    
    app:ConfigAppProperties;
}


export const CONFIG_SERVER_SCHEMA:Schema = {
    type: "object",
    properties: {
        version: {
            type: "integer",
            minimum: 1,
            maximum: 1
        },
        app: {
            type: "object"
        }
    },
    required: ["version", "app"],
    additionalProperties: false
};


// I write these things to you who believe in the name of the Son of God so
// that you may know that you have eternal life.
// - 1 John 5:13
