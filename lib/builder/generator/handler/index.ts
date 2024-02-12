/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Request Handler
 *
 */


import { response as ExpressResponse } from "express";
import { SherpaRequest, Environment } from "../../../environment";
import { ConfigModule, ConfigServer, Endpoint, REQUEST_METHODS } from "../../models";
import { BundlerType } from "../../models/build";


type MethodFunctions = { [key:string]:(request:SherpaRequest, environment:Environment) => Response };


export function Handler(
    request:Request, functions:MethodFunctions, 
    endpoint:Endpoint, module:ConfigModule, server:ConfigServer,
    type:BundlerType
):Response {
    let method = request.method.toUpperCase();
    if (REQUEST_METHODS.includes(method) && functions[method]) {
        try {
            let sherpaRequest = prepareRequest(request, type);
            let environment   = new Environment(server, module, endpoint);
            return functions[method](sherpaRequest, environment);
        } catch (error) {
            return new Response(`SherpaJS: ${error.message}`, { status: 405 });
        }
    } else {
        return new Response(`Unsupported method "${request.method}".`, { status: 405 });
    }
}


function prepareRequest(request:Request, type:BundlerType):SherpaRequest {
    if (type === BundlerType.Vercel) {
        return prepareRequestVercel(request);
    } else if (type === BundlerType.ExpressJS) {
        return request as SherpaRequest;
    } else {
        throw new Error("Not implemented");
    }
}


function prepareRequestVercel(request:Request):SherpaRequest {
    let params   = new URLSearchParams(request.url);
    let _request = request as SherpaRequest;
    _request["query"]  = {};
    _request["params"] = {};
    params.forEach((value, key) => {
        if (key.startsWith("PARAM--")) {
            _request["params"][key.replace("PARAM--", "")] = value;
        } else {
            _request["query"][key] = value;
        }
    });
    return _request;
}


export async function ExpressJSResponse(sherpa:Response, express:ExpressResponse) {
    let type = sherpa.headers.get("content-type");
    express.status(sherpa.status);
    express.set(Object.fromEntries(sherpa.headers.entries()));
    if (type && type.includes("text/")) {
        express.send(await sherpa.text());
    } else if (type && type.includes("application/json")) {
        express.send(await sherpa.json());
    } else {
        express.status(500).send("Error: SherpaJS ExpressJS only currently support JSON and Text, please contact support.");
    }
}


// Those who accepted his message were baptized, and about three thousand were
// added to their number that day.
// - Acts 2:41
