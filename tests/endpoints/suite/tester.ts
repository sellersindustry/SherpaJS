/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu May 16 2024
 *   file: tester.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Endpoint Test Suite - Test
 *
 */


import StackTracey from "stacktracey";
import {
    Method, Body, BodyType,
    IResponse, Headers as IHeaders
} from "../../../index.js";
import { Fail } from "./helpers.js";
import { TestResults } from "./model.js";


export class Tester {


    private name:string;
    private method:Method;
    private url:string;
    private body?:Body;
    private handler?:(request:IResponse) => void;


    constructor(name:string, method:Method, url:string, body?:Body) {
        this.name   = name;
        this.method = method;
        this.url    = url;
        this.body   = body;
    }


    expect(fn:(request:IResponse) => void) {
        this.handler = fn;
    }


    async invoke(host:string):Promise<TestResults> {
        try {
            this.handler!(await this.getResponse(host));
            return { name: this.name, success: true };
        } catch (error) {
            let stack = new StackTracey(error.stack).items.map((e) => e.beforeParse).join("\n");
            if (error instanceof Fail) {
                return {
                    name: this.name,
                    success: false,
                    message: error.message.toString(),
                    stack: stack
                }
            }
            return {
                name: this.name,
                success: false,
                message: `JS Error: ${error.message}`,
                stack: stack
            }
        }
    }


    private async getResponse(host:string):Promise<IResponse> {
        let { body, contentType } = this.getRequestBody(this.body);
        return await this.cast(await fetch(new URL(this.url, host).toString(), {
            method: this.method,
            body: body,
            headers: {
                "Content-Type": contentType
            }
        }));
    }


    private getRequestBody(body:Body):{ body:string|undefined, contentType:string } {
        let contentType:string;
        let rawBody:string;
        if (!body) {
            return { body: undefined, contentType: "" };
        } else if (typeof body === "object") {
            contentType = "application/json";
            rawBody     = JSON.stringify(body);
        } else if (typeof body === "string") {
            contentType = "text/plain";
            rawBody     = body as string;
        } else {
            throw new Error("Unsupported body type: " + typeof body);
        }
        return { body: rawBody, contentType: contentType };
    }


    private async cast(response:Response):Promise<IResponse> {
        let headers            = new IHeaders(response.headers);
        let { body, bodyType } = await this.getResponseBody(response, headers);
        return {
            status: response.status,
            statusText: response.statusText,
            headers: headers,
            body: body,
            bodyType: bodyType
        };
    }


    private async getResponseBody(response:Response, headers:IHeaders):Promise<{ body:Body, bodyType:BodyType }> {
        let contentType = (headers.get("Content-Type") || "").toLowerCase();
        let body        = await response.text();
        if (!contentType || body == "") {
            return {
                body: undefined,
                bodyType: BodyType.None
            };
        } else if (contentType.startsWith("application/json")) {
            return {
                body: JSON.parse(body as string),
                bodyType: BodyType.JSON
            };
        } else if (contentType.startsWith("text/html")) {
            return {
                body: body,
                bodyType: BodyType.HTML
            };
        } else if (contentType.startsWith("text/plain")) {
            return {
                body: body,
                bodyType: BodyType.Text
            }
        } else {
            throw new Error(`Unsupported content type: ${contentType}`);
        }
    }


}


// You, God, are my God, earnestly I seek you; I thirst for you, my whole being
// longs for you, in a dry and parched land where there is no water.
// - Psalm 63:1
