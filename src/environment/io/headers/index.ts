/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 25 2024
 *   file: headers.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: IO Headers Class
 *
 */


export type HeadersInit = string[][] | Record<string, string | ReadonlyArray<string>> | IHeaders | Headers;


export class IHeaders implements Headers {
    
    private headers:Record<string, string>;

    constructor(init?:HeadersInit) {
        this.headers = {};
        if (init) {
            if (init instanceof Headers || init instanceof IHeaders) {
                init.forEach((value:string, name:string) => {
                    this.set(name, value);
                });
            } else if (Array.isArray(init)) {
                init.forEach(([name, value]) => {
                    this.append(name, value);
                });
            } else {
                Object.entries(init).forEach(([name, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach(v => this.append(name, v));
                    } else {
                        this.set(name, value as string);
                    }
                });
            }
        }
    }
  

    append(name:string, value:string):void {
        let normalizedName = name.toLowerCase();
        this.headers[normalizedName] = this.headers[normalizedName]
            ? `${this.headers[normalizedName]}, ${value}`
            : value;
    }


    has(name:string):boolean {
        return this.get(name) != null;
    }


    get(name:string):string|null {
        return this.headers[name.toLowerCase()] || null;
    }


    set(name:string, value:string):void {
        this.headers[name.toLowerCase()] = value;
    }


    delete(name:string): void {
        delete this.headers[name.toLowerCase()];
    }


    toJSON():Record<string, string> {
        return { ...this.headers };
    }


    toString():string {
        return JSON.stringify(this.headers);
    }


    getSetCookie():string[] {
        return Object.entries(this.headers)
            .filter(([name]) => name.toLowerCase() === "set-cookie")
            .flatMap(([_, value]) => value.split(", "));
    }


    forEach(callbackfn:(value: string, key: string, iterable: Headers) => void, thisArg?:unknown):void {
        for (const [name, value] of Object.entries(this.headers)) {
          callbackfn.call(thisArg, value, name, this);
        }
    }
    

    keys():IterableIterator<string> {
        return Object.keys(this.headers)[Symbol.iterator]() as IterableIterator<string>;
    }
    

    values():IterableIterator<string> {
        return Object.values(this.headers)[Symbol.iterator]() as IterableIterator<string>;
    }
    

    entries():IterableIterator<[string, string]> {
        return Object.entries(this.headers)[Symbol.iterator]() as IterableIterator<[string, string]>;
    }


    *[Symbol.iterator]():IterableIterator<[string, string]> {
        for (const [name, value] of Object.entries(this.headers)) {
          yield [name, value];
        }
    }


}


// I will never forget your precepts, for by them you have preserved my life.
// - Psalm 119:93
