import { ConfigServer, ConfigAppProperties } from "../models";
import { Utility } from "../utilities";


const CONFIG_FILE_NAME  = "sherpa.server";
const CONFIG_FILE_TYPES = ["JS", "CJS", "TS"];


export async function GetConfigServer(path:string):Promise<{ instance:ConfigServer, path:string }> {
    let filepath = Utility.File.GetFileVaribleExtensions(
        path,
        CONFIG_FILE_NAME,
        CONFIG_FILE_TYPES
    );
    if (!filepath)
        Utility.Log.Error({
            message: "Server config file could not be found.",
            path: path
        });
    let config = await loadDefaultExport(filepath) as ConfigServer;
    return {
        instance: resolveModulePath(config, path),
        path: filepath
    };
}



async function loadDefaultExport(file:string):Promise<any> {  
    try {
        return Utility.Loader.GetDefaultExport(file);
    } catch (e) {
        Utility.Log.Error({
            message: "Server Config failed to load.",
            content: "Ensure there is a default export.",
            path: file
        });
    }
}


function resolveModulePath(config:ConfigServer, path:string):ConfigServer {
    if (!config.app) return config;
    return { ...config, app: _resolveModulePath(config.app, path) };
}


function _resolveModulePath(route:ConfigAppProperties, path:string):ConfigAppProperties {
    if (route["module"]) {
        let reg = Utility.File.JoinPath(path, route["module"]);
        let npm = Utility.File.JoinPath(path, "node_modules", route["module"]);
        if (Utility.File.Exists(reg)) {
            route["module"] = reg;
        } else if (npm) {
            route["module"] = npm;
        } else {
            Utility.Log.Error({
                message: `Module Server failed to load. Unable to find Sherpa `
                    + `module "${route["module"]}".`
            });
        }
    } else {
        let keys = Object.keys(route);
        for (let key of keys) {
            route[key] = _resolveModulePath(route[key], path);
        }
    }
    return route;
}

