import { Segment } from "../../../compiler/models.js";
import { Body, BodyType, Headers, Method, PathParameters, QueryParameters, URLParameter } from "../model.js";
import { IRequest } from "./interface.js";
import { IncomingMessage as LocalRequest } from "http";


export class RequestTransform {


    static async Local(req:LocalRequest, segments:Segment[]):Promise<IRequest> {
        if (!req.url || !req.method) {
            throw new Error("Missing URL and Methods");
        }

        let { body, bodyType } = await RequestTransform.parseBodyLocal(req);
        return {
            url: req.url,
            params: {
                path: RequestTransform.parseParamsPath(req.url, segments),
                query: RequestTransform.parseParamsQuery(req.url)
            },
            method: req.method.toUpperCase() as keyof typeof Method,
            headers: RequestTransform.parseHeader(req.headers),
            body: body,
            bodyType: bodyType
        }
    }


    static Vercel():IRequest { //! FIXME
        return {
            url: "",
            params: {
                path: {},
                query: {}
            },
            method: Method.DELETE,
            headers: {},
            body: "",
            bodyType: BodyType.Text
        }
    }


    private static parseBodyLocal(req:LocalRequest):Promise<{ body:Body, bodyType:BodyType }> {
        return new Promise((resolve, reject) => {
            let body:Body = "";
            let bodyType  = BodyType.Text;
    
            req.on("data", (chunk: Buffer) => {
                body += chunk.toString();
            });
    
            req.on("end", () => {
                const contentType = req.headers["content-type"];
                if (!contentType || body == "") {
                    resolve({
                        body: undefined,
                        bodyType: BodyType.None
                    });
                }

                if (contentType == "application/json") {
                    body     = JSON.parse(body as string);
                    bodyType = BodyType.JSON;
                }
    
                resolve({
                    body,
                    bodyType
                });
            });
    
            req.on("error", (error:Error) => {
                resolve({ body: undefined, bodyType: BodyType.None });
            });
        });
    }


    private static parseHeader(headers:any):Headers {
        let _headers = {};
        Object.keys(headers).forEach((key:string) => {
            _headers[key] = headers[key];
        });
        return _headers;
    }


    private static parseParamsPath(url:string, segments:Segment[]):PathParameters {
        let params = {};
        url.split("/").filter((o) => o != "").forEach((value:string, index:number) => {
            if (segments[index].isDynamic) {
                let key    = segments[index].name;
                let _value = RequestTransform.parseParam(value);
                if (params[key]) {
                    if (Array.isArray(params[key])) {
                        params[key].push(_value);
                    } else {
                        params[key] = [params[key], _value];
                    }
                } else {
                    params[key] = _value;
                }
            }
        });
        return params;
    }


    private static parseParamsQuery(url:string):QueryParameters {    
        let params = {};
        this.getURL(url).searchParams.forEach((value, key) => {
            let _value = RequestTransform.parseParam(value);
            if (params[key]) {
                if (Array.isArray(params[key])) {
                    params[key].push(_value);
                } else {
                    params[key] = [params[key], _value];
                }
            } else {
                params[key] = _value;
            }
        });
        return params;
    }


    private static parseParam(value:string):URLParameter {
        if (value == "true") {
            return true;
        } else if (value == "false") {
            return false;
        } else if (/^\d+$/.test(value)) {
            return parseInt(value);
        }
        return value;
    }


    private static getURL(url:string):URL {
        // a hostname is required, doesn't matter what it is
        return new URL(`localhost:3000${url}`);
    }


}

