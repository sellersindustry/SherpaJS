import { ConfigModule } from "../models";
import { Utility } from "../utilities";


const CONFIG_FILE_NAME  = "sherpa.module";
const CONFIG_FILE_TYPES = ["JS", "CJS", "TS"];


export async function GetConfigModule(path:string):Promise<{ instance:ConfigModule, path:string }> {
    let filepath = Utility.File.GetFileVaribleExtensions(
        path,
        CONFIG_FILE_NAME,
        CONFIG_FILE_TYPES
    );
    if (!filepath)
        Utility.Log.Error({
            message: "Module config file could not be found.",
            path: path
        });
    return {
        instance: await loadDefaultExport(filepath) as ConfigModule,
        path: filepath
    };
}


async function loadDefaultExport(file:string):Promise<any> {  
    try {
        return Utility.Loader.GetDefaultExport(file);
    } catch (e) {
        Utility.Log.Error({
            message: "Module Config failed to load.",
            content: "Ensure there is a default export.",
            path: file
        });
    }
}

