/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: model.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Logger Models
 *
 */


export enum LogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG
}


export type Log = {
    level?:LogLevel;
    message:string;
    content?:string;
    path?:string;
    lineNumber?:number;
    propertyRoute?:string[];
};


// Whoever believes in the Son has eternal life, but whoever rejects the Son
// will not see life, for God’s wrath remains on them.
// - John 3:36
