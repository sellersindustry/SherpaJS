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
    headers:{},
    status:200,
}


export class Response {


    static new(options?:Partial<Options>):IResponse {
        let _options = Response.defaultOptions(BodyType.None, options);
        return {
            status: _options.status,
            statusText: Response.getStatusText(_options.status),
            headers: _options.headers,
            redirect: undefined,
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
            redirect: undefined,
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
            redirect: undefined,
            body: JSON,
            bodyType: BodyType.JSON
        }
    }


    static redirect(redirect:string, options?:Partial<Options>):IResponse {
        let _options = Response.defaultOptions(BodyType.None, options);
        return {
            status: 302,
            statusText: Response.getStatusText(302),
            headers: _options.headers,
            redirect: redirect,
            body: undefined,
            bodyType: BodyType.None
        }
    }


    private static defaultOptions(bodyType:BodyType, options?:Partial<Options>):Options {
        let _options = {
            ...DEFAULT_OPTIONS,
            ...options
        };
        _options["header"] = {
            "Content-Type": CONTENT_TYPE[bodyType],
            ..._options["header"]
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
