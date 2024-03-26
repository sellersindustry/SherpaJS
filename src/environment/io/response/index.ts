/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Response builder
 *
 */


import { BodyType, CONTENT_TYPE, Headers } from "../model.js";
import { IResponse } from "./interface.js";
import { STATUS_TEXT } from "./status-text.js";


export interface Options {
    headers:Headers;
    status:number;
}


const DEFAULT_OPTIONS:Options = {
    headers:new Headers(),
    status:200,
}


export class Response {


    static new(options?:Partial<Options>):IResponse {
        let _options = Response.defaultOptions(BodyType.None, options);
        return {
            status: _options.status,
            statusText: Response.getStatusText(_options.status),
            headers: _options.headers,
            body: undefined,
            bodyType: BodyType.None
        }
    }


    static text(text:string, options?:Partial<Options>):IResponse {
        let _options = Response.defaultOptions(BodyType.Text, options);
        return {
            status: _options.status,
            statusText: Response.getStatusText(_options.status),
            headers: _options.headers,
            body: text,
            bodyType: BodyType.Text
        }
    }


    static JSON(JSON:Record<string, any>, options?:Partial<Options>):IResponse {
        let _options = Response.defaultOptions(BodyType.JSON, options);
        return {
            status: _options.status,
            statusText: Response.getStatusText(_options.status),
            headers: _options.headers,
            body: JSON,
            bodyType: BodyType.JSON
        }
    }


    static redirect(redirect:string, options?:Partial<Options>):IResponse {
        let _options = Response.defaultOptions(BodyType.None, options);
        if (!_options.headers.has("Location")) {
            _options.headers.set("Location", redirect);
        }
        return {
            status: 302,
            statusText: Response.getStatusText(302),
            headers: _options.headers,
            body: undefined,
            bodyType: BodyType.None
        }
    }


    private static defaultOptions(bodyType:BodyType, options?:Partial<Options>):Options {
        let _options:Options = {
            ...DEFAULT_OPTIONS,
            ...options
        };
        if (!_options.headers.has("Content-Type")) {
            _options.headers.set("Content-Type", CONTENT_TYPE[bodyType]);
        }
        return _options;
    }


    private static getStatusText(status:number):string {
        let text = STATUS_TEXT[status];
        if (!text) {
            throw new Error(`Status code "${status}" is invalid.`);
        }
        return text;
    }


}


// I write these things to you who believe in the name of the Son of God so
// that you may know that you have eternal life.
// - 1 John 5:13
