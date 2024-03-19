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


import { Method } from "../io/model.js";
import { Context } from "../../compiler/models.js";
import { IResponse } from "../io/response/interface.js";
import { IRequest } from "../io/request/interface";
import { Response } from "../io/response/index.js";


type callback  = (request?:IRequest, context?:Context) => Promise<IResponse|undefined>|IResponse|undefined;
type endpoints = {
    [key in keyof typeof Method]: undefined|callback;
};


export async function Handler(endpoints:endpoints, context:Context, request:IRequest):Promise<IResponse> {
    let callback = endpoints[request.method];
    if (callback) {
        try {
            let response = await callback(request, context);
            if (!response) {
                return Response.new({ status: 200 });
            }
            return response;
        } catch (error) {
            return Response.text(error.message, { status: 500 });
        }
    } else {
        return Response.new({ status: 405 });
    }
}


// Those who accepted his message were baptized, and about three thousand were
// added to their number that day.
// - Acts 2:41
