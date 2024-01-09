import { Endpoint, Route } from "../models";
import { Utility } from "../utilities";
import { Project as TSMorphProject } from "ts-morph";


export function GetEndpoints(path:string):Endpoint[] {
    if (!Utility.File.Exists(path))
        Utility.Log.Error({ message: `Endpoint path does not exist. Unable to generate endpoints.`, path: path });
    let endpoints = Utility.File.Walk(path).map(filepath => {
        filepath = Utility.File.JoinPath(path, filepath);
        return {
            filename: Utility.File.GetName(filepath),
            filetype: Utility.File.GetExtension(filepath),
            filepath: filepath,
            exports: getExportedVariables(filepath),
            route: getRoute(filepath, path)
        };
    }).filter(endpoint => !endpoint.filename.includes(".map"));
    return endpoints;
}


function getExportedVariables(filepath:string):string[] {
    try {
        let project    = new TSMorphProject();
        let sourceFile = project.addSourceFileAtPath(filepath);
        return Array.from(sourceFile.getExportedDeclarations().keys());
    } catch {
        Utility.Log.Error({ message: `Unable to extract exported variables.`, path: filepath });
    }
}


function getRoute(filepath:string, path:string):Route[] {
    return Utility.File.Relative(path, Utility.File.GetDirectory(filepath))
        .split("/")
        .filter(s => s != "")
        .map((name) => {
            return {
                name: getRouteName(name),
                isDynamic: isDynamic(name),
                orginal: name
            }
        });
}


function isDynamic(name:string):boolean {
    return name.startsWith("[") && name.endsWith("]");
}


function getRouteName(name:string):string {
    return (isDynamic(name) ? name.slice(1, -1) : name).toLowerCase()
}

