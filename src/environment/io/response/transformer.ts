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


import { OriginURL } from "../../../compiler/utilities/url/index.js";
import { BodyType } from "../model.js";
import { IRequest } from "../request/interface.js";
import { IResponse } from "./interface.js";
import { ServerResponse as LocalResponse } from "http";
const VercelResponse = Response;
type VercelResponseType = Response;


export class ResponseTransform {


    public static Local(request:IRequest, response:IResponse, nativeResponse:LocalResponse) {
        this.applyRedirectHeaders(request, response);
        nativeResponse.statusCode    = response.status;
        nativeResponse.statusMessage = response.statusText;

        for (let [key, value] of response.headers.entries()) {
            if (value) {
                nativeResponse.setHeader(key, value);
            }
        }

        nativeResponse.end(this.getBody(response));
    }


    public static Vercel(request:IRequest, response:IResponse):VercelResponseType {
        this.applyRedirectHeaders(request, response);
        return new VercelResponse(this.getBody(response), {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText
        });
    }


    private static getBody(response:IResponse):string|undefined {
        switch (response.bodyType) {
            case BodyType.Text:
                return response.body as string;
            case BodyType.JSON:
                return JSON.stringify(response.body);
        }
        return undefined;
    }


    private static applyRedirectHeaders(request:IRequest, response:IResponse) {
        if (response.headers.has("Location")) {
            let host     = request.headers.get("host");
            let protocol = host.toLowerCase().includes("localhost") ? "http" : "https";
            let origin   = `${protocol}://${host}`;
            let url      = new OriginURL(request.url, origin);
            let path     = url.origin + url.pathname;
            // NOTE: a base url is required, trailing "/" required for proper "./" and "../"
            path = !path.endsWith("/") ? `${path}/` : path;
            response.headers.set("Location", new OriginURL(response.headers.get("Location"), path).href);
        }
    }

    
}


// We have come to share in Christ, if indeed we hold our original conviction
// firmly to the very end.
// - Hebrews 3:14

