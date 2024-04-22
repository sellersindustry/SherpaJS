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


import { getEndpoint as getEndpointFileByDeclaration } from "./endpoint/index.js";
import { DirectoryStructureTree } from "../utilities/files/directory-structure/model.js";
import { Files } from "../utilities/files/index.js";
import { Level, Message } from "../utilities/logger/model.js"
import { Tooling } from "../utilities/tooling/index.js";
import { getModuleConfig } from "./config-module/index.js";
import { getServerConfig } from "./config-server/index.js";
import { getRouteFiles } from "./files-route/index.js";
import {
    Context, CreateModuleInterface, Endpoint, EndpointTree,
    ModuleConfigFile, ModuleInterface, Segment,
    ServerConfigFile, EndpointStructure
} from "../models.js"
import { Logger } from "../utilities/logger/index.js";


type Structure = {
    logs:Message[],
    endpoints?:EndpointStructure,
    server?:ServerConfigFile
}


export async function getStructure(entry:string):Promise<Structure> {
    let logs:Message[] = [];

    let { server, logs: logsServer } = await getServerConfig(entry);
    logs.push(...logsServer);
    if (!server) return { logs };


    let { endpoints, logs: logsEndpoints } = await getComponents(entry, server.instance.context, server.filepath, [], true);
    logs.push(...logsEndpoints);
    if (!endpoints) return { logs };

    return {
        logs,
        endpoints: {
            tree: endpoints,
            list: flattenEndpoints(endpoints)
        },
        server
    };
}


export async function getComponents(entry:string, context:Context, contextFilepath:string, segments:Segment[], isRoot:boolean):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let logs:Message[] = [];

    let { module, logs: logsModule } = await getModule(entry, context, contextFilepath, isRoot);
    logs.push(...logsModule);
    if (!module) return { logs };

    let { files, logs: logsFiles } = getRouteFiles(module.entry);
    logs.push(...logsFiles);
    if (!files) return { logs };

    let structure = await getEndpoints(module, files.tree, segments);
    return { 
        ...structure,
        logs: [...logs, ...structure.logs]
    };
}


async function getModule(entry:string, context:Context, contextFilepath:string, isRoot:boolean):Promise<{ logs:Message[], module?:ModuleConfigFile }> {
    if (isRoot) {
        return {
            logs: [],
            module: {
                entry,
                filepath: entry,
                context: context,
                contextFilepath: contextFilepath,
                instance: {
                    name: ".",
                    interface: CreateModuleInterface
                }
            }
        }
    }
    return await getModuleConfig(entry, context, contextFilepath);
}


async function getEndpoints(module:ModuleConfigFile, dirTree:DirectoryStructureTree, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let endpoints:EndpointTree = {};
    let logs:Message[]         = [];

    if (dirTree.files.length > 0) {
        let { endpoints: _endpoints, logs: endpointLogs } = await getEndpointFile(module, dirTree.files[0].filepath.absolute, segments);
        logs.push(...endpointLogs);
        if (_endpoints) {
            endpoints = { ...endpoints, ..._endpoints };
        }
    }

    for (let segmentName of Object.keys(dirTree.directories)) {
        let segmentKey = `/${segmentName}`;
        if (endpoints[segmentKey]) {
            logs.push({
                level: Level.WARN,
                text: `Overlapping endpoint segment: "${segments.join(".")}".`,
                file: { filepath: dirTree.files[0].filepath.absolute }
            });
        }

        let { endpoints: _endpoints, logs: logsEndpoints } = await getEndpoints(
            module,
            dirTree.directories[segmentName],
            [...segments, getSegment(segmentName)]
        );
        logs.push(...logsEndpoints);
        if (_endpoints) {
            endpoints[segmentKey] = _endpoints;
        }
    }

    return { logs, endpoints };
}


async function getEndpointFile(module:ModuleConfigFile, filepath:string, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    if (await Tooling.hasExportedLoader(filepath)) {
        return await getEndpointFileByModule(filepath, segments);
    }
    return getEndpointFileByDeclaration(module, filepath, segments);
}


async function getEndpointFileByModule(filepath:string, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let logs:Message[] = [];

    let { module, logs: logsModule } = await Tooling.getExportedLoader(filepath, "Module Loader", ".load");
    logs.push(...logsModule);
    if (!module) return { logs };

    let moduleLoader:ModuleInterface<unknown>;
    try {
        moduleLoader = await Tooling.getDefaultExport(filepath) as ModuleInterface<unknown>;
    } catch (e) {
        return {
            logs: [{
                level: Level.ERROR,
                text: "Module Loader failed to parse.",
                content: e.message,
                file: { filepath: filepath }
            }]
        };
    }

    let entry      = Files.resolve(module.filepath, Files.getDirectory(filepath));
    let components = await getComponents(entry, moduleLoader.context, filepath, segments, false);
    let typeErrors = Tooling.typeCheck(filepath, "Module Loader");
    logs.push(...components.logs, ...typeErrors);
    if (Logger.hasError(logs)) {
        return { logs };
    }
    return { ...components, logs };
}


function getSegment(id:string):Segment {
    let isDynamic = id.startsWith("[") && id.endsWith("]");
    let name      = isDynamic ? id.slice(1, -1) : id;
    return { name, isDynamic };
}


function flattenEndpoints(endpointTree?:EndpointTree):Endpoint[] {
    if (!endpointTree) return [];
    if (endpointTree["filepath"]) return [endpointTree as unknown as Endpoint];

    let endpointList = [];
    if (endpointTree["."]) {
        endpointList.push(endpointTree["."]);
    }

    let segments = Object.keys(endpointTree).filter(segment => segment != ".");
    endpointList.push(...segments.map(segment => flattenEndpoints(endpointTree[segment] as EndpointTree)).flat());
    return endpointList;
}


// Jesus answered, "The work of God is this: to believe in the one he has sent."
// - John 6:29
