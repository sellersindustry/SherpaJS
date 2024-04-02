/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: URL Utilities
 *
 */


import { URL } from "node:url";
// import { URL } from "url-parse";


export class OriginURL extends URL {

    // hash: string;
    // host: string;
    // hostname: string;
    // href: string;
    // readonly origin: string;
    // password: string;
    // pathname: string;
    // port: string;
    // protocol: string;
    // search: string;
    // readonly searchParams: URLSearchParams;
    // username: string;

    constructor(input: string, base?:string|OriginURL|URL) {
        super(input, base ? base : "http://0.0");
        this.pathname = this.pathname.endsWith("/") ? this.pathname.slice(0, -1) : this.pathname;
    }

}



// Paul said, "John's baptism was a baptism of repentance. He told the people
// to believe in the one coming after him, that is, in Jesus."
// - Acts 19:4
