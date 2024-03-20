/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Wed Mar 20 2024
 *   file: utilities.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Request Utilities
 *
 */


import { Headers, PathParameters, QueryParameters, URLParameter } from "../model.js";
import { Segment } from "../../../compiler/models.js";
import { URLs } from "../../../compiler/utilities/url/index.js";


const REDIRECT_PARAM_NAME = "SHERPA-PARAMS";


export class RequestUtilities {


    static pathParamAsQueryParamRedirect(segments:Segment[]):{ source:string, destination:string } {
        let paths:string[]      = [];
        let parameters:string[] = [];
        for (let i = 0; i < segments.length; i++) {
            if (segments[i].isDynamic) {
                paths.push(`(?<key-${i}>[a-zA-Z0-9,-_]+)`);
                parameters.push(`$key-${i}`);
            } else {
                paths.push(segments[i].name);
            }
        }
        let source      = `/${paths.join("/")}`;
        let destination = `/${this.getDynamicURL(segments)}?${REDIRECT_PARAM_NAME}=${parameters.join(",")}`;
        return { source, destination };
    }


    static pathParamAsQueryParamRedirectProcess(url:string, segments:Segment[]):string {
        let parameters = URLs.getSearchParams(url);
        if (!parameters.has(REDIRECT_PARAM_NAME)) {
            return url;
        }
        let dynamicSegments     = parameters.get(REDIRECT_PARAM_NAME) as string;
        let dynamicSegmentIndex = 0;
        parameters.delete(REDIRECT_PARAM_NAME);
        return `/${segments.map((segment) => {
            if (segment.isDynamic) {
                dynamicSegmentIndex += 1;
                return dynamicSegments[dynamicSegmentIndex - 1];
            } else {
                return segment.name;
            }
        }).join("/")}${parameters.size > 0 ? `?${parameters.toString()}` : ""}`;
    }


    static getDynamicURL(segments:Segment[]):string {
        return segments.map((segment) => {
            return segment.isDynamic ? `[${segment.name}]` : segment.name;
        }).join("/");
    }


    static parseHeader(headers:any):Headers {
        let _headers = {};
        Object.keys(headers).forEach((key:string) => {
            _headers[key] = headers[key];
        });
        return _headers;
    }


    static parseParamsPath(url:string, segments:Segment[]):PathParameters {
        let params = {};
        URLs.getPathname(url).split("/").filter((o) => o != "").forEach((value:string, index:number) => {
            if (segments[index].isDynamic) {
                let key    = segments[index].name;
                let _value = this.parseParam(value);
                this.setValue(params, key, _value);
            }
        });
        return params;
    }


    static parseParamsQuery(url:string):QueryParameters {    
        let params = {};
        URLs.getSearchParams(url).forEach((value, key) => {
            this.setValue(params, key, this.parseParam(value));
        });
        return params;
    }


    static setValue<T>(object:Record<string, T|T[]>, key:string, values:T[]) {
        if (object.hasOwnProperty(key)) {
            if (Array.isArray(object[key])) {
                (object[key] as T[]).push(...values);
            } else {
                object[key] = [object[key] as T, ...values];
            }
        } else {
            object[key] = (values.length == 1) ? values[0] : values;
        }
    }


    static parseParam(value:string):URLParameter[] {
        if (value.includes(",")) {
            return value.split(",").map((subValue) => this.parseParam(subValue)).flat();
        } else {
            if (value == "true") {
                return [true];
            } else if (value == "false") {
                return [false];
            } else if (/^\d+$/.test(value)) {
                return [parseInt(value)];
            }
            return [value];
        }
    }


}


// Produce fruit in keeping with repentance.
// - Matthew 3:8
