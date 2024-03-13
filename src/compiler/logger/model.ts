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


export enum Level {
    ERROR,
    WARN,
    INFO,
    DEBUG
}


export type Message = {
    text:string;
    level?:Level;
    content?:string;
    file?:MessageFile;
};


export type MessageFile = {
    filepath:string;
    line?:number;
    properties?:string[];
}


// Whoever believes in the Son has eternal life, but whoever rejects the Son
// will not see life, for God’s wrath remains on them.
// - John 3:36
