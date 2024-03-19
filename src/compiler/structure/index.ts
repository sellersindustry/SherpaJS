/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Structure
 *
 */

import { Message } from "../utilities/logger/model.js";
import { Endpoint, Route } from "../models.js";
import { getServerStructure } from "./config-server/index.js";
import { getRouteStructure } from "./routes/index.js";


export async function getStructure(entry:string):Promise<{ errors:Message[], route?:Route, endpoints?:Endpoint[] }> {
    let errors:Message[] = [];
    let { server, errors: errorsServer } = await getServerStructure(entry);
    errors.push(...errorsServer);
    if (!server) {
        return { errors };
    }

    let { route, errors: errorsRoute } = await getRouteStructure(entry, server.config.context, server.filepath);
    errors.push(...errorsRoute);
    return {
        errors,
        route,
        endpoints: flatten(route)
    };
}


function flatten(route?:Route):Endpoint[] {
    if (!route) return [];
    if (route["filepath"]) return [route as unknown as Endpoint];

    let endpoints = [];
    if (route["."]) {
        endpoints.push(route["."]);
    }

    let segments = Object.keys(route).filter(segment => segment != ".");
    endpoints.push(...segments.map(segment => flatten(route[segment] as Route)).flat());
    return endpoints;
}


// Jesus answered, "The work of God is this: to believe in the one he has sent."
// - John 6:29
