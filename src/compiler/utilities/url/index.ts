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


    static getPathname(url:string, base?:string):string {
        return this.getInstance(url, base).pathname;
    }


    static getSearchParams(url:string, base?:string):URLSearchParams {
        return this.getInstance(url, base).searchParams;
    }


    static getHref(url:string, base?:string):string {
        return this.getInstance(url, base).toString();
    }


    static getHrefNoParameters(url:string, base?:string):string {
        let instance = this.getInstance(url, base);
        return instance.origin + instance.pathname;
    }


    private static getInstance(url:string, base?:string):URL {
        return new URL(url, base ? base : "https://example.com");
    }

}


// Paul said, "John's baptism was a baptism of repentance. He told the people
// to believe in the one coming after him, that is, in Jesus."
// - Acts 19:4
