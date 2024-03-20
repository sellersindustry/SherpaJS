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


import { BodyType } from "../model.js";
import { IResponse } from "./interface.js";
import { ServerResponse as LocalResponse } from "http";
const VercelResponse = Response;
type VercelResponseType = Response;


export class ResponseTransform {


    public static Local(response:IResponse, nativeResponse:LocalResponse) {
        nativeResponse.statusCode    = response.status;
        nativeResponse.statusMessage = response.statusText;

        for (let [key, value] of Object.entries(response.headers)) {
            if (value) {
                nativeResponse.setHeader(key, value);
            }
        }

        nativeResponse.end(this.getBody(response));
    }


    public static Vercel(response:IResponse):VercelResponseType {
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

    
}


// We have come to share in Christ, if indeed we hold our original conviction
// firmly to the very end.
// - Hebrews 3:14

