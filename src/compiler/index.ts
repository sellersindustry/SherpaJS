import fs from "fs";
import path from "path";
import { green, red } from "colorette";
import { getStructure } from "./structure/index.js";
import { Logger } from "./utilities/logger/index.js";
import { NewBundler } from "./bundler/index.js";
import { BuildOptions, BundlerType } from "./models.js";
import { Level, Message } from "./utilities/logger/model.js";


export { BundlerType };
export type { BuildOptions };


export class Compiler {


    public static async build(options:BuildOptions, verbose:boolean=true):Promise<{ success:boolean, errors:Message[] }> {
        let errorsBuildOptions = this.validateBuildOptions(options);
        if (errorsBuildOptions.length) {
            return this.display({ errors: errorsBuildOptions, verbose, success: false });
        }

        let { errors, route, endpoints } = await getStructure(options.input);
        if (!endpoints || !route) {
            errors.push({
                level: Level.ERROR,
                text: "Failed to generate endpoints."
            });
            return this.display({ errors, verbose, success: false });
        }
        try {
            NewBundler(route,  endpoints, options, errors).build();
        } catch (error) {
            errors.push({
                level: Level.ERROR,
                text: "Failed to bundle SherpaJS Server",
                content: error.message
            });
            return this.display({ errors, verbose, success: false });
        }
        return this.display({ errors, verbose, success: true });
    }


    private static validateBuildOptions(options:BuildOptions):Message[] {
        let errors:Message[] = [];

        if (!path.isAbsolute(options.input)) {
            errors.push({
                level: Level.ERROR,
                text: "Input path is not an absolute path.",
                file: { filepath: options.input }
            });
        }
    
        if (!fs.existsSync(options.input)) {
            errors.push({
                level: Level.ERROR,
                text: "Input path does not exist.",
                file: { filepath: options.input }
            });
        }

        if (!path.isAbsolute(options.output)) {
            errors.push({
                level: Level.ERROR,
                text: "Output path is not an absolute path.",
                file: { filepath: options.output }
            });
        }
    
        if (!fs.existsSync(options.output)) {
            errors.push({
                level: Level.ERROR,
                text: "Output path does not exist.",
                file: { filepath: options.output }
            });
        }

        return errors;
    }


    private static display(output:{ errors:Message[], success:boolean, verbose:boolean }):{ success:boolean, errors:Message[] } {
        if (output.verbose) {
            if (output.errors.length == 0) {
                console.log("No Build Logs.")
            } else {
                console.log("============ Build Logs ============")
                Logger.display(output.errors);
                console.log("");
            }
            if (output.success) {
                console.log(green("SherpaJS Successfully Built Server!"));
            } else {
                console.log(red("SherpaJS Failed to Build Server.") + " See logs for more information.")
            }
        }
        return { errors: output.errors, success: output.success };
    }


}

