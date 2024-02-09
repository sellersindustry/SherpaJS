import { Project as TSMorphProject } from "ts-morph";
import { build, BuildOptions } from "esbuild";
import { TypeScriptValidation } from "./ts-validation";
import ts from "typescript";
import vm from "vm";


export const DEFAULT_ESBUILD_TARGET:Partial<BuildOptions> = {
    format: "cjs",
    target: "es2022",
    platform: "node",
    bundle: true,
    allowOverwrite: true,
    treeShaking: true,
    minify: true,
};


export class SourceCode {


    static GetExportedVariableNames(filepath:string):string[] {
        let project    = new TSMorphProject();
        let sourceFile = project.addSourceFileAtPath(filepath);
        return Array.from(sourceFile.getExportedDeclarations().keys());
    }


    static async GetDefaultExport(file:string):Promise<unknown> {
        let result = await build({
            ...DEFAULT_ESBUILD_TARGET,
            entryPoints: [file],
            write: false
        });

        let code    = result.outputFiles[0].text;
        let context = vm.createContext({ module: { exports: {} } });
        vm.runInContext(code, context);
        return context.module.exports.default;
    }


    static async Build(props:{ buffer:string, output:string, resolve?:string, options?:Partial<BuildOptions> }) {
        await build({
            ...DEFAULT_ESBUILD_TARGET,
            ...props.options,
            stdin: {
                contents: props.buffer,
                resolveDir: props.resolve,
                loader: "ts",
            },
            outfile: props.output,
        });
    }


    static TypeScriptValidation(buffer:string):readonly ts.Diagnostic[] {
        return TypeScriptValidation(buffer);
    }


}

