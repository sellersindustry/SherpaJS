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


export class RequestUtilities {


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