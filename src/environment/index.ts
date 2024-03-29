/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Environment SDK
 *
 */


import { Parameters } from "./io/parameters/index.js";
import { Headers } from "./io/headers/index.js";
import { Body, BodyType } from "./io/model.js";
import { New } from "./instantiate/index.js";
import { IResponse } from "./io/response/interface.js";
import { Response } from "./io/response/index.js";
import { IRequest } from "./io/request/interface.js";
import { Options } from "./io/response/index.js";
import { LocalServer } from "./local-server/index.js";
import { RequestTransform } from "./io/request/transformer.js";
import { ResponseTransform } from "./io/response/transformer.js";
import { Context, ContextSchema, Method } from "../compiler/models.js";
import { Handler } from "./handler/index.js";


const SherpaJS = {
    New
}


const __internal__ = {
    RequestTransform,
    ResponseTransform,
    Handler
};


export {
    SherpaJS,
    Response,
    __internal__,
    LocalServer,
    Headers,
    Parameters,
    Method,
    BodyType
}


export type {
    Body,
    IRequest as Request,
    IRequest,
    IResponse,
    Options as ResponseOptions,
    Context,
    ContextSchema
}


// Now faith is confidence in what we hope for and assurance about what
// we do not see.
// - Hebrews 11:1
