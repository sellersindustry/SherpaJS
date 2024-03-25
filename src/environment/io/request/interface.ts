/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: interface.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Request Interface
 *
 */


import { Headers, Method, Body, BodyType, PathParameters, QueryParameters } from "../model.js";


export interface IRequest {

    readonly url:string;
    readonly params:{ path:PathParameters, query:QueryParameters };
    readonly method:keyof typeof Method;
    readonly headers:Headers;

    readonly body:Body;
    readonly bodyType:keyof typeof BodyType;

}


// Hearing this, Jesus said to Jairus, "Don’t be afraid; just believe, and she
// will be healed."
// - Luke 8:50
