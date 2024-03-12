/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: response.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Environment Response
 *
 */


export default function NewResponse(body?:unknown, options?:ResponseInit):Response {
    if (body) {
        if (typeof body == "string") {
            return new Response(body, options);
        } else {
            return Response.json(body, options);
        }
    }
    return new Response("", options);
}


// We have come to share in Christ, if indeed we hold our original conviction
// firmly to the very end.
// - Hebrews 3:14
