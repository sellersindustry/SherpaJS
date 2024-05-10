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


import { DirectoryStructureTree } from "../utilities/path/directory-structure/model.js";
import { Path } from "../utilities/path/index.js";
import { Level, Message } from "../utilities/logger/model.js"
import { Tooling } from "../utilities/tooling/index.js";
import { getModuleConfig } from "./config-module/index.js";
import { getServerConfig } from "./config-server/index.js";
import { getAssetFiles } from "./file-assets/index.js";
import { getAssets } from "./assets/index.js";
import { getEndpointFiles } from "./file-endpoints/index.js";
import { getEndpoint as getEndpointFileByDeclaration } from "./endpoint/index.js";
import {
    Context, CreateModuleInterface, Endpoint, EndpointTree,
    ModuleConfigFile, ModuleInterface, Segment,
    SUPPORTED_FILE_EXTENSIONS,
    AssetTree, Asset, Structure
} from "../models.js"
import { Logger } from "../utilities/logger/index.js";


export async function getStructure(entry:string):Promise<Structure & { logs:Message[] }> {
    let logs:Message[] = [];

    let { server, logs: logsServer } = await getServerConfig(entry);
    logs.push(...logsServer);
    if (!server) return { logs };


    let { endpoints, logs: logsEndpoints } = await getComponents(entry, server.instance.context, server.filepath, [], true);
    logs.push(...logsEndpoints);
    if (!endpoints) return { logs };

    let { files, logs: logsAssets } = getAssetFiles(entry);
    logs.push(...logsAssets);

    let assets = getAssets(files.tree);

    return {
        logs,
        endpoints: {
            tree: endpoints,
            list: flattenEndpoints(endpoints)
        },
        assets: {
            tree: assets,
            list: flattenAssets(assets)
        },
        server
    };
}


export async function getComponents(entry:string, context:Context, contextFilepath:string, segments:Segment[], isRoot:boolean):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let logs:Message[] = [];

    let { module, logs: logsModule } = await getModule(entry, context, contextFilepath, isRoot);
    logs.push(...logsModule);
    if (!module) return { logs };

    let { files: endpointFiles, logs: endpointFileLogs } = getEndpointFiles(module.entry);
    logs.push(...endpointFileLogs);
    if (!endpointFiles) return { logs };

    let { endpoints, logs: endpointsLogs } = await getEndpoints(module, endpointFiles.tree, segments);
    logs.push(...endpointsLogs);

    return { endpoints, logs };
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


async function getEndpoints(module:ModuleConfigFile, endpointTree:DirectoryStructureTree, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let endpoints:EndpointTree = {};
    let logs:Message[]         = [];
    let isModuleLoader:boolean = false;

    if (endpointTree.files.length > 0) {
        let filepath   = endpointTree.files[0].filepath.absolute;
        let component  = await getEndpointFile(module, filepath, segments);
        isModuleLoader = component.isModuleLoader;
        logs.push(...component.logs);
        if (component.endpoints) {
            endpoints = { ...endpoints, ...component.endpoints };
        }
    }

    if (isModuleLoader && Object.keys(endpointTree.directories).length > 0) {
        let dirName = Object.keys(endpointTree.directories)[0];
        logs.push({
            level: Level.ERROR,
            text: `Sub-routes are not supported in module loading routes.`,
            content: `Remove the "${dirName}" route from "${segments.map(segment => segment.name).join("/")}"`,
            file: {
                filepath: Path.getDirectory(endpointTree.files[0].filepath.absolute)
            }
        });
    }

    for (let segmentName of Object.keys(endpointTree.directories)) {
        let segmentKey = `/${segmentName}`;
        if (endpoints[segmentKey]) {
            throw new Error(`Overlapping endpoint segment: "${segmentKey}".`);
        }

        let _segments = [...segments, getSegment(segmentName)];
        let component = await getEndpoints(
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


async function getEndpointFile(module:ModuleConfigFile, filepath:string, segments:Segment[]):Promise<{ logs:Message[], isModuleLoader:boolean, endpoints?:EndpointTree }> {
    let functionsFilepath = getFunctionsFilepath(filepath);
    let viewFilepath      = getViewFilepath(filepath);
    if (functionsFilepath && await Tooling.hasExportedLoader(functionsFilepath)) {
        return {
            ...await getEndpointFileByModule(functionsFilepath, viewFilepath, segments),
            isModuleLoader: true
        };
    }
    return {
        ...await getEndpointFileByDeclaration(module, functionsFilepath, viewFilepath, segments),
        isModuleLoader: false
    }
}


function getViewFilepath(filepath:string):string|undefined {
    let directory = Path.getDirectory(filepath);
    let filename  = Path.getName(filepath);
    return Path.resolveExtension(directory, filename, SUPPORTED_FILE_EXTENSIONS.ENDPOINT.VIEW);
}


function getFunctionsFilepath(filepath:string):string|undefined {
    let directory = Path.getDirectory(filepath);
    let filename  = Path.getName(filepath);
    return Path.resolveExtension(directory, filename, SUPPORTED_FILE_EXTENSIONS.ENDPOINT.FUNCTIONS);
}


async function getEndpointFileByModule(functionsFilepath:string, viewFilepath:string|undefined, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let logs:Message[] = [];

    if (viewFilepath != undefined) {
        logs.push({
            level: Level.WARN,
            text: "Views are not supported by Module Endpoints.",
            content: "View will be ignored.",
            file: { filepath: viewFilepath }
        });
        return { logs };
    }

    let { module, logs: logsModule } = await Tooling.getExportedLoader(functionsFilepath, "Module Loader", ".load");
    logs.push(...logsModule);
    if (!module) return { logs };

    let moduleLoader:ModuleInterface<unknown>;
    try {
        moduleLoader = await Tooling.getDefaultExport(functionsFilepath) as ModuleInterface<unknown>;
    } catch (e) {
        return {
            logs: [{
                level: Level.ERROR,
                text: "Module Loader failed to parse.",
                content: e.message,
                file: { filepath: functionsFilepath }
            }]
        };
    }

    let entry      = Path.resolve(module.filepath, Path.getDirectory(functionsFilepath)) as string;
    let components = await getComponents(entry, moduleLoader.context, functionsFilepath, segments, false);
    let typeErrors = await Tooling.typeValidation(functionsFilepath, "Module Loader");
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

    let endpointList:Endpoint[] = [];
    if (endpointTree["."]) {
        endpointList.push(endpointTree["."] as Endpoint);
    }

    let segments = Object.keys(endpointTree).filter(segment => segment != ".");
    endpointList.push(...segments.map(segment => flattenEndpoints(endpointTree[segment] as EndpointTree)).flat());
    return endpointList;
}


function flattenAssets(assetTree?:AssetTree):Asset[] {
    if (!assetTree) return [];
    if (assetTree["filepath"]) return [assetTree as unknown as Asset];

    let assetList:Asset[] = [];
    if (assetTree["."]) {
        assetList.push(...assetTree["."] as Asset[]);
    }

    let segments = Object.keys(assetTree).filter(segment => segment != ".");
    assetList.push(...segments.map(segment => flattenAssets(assetTree[segment] as AssetTree)).flat());
    return assetList.flat();
}


// Jesus answered, "The work of God is this: to believe in the one he has sent."
// - John 6:29
