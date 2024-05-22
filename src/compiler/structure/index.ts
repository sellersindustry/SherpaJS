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


import { Message } from "../utilities/logger/model.js"
import { getModuleConfig } from "./config-module/index.js";
import { getServerConfig } from "./config-server/index.js";
import { flattenAssets, getAssets } from "./assets/index.js";
import {
    Context, CreateModuleInterface, EndpointTree,
    ModuleConfigFile,  Segment, Structure,
} from "../models.js"
import { flattenEndpoints, getEndpoints } from "./endpoint/index.js";


export async function getStructure(entry:string):Promise<Structure & { logs:Message[] }> {
    let logs:Message[] = [];

    let { server, logs: logsServer } = await getServerConfig(entry);
    logs.push(...logsServer);
    if (!server) return { logs };

    let { endpoints, logs: logsEndpoints } = await getComponents(entry, server.instance.context, server.filepath, [], true);
    logs.push(...logsEndpoints);
    if (!endpoints) return { logs };

    let { assets, logs: logsAssets } = getAssets(entry);
    logs.push(...logsAssets);

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

    let { endpoints, logs: endpointFileLogs } = await getEndpoints(module.entry, module, segments);
    logs.push(...endpointFileLogs);
    if (!endpoints) return { logs };

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


// Jesus answered, "The work of God is this: to believe in the one he has sent."
// - John 6:29
