/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Source Code Utilities
 *
 */


import vm from "vm";
import path from "path";
import { BuildOptions } from "../../models.js";
import { Project as TSMorphProject } from "ts-morph";
import { build, BuildOptions as ESBuildOptions } from "esbuild";
import { TypeValidation } from "./ts-validation.js";
import { Message } from "../logger/model.js";
import { getEnvironmentVariables } from "./dot-env/index.js";
import { ExportLoaderModule, getExportedLoader } from "./exported-loader/index.js";


export type { ExportLoaderModule };
export const DEFAULT_ESBUILD_TARGET:Partial<ESBuildOptions> = {
    format: "cjs",
    target: "es2022",
    platform: "node",
    bundle: true,
    allowOverwrite: true,
    treeShaking: true,
    minify: true,
    footer: {
        js: "// Generated by SherpaJS"
    }
};


export class Tooling {


    static getExportedVariableNames(filepath:string):string[] {
        let project    = new TSMorphProject();
        let sourceFile = project.addSourceFileAtPath(filepath);
        return Array.from(sourceFile.getExportedDeclarations().keys());
    }


    static async getExportedLoader(filepath:string, fileTypeName:string, prototype?:string, source?:string):Promise<{ logs:Message[], module?:ExportLoaderModule }> {
        return await getExportedLoader(filepath, fileTypeName, prototype, source);
    }


    static async hasExportedLoader(filepath:string):Promise<boolean> {
        return (await this.getExportedLoader(filepath, "N/A")).module != undefined;
    }


    static async getDefaultExport(filepath:string):Promise<unknown> {
        let result = await build({
            ...DEFAULT_ESBUILD_TARGET,
            entryPoints: [filepath],
            write: false
        });

        let code    = result.outputFiles[0].text;
        let context = vm.createContext({ process, module: { exports: {} }});
        vm.runInContext(code, context);
        return context.module.exports.default;
    }


    static async build(props:{ buffer:string, output:string, resolve?:string, options?:BuildOptions, esbuild?:Partial<ESBuildOptions> }) {
        await build({
            ...DEFAULT_ESBUILD_TARGET,
            ...props.options?.developer?.bundler?.esbuild,
            ...props.esbuild,
            stdin: {
                contents: props.buffer,
                resolveDir: path.resolve(props.resolve),
                loader: "ts",
            },
            outfile: path.resolve(props.output),
            define: {
                "global": "window",
                "process.env": JSON.stringify(getEnvironmentVariables(props.options))
            }
        });
    }


    static typeCheck(filepath:string, fileTypeName:string):Message[] {
        return new TypeValidation(filepath, fileTypeName).apply();
    }


}


// Whoever believes and is baptized will be saved, but whoever does not
// believe will be condemned.
// - Mark 16:16
