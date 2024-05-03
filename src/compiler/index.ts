/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Compiler
 *
 */

import fs from "fs";
import { green, red } from "colorette";
import { getStructure } from "./structure/index.js";
import { Logger } from "./utilities/logger/index.js";
import { NewBundler, clean } from "./bundler/index.js";
import { BuildOptions, BundlerType } from "./models.js";
import { Level, Message } from "./utilities/logger/model.js";
import { Path } from "./utilities/path/index.js";


export { BundlerType };
export type { BuildOptions };


export class Compiler {


    public static async build(options:BuildOptions, verbose:boolean=true):Promise<{ success:boolean, logs:Message[] }> {
        let errorsOptions = this.validateBuildOptions(options);
        if (errorsOptions.length) {
            return this.display({ logs: errorsOptions, verbose, success: false });
        }

        let structure = await getStructure(options.input);
        let logs      = structure.logs;
        if (!structure.endpoints || !structure.server || !structure.assets) {
            logs.push({
                level: Level.ERROR,
                text: "Failed to generate endpoints."
            });
            return this.display({ logs, verbose, success: false });
        }
        if (Logger.hasError(logs)) {
            return this.display({ logs, verbose, success: false });
        }

        
        try {
            await NewBundler(structure, options, logs).build();
        } catch (error) {
            logs.push({
                level: Level.ERROR,
                text: "Failed to bundle SherpaJS Server",
                content: error.message
            });
            return this.display({ logs, verbose, success: false });
        }
        return this.display({ logs, verbose, success: true });
    }


    public static clean(filepath:string) {
        clean(filepath);
    }


    private static validateBuildOptions(options:BuildOptions):Message[] {
        let errors:Message[] = [];
        errors.push(...this.validateFilepath(options.input, "Input"));
        errors.push(...this.validateFilepath(options.output, "Output"));
        errors.push(...options.developer.environment.files.map(filepath => {
            return this.validateFilepath(filepath, "Environment File");
        }).flat());
        return errors;
    }


    private static validateFilepath(filepath:string, name:string):Message[] {
        if (!Path.isAbsolute(filepath)) {
            return [{
                level: Level.ERROR,
                text: `${name} path is not an absolute path.`,
                file: { filepath: filepath }
            }];
        }
        if (!fs.existsSync(filepath)) {
            return [{
                level: Level.ERROR,
                text: `${name} path does not exist.`,
                file: { filepath: filepath }
            }];
        }
        return [];
    }


    private static display(output:{ logs:Message[], success:boolean, verbose:boolean }):{ success:boolean, logs:Message[] } {
        if (output.verbose) {
            if (output.logs.length == 0) {
                console.log("No Build Logs.")
            } else {
                console.log("============ Build Logs ============")
                Logger.display(output.logs);
                console.log("");
            }
            if (output.success) {
                console.log(green("SherpaJS Successfully Built Server!"));
            } else {
                console.log(red("SherpaJS Failed to Build Server.") + " See logs for more information.")
            }
        }
        return { logs: output.logs, success: output.success };
    }


}


// I write these things to you who believe in the name of the Son of God so
// that you may know that you have eternal life.
// - 1 John 5:13
