/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: transformer.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: SherpaJS Response to Native
 *
 */


import { OriginURL } from "../../native/url/index.js";
import { BodyType } from "../../native/model.js";
import { IRequest } from "../../native/request/interface.js";
import { IResponse } from "../../native/response/interface.js";
import { ServerResponse as LocalResponse } from "http";
const VercelResponse = Response;
type VercelResponseType = Response;


export function ResponseLocal(request:IRequest, response:IResponse, nativeResponse:LocalResponse) {
    applyRedirectHeaders(request, response);
    nativeResponse.statusCode    = response.status;
    nativeResponse.statusMessage = response.statusText;

    for (let [key, value] of response.headers.entries()) {
        if (value) {
            nativeResponse.setHeader(key, value);
        }
    }

    nativeResponse.end(getBody(response));
}


export function ResponseVercel(request:IRequest, response:IResponse):VercelResponseType {
    applyRedirectHeaders(request, response);
    return new VercelResponse(getBody(response), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText
    });
}


function getBody(response:IResponse):string|undefined {
    switch (response.bodyType) {
        case BodyType.JSON:
            return JSON.stringify(response.body);
        default:
            return response.body as string;
    }
    return undefined;
}


function applyRedirectHeaders(request:IRequest, response:IResponse) {
    if (response.headers.has("Location")) {
        let host     = request.headers.get("host") as string;
        let protocol = host.toLowerCase().includes("localhost") ? "http" : "https";
        let origin   = `${protocol}://${host}`;
        let url      = new OriginURL(request.url, origin);
        let path     = url.origin + url.pathname;
        // NOTE: a base url is required, trailing "/" required for proper "./" and "../"
        path = !path.endsWith("/") ? `${path}/` : path;
        response.headers.set("Location", new OriginURL(response.headers.get("Location") as string, path).href);
    }
}


// We have come to share in Christ, if indeed we hold our original conviction
// firmly to the very end.
// - Hebrews 3:14

