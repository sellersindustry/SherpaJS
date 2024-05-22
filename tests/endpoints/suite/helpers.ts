/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu May 16 2024
 *   file: helpers.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Endpoint Test Suite - Verification Helpers
 *
 */


export class Fail extends Error {
    constructor(message:string) {
        super(message);
    }
}


export function equals(expect:unknown, actual:unknown) {
    if (expect != actual) {
        throw new Fail(`Expected "${expect}" but got "${actual}"`);
    }
}


export function includes(buffer:string, searchString:string) {
    if (!buffer.includes(searchString)) {
        throw new Fail(`Expected "${buffer.slice(0, 10)}..." to include "${searchString}"`);
    }
}


// Therefore we do not lose heart. Though outwardly we are wasting away, yet
// inwardly we are being renewed day by day.
// - 2 Corinthians 4:16
