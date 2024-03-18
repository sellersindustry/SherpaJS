import {
    Body, BodyType, Headers,
    Method, PathParameters, QueryParameters
} from "./io/model.js";
import { New, Load } from "./instantiate/index.js";
import { IResponse } from "./io/response/interface.js";
import { Response } from "./io/response/index.js";
import { IRequest } from "./io/request/interface.js";
import { Options } from "./io/response/index.js";
import { LocalServer } from "./local-server/index.js";
import { RequestTransform } from "./io/request/transformer.js";
import { ResponseTransform } from "./io/response/transform.js";
import { Context } from "../compiler/models.js";
import { Handler } from "./handler/index.js";


const SherpaJS = {
    New,
    Load
}


const __internal__ = {
    RequestTransform,
    ResponseTransform,
    LocalServer,
    Handler
};


export {
    SherpaJS,
    Response,
    __internal__,
}

export type {
    Method,
    BodyType,
    Body,
    Headers,
    PathParameters,
    QueryParameters,
    IRequest as Request,
    IRequest,
    IResponse,
    Options as ResponseOptions,
    Context
}
