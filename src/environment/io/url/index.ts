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


export class OriginURL extends URL {

    constructor(input: string, base?:string|OriginURL|URL) {
        super(input, base ? base : "http://0.0");
        this.pathname = this.pathname.endsWith("/") ? this.pathname.slice(0, -1) : this.pathname;
    }

}


// Paul said, "John's baptism was a baptism of repentance. He told the people
// to believe in the one coming after him, that is, in Jesus."
// - Acts 19:4
