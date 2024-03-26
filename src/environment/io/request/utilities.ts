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


import { PathParameters, QueryParameters, URLParameter } from "../model.js";
import { Segment } from "../../../compiler/models.js";
import { OriginURL } from "../../../compiler/utilities/url/index.js";


export class RequestUtilities {


    static getDynamicURL(segments:Segment[]):string {
        return segments.map((segment) => {
            return segment.isDynamic ? `[${segment.name}]` : segment.name;
        }).join("/");
    }


    static parseParamsPath(url:string, segments:Segment[]):PathParameters {
        let params = {};
        new OriginURL(url).pathname.split("/").filter((o) => o != "").forEach((value:string, index:number) => {
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
        new OriginURL(url).searchParams.forEach((value, key) => {
            this.setValue(params, key, this.parseParam(value));
        });
        return params;
    }


    static setValue<T>(object:Record<string, T|T[]>, key:string, values:T[]) {
        if (object[key]) {
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
