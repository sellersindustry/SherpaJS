import { build } from "esbuild";
import { ConfigModuleModel } from "../models";
import { Utility } from "../utilities";
import vm from "vm";


const CONFIG_FILE_NAME  = "sherpa.module";
const CONFIG_FILE_TYPES = ["JS", "CJS", "TS"];


export async function GetConfigModule(path:string):Promise<{ config:ConfigModuleModel, path:string }> {
    let filepath = getFile(path);
    if (!filepath)
        Utility.Log.Error({
            message: `Module config file could not be found.`,
            path: path
        });
    return {
        config: await loadDefaultExport(filepath) as ConfigModuleModel,
        path: filepath
    };
}


function getFile(path:string):string|undefined {
    for (let type of CONFIG_FILE_TYPES) {
        let filename = CONFIG_FILE_NAME + "." + type.toLowerCase();
        let filepath = Utility.File.JoinPath(path, filename);
        if (Utility.File.Exists(filepath)) {
            return filepath;
        }
    }
    return undefined;
}


async function loadDefaultExport(file:string):Promise<any> {  
    try {
        let result = await build({
            entryPoints: [file],
            bundle: true,
            format: "cjs",
            target: "es2020",
            platform: 'node',
            write: false,
            metafile: true,
        });

        let code    = result.outputFiles[0].text;
        let context = vm.createContext({ module: { exports: {} }});
        vm.runInContext(code, context);
        return context.module.exports.default;
    } catch (e) {
        Utility.Log.Error({
            message: "Module Config failed to load.",
            content: "Ensure there is a default export.",
            path: file
        });
    }
}

