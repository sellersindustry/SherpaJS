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


export class Request {


    static new(options?:Partial<Options>):IResponse {
        let _options = Request.defaultOptions(BodyType.None, options);
        return {
            status: _options.status,
            statusText: Request.getStatusText(_options.status),
            headers: _options.headers,
            redirect: undefined,
            body: undefined,
            bodyType: BodyType.None
        }
    }


    static text(text:string, options?:Partial<Options>):IResponse {
        let _options = Request.defaultOptions(BodyType.Text, options);
        return {
            status: _options.status,
            statusText: Request.getStatusText(_options.status),
            headers: _options.headers,
            redirect: undefined,
            body: text,
            bodyType: BodyType.Text
        }
    }


    static JSON(JSON:Record<string, any>, options?:Partial<Options>):IResponse {
        let _options = Request.defaultOptions(BodyType.JSON, options);
        return {
            status: _options.status,
            statusText: Request.getStatusText(_options.status),
            headers: _options.headers,
            redirect: undefined,
            body: JSON,
            bodyType: BodyType.JSON
        }
    }


    static redirect(redirect:string, options?:Partial<Options>):IResponse {
        let _options = Request.defaultOptions(BodyType.None, options);
        return {
            status: 302,
            statusText: Request.getStatusText(302),
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
