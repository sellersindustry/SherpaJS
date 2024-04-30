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


import fs from "fs";
import { Context, Method } from "../../compiler/models.js";
import { Response, IResponse, IRequest } from "../../native/index.js";


type callback  = (request?:IRequest, context?:Context) => Promise<IResponse|undefined>|IResponse|undefined;
type endpoints = {
    [key in keyof typeof Method]: undefined|callback;
};


export async function Handler(endpoints:endpoints, view:string|undefined, context:Context, request:IRequest):Promise<IResponse> {
    if (view && request.method == Method.GET) {
        try {
            return Response.HTML(fs.readFileSync(view, "utf8"));
        } catch (error) {
            return Response.text(error.message, { status: 500 });
        }
    } else if (endpoints[request.method]) {
        try {
            let response = await endpoints[request.method](request, context);
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
