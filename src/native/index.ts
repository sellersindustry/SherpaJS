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


import { Parameters } from "./parameters/index.js";
import { Headers } from "./headers/index.js";
import { Body, BodyType } from "./model.js";
import { IResponse } from "./response/interface.js";
import { ResponseBuilder, Options as ResponseOptions } from "./response/index.js";
import { IRequest } from "./request/interface.js";
import { CreateModuleInterface, Method, ModuleInterface } from "../compiler/models.js";


export {
    ResponseBuilder as Response,
    Headers,
    Parameters,
    Method,
    BodyType,
    CreateModuleInterface,
    ModuleInterface
}


export type {
    Body,
    IRequest as Request,
    IRequest,
    IResponse,
    ResponseOptions
}


// Now faith is confidence in what we hope for and assurance about what
// we do not see.
// - Hebrews 11:1