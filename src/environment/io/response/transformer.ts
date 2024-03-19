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


import { Body, BodyType, CONTENT_TYPE } from "../model.js";
import { IResponse } from "./interface.js";
import { ServerResponse as LocalResponse } from "http";


export class ResponseTransform {


    public static Local(response:IResponse, nativeResponse:LocalResponse) {
        nativeResponse.statusCode    = response.status;
        nativeResponse.statusMessage = response.statusText;

        for (let [key, value] of Object.entries(response.headers)) {
            nativeResponse.setHeader(key, value);
        }

        if (response.bodyType != BodyType.None && !nativeResponse.hasHeader("Content-Type")) {
            nativeResponse.setHeader("Content-Type", CONTENT_TYPE[response.bodyType]);
        }

        if (response.redirect) {
            nativeResponse.setHeader("Location", response.redirect);
        }

        let body:Body = undefined;
        switch (response.bodyType) {
            case BodyType.Text:
                body = response.body;
                break;
            case BodyType.JSON:
                body = JSON.stringify(response.body);
                break;
        }

        nativeResponse.end(body);
    }


    public static Vercel(response:IResponse) {

    }

    
}


// We have come to share in Christ, if indeed we hold our original conviction
// firmly to the very end.
// - Hebrews 3:14

