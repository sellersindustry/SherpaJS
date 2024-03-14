import fs from "fs";
import path from "path";
import { Level, Message } from "../../logger/model.js";
import { Context, Method, ModuleLoader, ModuleStructure, Route, Segment, VALID_EXPORTS } from "../../models/index.js";
import { getModuleStructure } from "../config-module/index.js";
import { getDirectoryStructure } from "../directory-structure/index.js";
import { lint } from "../linter/index.js";
import { Tooling } from "../../tooling/index.js";
import { DirectoryStructureTree as DirStructTree } from "../directory-structure/model.js";


export async function getRouteStructure(entry:string, context:Context|undefined, segments:Segment[]=[], isRoot:boolean=true):Promise<{ errors:Message[], route?:Route }> {
    let errors:Message[] = [];

    let { module, errors: errorsModule } = await getModule(entry, context, isRoot);
    errors.push(...errorsModule);
    if (!module) {
        return { errors };
    }

    let errorsHasRoutesDir = hasRoutesDir(entry);
    if (errorsHasRoutesDir.length > 0) {
        errors.push(...errorsHasRoutesDir);
        return { errors };
    }

    let filepath        = getRoutesDir(entry);
    let fileStructure   = getDirectoryStructure(filepath);
    let errorsStructure = await lint(fileStructure, filepath);
    errors.push(...errorsStructure);

    let { route, errors: errorsRoutes } = await getRoute(module, filepath, segments, fileStructure.tree);
    errors.push(...errorsRoutes);
    return { errors, route };
}


async function getModule(entry:string, context:Context|undefined, isRoot:boolean):Promise<{ errors:Message[], module?:ModuleStructure }> {
    if (isRoot) {
        return getModuleByRoot(entry, context);
    }
    return await getModuleByConfig(entry, context);
}


function getModuleByRoot(entry:string, context:Context|undefined):{ errors:Message[], module?:ModuleStructure } {
    return {
        errors: [],
        module: {
            filepath: getRoutesDir(entry),
            context: context,
            config: {
                name: "."
            },
            hasContextSchema: false
        }
    }
}


async function getModuleByConfig(entry:string, context:Context|undefined):Promise<{ errors:Message[], module?:ModuleStructure }> {
    let { module, errors } = await getModuleStructure(entry, context);
    if (!module) {
        return { errors };
    }
    return {
        errors: [],
        module
    }
}


async function getRoute(module:ModuleStructure, filepath:string, segments:Segment[], structure:DirStructTree):Promise<{ errors:Message[], route?:Route }> {
    let route:Route      = {};
    let errors:Message[] = [];
    if (structure.files.length > 0) {
        let { route: _route, errors: errorsRoute } = await getEndpoint(module, structure.files[0].filepath, segments);
        errors.push(...errorsRoute);
        if (_route) {
            route = { ...route, _route };
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
        let { route: _route, errors: errorsRoute } = await getRoute(
            module,
            path.join(filepath, segmentName),
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


async function getEndpoint(module:ModuleStructure, filepath:string, segments:Segment[]):Promise<{ errors:Message[], route?:Route }> {
    console.log(filepath);
    if (Tooling.hasDefaultExport(filepath)) {
        return await getEndpointByModule(filepath, segments);
    }
    return getEndpointByMethod(module, filepath, segments);
}


async function getEndpointByModule(filepath:string, segments:Segment[]):Promise<{ errors:Message[], route?:Route }> {
    try {
        let moduleLoader = await Tooling.getDefaultExport(filepath) as ModuleLoader;
        let entry        = Tooling.resolve(moduleLoader.entry, filepath);
        if (!entry) {
            return {
                errors: [{
                    level: Level.ERROR,
                    text: "Preflight Cross-Check has failed.",
                    content: "Entry for module loader is not defined."
                }]
            }
        }
        return await getRouteStructure(entry, moduleLoader.context, segments, false);
    } catch {
        return {
            errors: [{
                level: Level.ERROR,
                text: "Preflight Cross-Check has failed.",
                content: "Module loader file has failed to compile."
            }]
        };
    }
}


function getEndpointByMethod(module:ModuleStructure, filepath:string, segments:Segment[]):{ errors:Message[], route?:Route } {
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
    if (!fs.existsSync(getRoutesDir(entry))) {
        return [{
            level: Level.WARN,
            text: "No \"/routes\" directory found in root.",
            file: { filepath: entry }
        }];
    }
    return [];
}


function getRoutesDir(entry:string):string {
    return path.join(entry, "routes");
}

