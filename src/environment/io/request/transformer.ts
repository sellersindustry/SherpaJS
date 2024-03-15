import { Segment } from "../../../compiler/models.js";
import { BodyType, Method, PathParameters, QueryParameters, URLParameter } from "../model.js";
import { IRequest } from "./interface.js";
import { IncomingMessage as LocalRequest } from "http";


export class RequestTransform {


    static Local(req:LocalRequest, segments:Segment[]):IRequest {
        if (!req.url || !req.method) {
            throw new Error("Missing URL and Methods");
        }
        return {
            url: new URL(req.url).pathname,
            params: {
                path: RequestTransform.parseParamsPath(req.url, segments),
                query: RequestTransform.parseParamsQuery(req.url)
            },
            method: req.method.toUpperCase() as keyof typeof Method,
            headers: {}, //! FIXME
            body: "", //! FIXME
            bodyType: BodyType.Text //! FIXME
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


    private static parseParamsPath(url:string, segments:Segment[]):PathParameters {
        let params = {};
        new URL(url).pathname.split(url).forEach((value:string, index:number) => {
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
        new URL(url).searchParams.forEach((value, key) => {
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


}

