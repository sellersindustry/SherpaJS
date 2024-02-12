/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Pattern Validator
 *
 */


const ALPHA_NUMERIC_DASH = /^[a-zA-Z0-9-]+$/;


export class Validate {


    public static AlphaNumericDash(value:string):boolean {
        return ALPHA_NUMERIC_DASH.test(value);
    }

}


// For it is with your heart that you believe and are justified, and it is with
// your mouth that you profess your faith and are saved.
// - Romans 10:10
