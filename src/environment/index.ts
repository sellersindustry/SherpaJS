import { New, Load } from "./instantiate/index.js";
import {
    Body, BodyType, Headers,
    Method, PathParameters, QueryParameters
} from "./io/model.js";
import { IResponse } from "./io/response/interface.js";
import { Request } from "./io/response/index.js";
import { IRequest } from "./io/request/interface.js";
import { Options } from "./io/response/index.js";


const SherpaJS = {
    New,
    Load
}

export {
    SherpaJS,
    Request
}

export type {
    Method,
    BodyType,
    Body,
    Headers,
    PathParameters,
    QueryParameters,
    IResponse,
    Options as ResponseOptions,
    IRequest
}
