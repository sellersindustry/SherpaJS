/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Get Endpoints
 *
 */


import { Endpoint, EndpointTree, FILENAME, FILE_EXTENSIONS, ModuleConfigFile, Segment } from "../../models.js";
import { Level, Message } from "../../utilities/logger/model.js";
import { DirectoryStructureTree } from "../../utilities/path/directory-structure/model.js";
import { Path } from "../../utilities/path/index.js";
import { getEndpointFiles } from "./files.js";
import { getEndpointFunctions } from "./load-functions.js";
import { getEndpointModule } from "./load-module.js";


export async function getEndpoints(entry:string, module:ModuleConfigFile, segments:Segment[]=[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let logs:Message[] = [];

    let { files, logs: logsFiles } = getEndpointFiles(entry);
    logs.push(...logsFiles);
    if (!files) return { logs };

    let { endpoints, logs: logsEndpoints } = await getEndpointTree(module, files.tree, segments);
    logs.push(...logsEndpoints);

    return { logs, endpoints };
}


export function flattenEndpoints(endpointTree?:EndpointTree):Endpoint[] {
    if (!endpointTree) return [];
    if (endpointTree["filepath"]) return [endpointTree as unknown as Endpoint];

    let endpointList:Endpoint[] = [];
    if (endpointTree["."]) {
        endpointList.push(endpointTree["."] as Endpoint);
    }

    let segments = Object.keys(endpointTree).filter(segment => segment != ".");
    endpointList.push(...segments.map(segment => flattenEndpoints(endpointTree[segment] as EndpointTree)).flat());
    return endpointList;
}


async function getEndpointTree(module:ModuleConfigFile, endpointTree:DirectoryStructureTree, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let endpoints:EndpointTree = {};
    let logs:Message[]         = [];

    if (endpointTree.files.length > 0) {
        let filepath  = Path.getDirectory(endpointTree.files[0].filepath.absolute);
        let component = await getEndpointFile(module, filepath, segments);
        logs.push(...component.logs);
        if (component.endpoints) {
            endpoints = { ...endpoints, ...component.endpoints };
        }
    }

    for (let segmentName of Object.keys(endpointTree.directories)) {
        let segmentKey = `/${segmentName}`;
        if (endpoints[segmentKey]) {
            throw new Error(`Overlapping endpoint segment: "${segmentKey}".`);
        }

        let _segments = [...segments, getSegment(segmentName)];
        let component = await getEndpointTree(
            module,
            endpointTree.directories[segmentName],
            _segments
        );
        logs.push(...component.logs);
        if (component.endpoints) {
            endpoints[segmentKey] = component.endpoints;
        }
    }

    return { logs, endpoints };
}


async function getEndpointFile(module:ModuleConfigFile, filepath:string, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let fileFunctions = getEndpointFilepathFunctions(filepath);
    let fileView      = getEndpointFilepathView(filepath);
    let fileModule    = getEndpointFilepathModule(filepath);

    if (fileModule && fileFunctions) {
        return {
            logs: [{
                level: Level.ERROR,
                text: "Endpoints can not have both module and functions.",
                file: { filepath: filepath }
            }]
        }
    }

    if (fileModule && fileView) {
        return {
            logs: [{
                level: Level.ERROR,
                text: "Module endpoints can not have views.",
                file: { filepath: fileView }
            }]
        }
    }

    if (fileFunctions || fileView) {
        return await getEndpointFunctions(module, fileFunctions, fileView, segments);
    }
    
    if (fileModule) {
        return await getEndpointModule(fileModule, segments);
    }
    
    throw new Error(`Endpoint "${filepath}" does not exist.`);
}


function getEndpointFilepathView(filepath:string):string|undefined {
    return Path.resolveExtension(
        filepath,
        FILENAME.ENDPOINT.VIEW,
        FILE_EXTENSIONS.ENDPOINT.VIEW
    );
}


function getEndpointFilepathFunctions(filepath:string):string|undefined {
    return Path.resolveExtension(
        filepath,
        FILENAME.ENDPOINT.FUNCTIONS,
        FILE_EXTENSIONS.ENDPOINT.FUNCTIONS
    );
}


function getEndpointFilepathModule(filepath:string):string|undefined {
    return Path.resolveExtension(
        filepath,
        FILENAME.ENDPOINT.MODULE,
        FILE_EXTENSIONS.ENDPOINT.MODULE
    );
}


function getSegment(id:string):Segment {
    let isDynamic = id.startsWith("[") && id.endsWith("]");
    let name      = isDynamic ? id.slice(1, -1) : id;
    return { name, isDynamic };
}


// Jesus answered, "My teaching is not my own. It comes from the one who sent me."
// - John 7:16
