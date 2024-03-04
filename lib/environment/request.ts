/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: request.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Environment Request
 *
 */



export type SherpaRequest = Request & {
    query:{[key:string]:string};
    params:{[key:string]:string};
};


// Therefore I tell you, whatever you ask for in prayer, believe that you have
// received it, and it will be yours.
// - Mark 11:24
