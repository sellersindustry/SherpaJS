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


import { Segment } from "../../../compiler/models.js";


export class RequestUtilities {


    static getDynamicURL(segments:Segment[]):string {
        return segments.map((segment) => {
            return segment.isDynamic ? `[${segment.name}]` : segment.name;
        }).join("/");
    }


}


// Produce fruit in keeping with repentance.
// - Matthew 3:8
