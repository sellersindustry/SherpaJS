import { build } from "esbuild";
import vm from "vm";


export class Loader {


    static async GetDefaultExport(file:string):Promise<any> {  
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
    }


}

