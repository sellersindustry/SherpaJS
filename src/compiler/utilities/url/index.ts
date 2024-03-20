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


export class URLs {


    static getPathname(url:string):string {
        let path = this.getInstance(url).pathname;
        // NOTE: normalize url, remove "./" and "../"
        path = path.replace(/\/\.\//g, "/");
        path = path.replace(/\/[^/]+\/\.\.\//g, "/");
        return path;
    }


    static getSearchParams(url:string):URLSearchParams {
        return this.getInstance(url).searchParams;
    }


    private static getInstance(url:string):URL {
        // NOTE: a base url is required
        url = url.endsWith("/") ? url.slice(0, -1) : url;
        return new URL(`https://example.com${url}`);
    }

}


// Paul said, "John's baptism was a baptism of repentance. He told the people
// to believe in the one coming after him, that is, in Jesus."
// - Acts 19:4
