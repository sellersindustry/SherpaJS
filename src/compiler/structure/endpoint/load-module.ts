/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Fri May 10 2024
 *   file: load-module.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Get Endpoint Module
 *
 */


import { EndpointTree, ModuleInterface, Segment } from "../../models.js";
import { Logger } from "../../utilities/logger/index.js";
import { Level, Message } from "../../utilities/logger/model.js";
import { Path } from "../../utilities/path/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { getComponents } from "../index.js";


export async function getEndpointModule(functionsFilepath:string, segments:Segment[]):Promise<{ logs:Message[], endpoints?:EndpointTree }> {
    let logs:Message[] = [];

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


// After the Lord Jesus had spoken to them, he was taken up into heaven and
// he sat at the right hand of God.
// - Mark 16:19
