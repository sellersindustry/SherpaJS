import fs from "fs";
import { Level, Message } from "../../utilities/logger/model.js";
import { Context, Method, LoadModule, ModuleStructure, Route, Segment, VALID_EXPORTS } from "../../models.js";
import { getModuleStructure } from "../config-module/index.js";
import { getDirectoryStructure } from "../directory-structure/index.js";
import { lint } from "../linter/index.js";
import { Tooling } from "../../utilities/tooling/index.js";
import { DirectoryStructureTree as DirStructTree } from "../directory-structure/model.js";
import { Files } from "../../utilities/files/index.js";


export async function getRouteStructure(entry:string, context:Context|undefined, contextFilepath:string, segments:Segment[]=[], isRoot:boolean=true):Promise<{ errors:Message[], route?:Route }> {
    let errors:Message[] = [];

    let { module, errors: errorsModule } = await getModule(entry, context, contextFilepath, isRoot);
    errors.push(...errorsModule);
    if (!module) {
        return { errors };
    }

    let errorsHasRoutesDir = hasRoutesDir(entry);
    if (errorsHasRoutesDir.length > 0) {
        errors.push(...errorsHasRoutesDir);
        return { errors };
    }

    let filepath        = getRoutesDirectory(entry);
    let fileStructure   = getDirectoryStructure(filepath);
    let errorsStructure = await lint(fileStructure, filepath);
    errors.push(...errorsStructure);

    let { route, errors: errorsRoutes } = await getRoute(module, filepath, segments, fileStructure.tree);
    errors.push(...errorsRoutes);
    return { errors, route };
}


async function getModule(entry:string, context:Context|undefined, contextFilepath:string, isRoot:boolean):Promise<{ errors:Message[], module?:ModuleStructure }> {
    if (isRoot) {
        return getModuleByRoot(entry, context, contextFilepath);
    }
    return await getModuleByConfig(entry, context, contextFilepath);
}


function getModuleByRoot(entry:string, context:Context|undefined, contextFilepath:string):{ errors:Message[], module?:ModuleStructure } {
    return {
        errors: [],
        module: {
            filepath: entry,
            context: context,
            contextFilepath: contextFilepath,
            config: {
                name: "."
            },
            hasContextSchema: false
        }
    }
}


async function getModuleByConfig(entry:string, context:Context|undefined, contextFilepath:string):Promise<{ errors:Message[], module?:ModuleStructure }> {
    let { module, errors } = await getModuleStructure(entry, context, contextFilepath);
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
        let { route: _route, errors: errorsRoute } = await getRouteFile(module, structure.files[0].filepath, segments);
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
        let { route: _route, errors: errorsRoute } = await getRoute(
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


async function getRouteFile(module:ModuleStructure, filepath:string, segments:Segment[]):Promise<{ errors:Message[], route?:Route }> {
    if (Tooling.hasDefaultExport(filepath)) {
        return await getRouteFileByModule(filepath, segments);
    }
    return getRouteFileByMethods(module, filepath, segments);
}


async function getRouteFileByModule(filepath:string, segments:Segment[]):Promise<{ errors:Message[], route?:Route }> {
    try {
        let moduleLoader = await Tooling.getDefaultExport(filepath) as LoadModule;
        let entry        = Tooling.resolve(moduleLoader.entry, Files.getDirectory(filepath));
        if (!entry) {
            return {
                errors: [{
                    level: Level.ERROR,
                    text: "Preflight Cross-Check has failed.",
                    content: "Entry for module loader is not defined."
                }]
            }
        }
        return await getRouteStructure(entry, moduleLoader.context, filepath, segments, false);
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


function getRouteFileByMethods(module:ModuleStructure, filepath:string, segments:Segment[]):{ errors:Message[], route?:Route } {
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

