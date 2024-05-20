/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu May 16 2024
 *   file: model.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Endpoint Test Suite - Models
 *
 */


import { Method, Body } from "../../../index.js";


export type TestOptions = {
    method:Method,
    path:string,
    body?:Body
}


export type BenchOptions = {
    host:string;
    start?:string;
    setup?:string[];
    teardown?:string[];
}


export type TestResults = {
    name:string,
    success:boolean,
    message?:string,
    stack?:string
};


// Whoever eats my flesh and drinks my blood remains in me, and I in them.
// - John 6:56
