/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: interface.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Response Interface
 *
 */



import { Headers, Body, BodyType } from "../model.js";

export interface IResponse {

    readonly status:number;
    readonly statusText:string;
    readonly headers:Headers;

    readonly body:Body;
    readonly bodyType:keyof typeof BodyType;

}


// Whoever believes in me, as Scripture has said, rivers of living water will
// flow from within them.
// - John 7:38
