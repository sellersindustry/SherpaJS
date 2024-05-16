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


import { Segment } from "../../compiler/models.js";


export class RequestUtilities {


    static isDynamicURL(segments:Segment[]):boolean {
        return segments.some((segment) => {
            return segment.isDynamic;
        });
    }


    static getDynamicURL(segments:Segment[]):string {
        return segments.map((segment) => {
            return segment.isDynamic ? `[${segment.name}]` : segment.name;
        }).join("/");
    }


    static compareURL(segmentsA:Segment[], segmentsB:Segment[]):number {
        if (segmentsA.length == 0 || segmentsB.length == 0) {
            return segmentsA.length - segmentsB.length;
        }
        if (segmentsA[0].isDynamic && !segmentsB[0].isDynamic) {
            return 1;
        }
        if (!segmentsA[0].isDynamic && segmentsB[0].isDynamic) {
            return -1;
        }
        if (segmentsA[0]["name"] != segmentsB[0]["name"]) {
            return segmentsA[0]["name"].localeCompare(segmentsB[0]["name"]);
        }
        return this.compareURL(segmentsA.slice(1), segmentsB.slice(1));
    }


}


// Produce fruit in keeping with repentance.
// - Matthew 3:8
