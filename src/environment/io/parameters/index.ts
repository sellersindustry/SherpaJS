/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 26 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Parameters
 *
 */



import { Segment } from "../../../compiler/models.js";
import { OriginURL } from "../url/index.js";


type parameterValue = string|number|boolean;
type parameters = { [key:string]:parameterValue[] };


export class Parameters {
    
    private parameters:parameters = {};
    

    public has(key:string):boolean {
        return this.parameters[key] != undefined;
    }


    public get(key:string):parameterValue|undefined {
        if (!this.has(key) || this.parameters[key].length == 0) {
            return undefined;
        }
        return this.parameters[key][0] as parameterValue;
    }


    public getAll(key:string):parameterValue[]|undefined {
        if (!this.has(key)) {
            return undefined;
        }
        return this.parameters[key] as parameterValue[];
    }


    public keys():string[] {
        return Object.keys(this.parameters);
    }

    
    public toJSON():Record<string, parameterValue[]> {
        return { ...this.parameters };
    }


    static getPathParams(url:string, segments:Segment[]):Parameters {
        let params = new Parameters();
        new OriginURL(url).pathname.split("/").filter((o) => o != "").forEach((value:string, index:number) => {
            if (segments[index].isDynamic) {
                params.append(segments[index].name, value, false);
            }
        });
        return params;
    }


    static getQueryParams(url:string):Parameters {    
        let params = new Parameters();
        new OriginURL(url).searchParams.forEach((value, key) => {
            params.append(key, value);
        });
        return params;
    }


    private append(key:string, value:string, useDelimiter:boolean=true) {
        if (!this.has(key)) {
            this.parameters[key] = [];
        }
        this.parameters[key].push(...this.parse(value, useDelimiter));
    }


    private parse(value:string, useDelimiter:boolean):parameterValue[] {
        if (useDelimiter && value.includes(",")) {
            return value.split(",").map((subValue) => this.parse(subValue, useDelimiter)).flat();
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


// Blessed are those whose ways are blameless, who walk according to the law of
// the Lord.
// - Psalm 119:1
