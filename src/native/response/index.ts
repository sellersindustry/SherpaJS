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


import { Headers, HeadersInit } from "../headers/index.js";
import { Body, BodyType, CONTENT_TYPE } from "../model.js";
import { STATUS_TEXT } from "./status-text.js";


export interface Options {
    headers:HeadersInit;
    status:number;
}


export class IResponse {

    status:number;
    statusText:string;
    headers:Headers;

    body:Body;
    bodyType:keyof typeof BodyType;


    constructor(options?:Partial<Options>) {
        let _options = IResponse.defaultOptions(BodyType.None, options);
        this.status = _options.status;
        this.statusText = IResponse.getStatusText(_options.status);
        this.headers = _options.headers;
        this.body = undefined;
        this.bodyType = BodyType.None;
    }


    static new(options?:Partial<Options>):IResponse {
        return new IResponse(options);
    }


    static text<T extends { toString():string }>(text:T, options?:Partial<Options>):IResponse {
        let _options = IResponse.defaultOptions(BodyType.Text, options);
        return {
            status: _options.status,
            statusText: IResponse.getStatusText(_options.status),
            headers: _options.headers,
            body: text.toString(),
            bodyType: BodyType.Text
        }
    }


    static JSON<T extends { toJSON():Record<string, unknown> }>(JSON:T|Record<string, unknown>, options?:Partial<Options>):IResponse {
        let _options    = IResponse.defaultOptions(BodyType.JSON, options);
        let _isCallable = JSON.toJSON && typeof (JSON as Record<string, unknown>).toJSON === "function";
        return {
            status: _options.status,
            statusText: IResponse.getStatusText(_options.status),
            headers: _options.headers,
            body: _isCallable ? (JSON as { toJSON():Record<string, unknown> }).toJSON() : JSON,
            bodyType: BodyType.JSON
        }
    }


    static HTML(html:string, options?:Partial<Options>):IResponse {
        let _options = IResponse.defaultOptions(BodyType.HTML, options);
        return {
            status: _options.status,
            statusText: IResponse.getStatusText(_options.status),
            headers: _options.headers,
            body: html,
            bodyType: BodyType.HTML
        }
    }


    static redirect(redirect:string):IResponse {
        let _options = IResponse.defaultOptions(BodyType.None, {});
        if (!_options.headers.has("Location")) {
            _options.headers.set("Location", redirect);
        }
        return {
            status: 302,
            statusText: IResponse.getStatusText(302),
            headers: _options.headers,
            body: undefined,
            bodyType: BodyType.None
        }
    }


    private static defaultOptions(bodyType:BodyType, options?:Partial<Options>):{ status:number, headers:Headers } {
        let _options = {
            status: options?.status || 200,
            headers: new Headers(options?.headers || {})
        };
        if (!_options.headers.has("Content-Type")) {
            _options.headers.set("Content-Type", CONTENT_TYPE[bodyType] as string);
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
