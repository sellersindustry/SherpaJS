import fs from "fs";
import path from "path";
import { Level, Message } from "../../logger/model";
import { Context, Endpoint, ModuleStructure, Route, Segment } from "../../models";
import { getModuleStructure } from "../config-module";
import { FileStructure, TreeFileStructure, fileStructure } from "./walk";
import { lintStructure } from "./lint-structure";


export async function getRoutes(entry:string, context:Context|undefined, isRootModule:boolean=true):Promise<{ errors:Message[], route?:Route }> {
    let errors:Message[] = [];

    let { module, errors: errorsModule } = await getModule(entry, context, isRootModule);
    if (!module) {
        errors.push(...errorsModule);
        return { errors };
    }

    let errorsHasRoutesDir = hasRoutesDir(entry);
    if (errorsHasRoutesDir.length > 0) {
        errors.push(...errorsHasRoutesDir);
        return { errors };
    }

    let filepath        = getRoutesDir(entry);
    let structure       = fileStructure(filepath);
    let errorsStructure = lintStructure(structure, filepath);
    errors.push(...errorsStructure);

    let { route, errors: errorsRoutes } = await getRouteByStructure(structure.tree, module, filepath, []);
    errors.push(...errorsRoutes);
    return { errors, route };
}


async function getModule(entry:string, context:Context|undefined, isRootModule:boolean):Promise<{ errors:Message[], module?:ModuleStructure }> {
    if (isRootModule) {
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
    } else {
        let { module, errors } = await getModuleStructure(entry, context);
        if (!module) {
            return { errors };
        }
        return {
            errors: [],
            module
        }
    }
}


async function getRouteByStructure(structure:TreeFileStructure, module:ModuleStructure, filepath:string, segments:Segment[]):Promise<{ errors:Message[], route?:Route }> {
    let route:Route = {};
    if (structure.files.length > 0) {
        //! FIXME What is this calls to another module????
        //! Check to see if it has a default export
        route["."] = {
            filepath: path.join(filepath, structure.files[0]),
            methods: [], //! FIXME add methods
            module: module,
            segments: segments
        }
        //! FIXME What is this calls to another module????
    }
    //! FIXME Ensure there is no overlap
    for (let dirName in Object.keys(structure.directories)) {
        let _routes = (await getRouteByStructure(
            structure.directories[dirName],
            module,
            path.join(filepath, dirName),
            [...segments, getSegment(dirName)]
        )).route;
        if (_routes) {
            route[dirName] = _routes;
        }
    }
    return { errors: [], route };
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

