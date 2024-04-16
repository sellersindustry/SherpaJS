/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Endpoint Structure
 *
 */

import fs from "fs";
import { Level, Message } from "../../utilities/logger/model.js";
import { Context, Method, ModuleStructure, Route, Segment, VALID_EXPORTS, ContextSchema, HasContext } from "../../models.js";
import { getModuleStructure } from "../config-module/index.js";
import { getDirectoryStructure } from "../directory-structure/index.js";
import { lint } from "../linter/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { DirectoryStructureTree as DirStructTree } from "../directory-structure/model.js";
import { Files } from "../../utilities/files/index.js";
import parseImports from "parse-imports";


export async function getRouteStructure(entry:string, context:Context, contextFilepath:string, segments:Segment[]=[], isRoot:boolean=true):Promise<{ errors:Message[], route?:Route }> {
    let errors:Message[] = [];

    let { module, errors: errorsModule } = await getModule(entry, context, contextFilepath, isRoot);
    errors.push(...errorsModule);
    if (!module) {
        return { errors };
    }

    //! INCLUDE IN GET DIR STRUCT - NOW Routes Structure
    let errorsHasRoutesDir = hasRoutesDir(entry);
    errors.push(...errorsHasRoutesDir);
    if (errorsHasRoutesDir.length > 0) {
        return { errors };
    }
    //! INCLUDE IN GET DIR STRUCT - NOW Routes Structure

    //! FIXME - RESTRUCTURE
    let routesFilepath  = getRoutesDirectory(entry);
    let routesStructure = getDirectoryStructure(routesFilepath);
    let errorsStructure = await lint(routesStructure, routesFilepath);
    errors.push(...errorsStructure);
    //! FIXME - RESTRUCTURE

    let { route, errors: errorsRoutes } = await getRoutes(module, routesFilepath, segments, routesStructure.tree);
    errors.push(...errorsRoutes);
    return { errors, route };
}


async function getModule(entry:string, context:Context|undefined, contextFilepath:string, isRoot:boolean):Promise<{ errors:Message[], module?:ModuleStructure }> {
    if (isRoot) {
        return {
            errors: [],
            module: {
                filepath: entry,
                context: context,
                contextFilepath: contextFilepath,
                config: {
                    name: ".",
                    interface: ContextSchema
                }
            }
        }
    }
    return await getModuleStructure(entry, context, contextFilepath);
}


async function getRoutes(module:ModuleStructure, filepath:string, segments:Segment[], structure:DirStructTree):Promise<{ errors:Message[], route?:Route }> {
    let route:Route      = {};
    let errors:Message[] = [];
    if (structure.files.length > 0) {
        let { route: _route, errors: errorsRoute } = await getEndpoint(module, structure.files[0].filepath, segments);
        errors.push(...errorsRoute);
        if (_route) {
            route = { ...route, ..._route };
        }
    }
    for (let segmentName of Object.keys(structure.directories)) {
        if (route[segmentName]) {
            errors.push({
                level: Level.WARN,
                text: `Overlapping endpoint segment: "${segments.join(".")}".`,
                file: { filepath: filepath }
            });
        }
        let { route: _route, errors: errorsRoute } = await getRoutes(
            module,
            Files.join(filepath, segmentName),
            [...segments, getSegment(segmentName)],
            structure.directories[segmentName]
        );
        errors.push(...errorsRoute);
        if (_route) {
            route[segmentName] = _route;
        }
    }
    return { errors: errors, route };
}


//! FIXME - Breakout into Separate Structure Getter File 
async function getEndpoint(module:ModuleStructure, filepath:string, segments:Segment[]):Promise<{ errors:Message[], route?:Route }> {
    if (await Tooling.hasExportedLoader(filepath)) {
        return await getEndpointByModule(filepath, segments);
    }
    return getEndpointByDeclaration(module, filepath, segments);
}


async function getEndpointByModule(filepath:string, segments:Segment[]):Promise<{ errors:Message[], route?:Route }> {
    let { module, errors: errorsModule } = await Tooling.getExportedLoader(filepath, "Module Loader", ".load");
    if (!module) {
        return { errors: errorsModule };
    }

    let moduleLoader;
    try {
        moduleLoader = await Tooling.getDefaultExport(filepath) as HasContext<unknown>;
    } catch (e) {
        return {
            errors: [{
                level: Level.ERROR,
                text: "Module Loader failed to parse.",
                content: e.message
            }]
        };
    }

    let entry             = Files.resolve(module.filepath, Files.getDirectory(filepath));
    let { errors, route } = await getRouteStructure(entry, moduleLoader.context, filepath, segments, false);
    let typeErrors        = Tooling.typeCheck(filepath, "Module Loader");
    return { route, errors: [...typeErrors, ...errors] };
}


function getEndpointByDeclaration(module:ModuleStructure, filepath:string, segments:Segment[]):{ errors:Message[], route?:Route } {
    let exports  = Tooling.getExportedVariableNames(filepath).filter(o => VALID_EXPORTS.includes(o));
    let _methods = exports.filter(o => (Object.values(Method) as string[]).includes(o));
    let methods  =  _methods.map(o => Method[o as keyof typeof Method]);
    return {
        errors: [],
        route: {
            ".": {
                filepath: filepath,
                methods: methods,
                module: module,
                segments: segments
            }
        }
    }
}


function getSegment(id:string):Segment {
    let isDynamic = id.startsWith("[") && id.endsWith("]");
    let name      = isDynamic ? id.slice(1, -1) : id;
    return { name, isDynamic };
}


function hasRoutesDir(entry:string):Message[] {
    if (!fs.existsSync(getRoutesDirectory(entry))) {
        return [{
            level: Level.WARN,
            text: "No \"/routes\" directory found in root.",
            file: { filepath: entry }
        }];
    }
    return [];
}


function getRoutesDirectory(entry:string):string {
    return Files.join(entry, "routes");
}


// Who is it that overcomes the world? Only the one who believes that Jesus
// is the Son of God.
// - 1 John 5:5
