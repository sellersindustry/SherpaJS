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


import { Body, BodyType } from "../model.js";
import { Headers } from "../headers/index.js";
import { Parameters } from "../parameters/index.js";
import { Method } from "../../compiler/models.js";


export interface IRequest {

    readonly url:string;
    readonly params:{ path:Parameters, query:Parameters };
    readonly method:keyof typeof Method;
    readonly headers:Headers;

    readonly body:Body;
    readonly bodyType:keyof typeof BodyType;

}


// Hearing this, Jesus said to Jairus, "Don’t be afraid; just believe, and she
// will be healed."
// - Luke 8:50
