import fs from "fs";
import { Command, Option } from "commander";
import { Utility } from "../builder/utilities";
import { GetConfigServerFilepath } from "../builder/generator/config-server";
import { GetConfigModuleFilepath } from "../builder/generator/config-module";
import { SherpaJS } from "../builder";
import { BundlerType } from "../builder/models/options";
let program = new Command();


program
    .name("SherpaJS")
    .description("CLI for SherpaJS - Modular Microservices Framework")
    .version(Utility.File.GetVersion());


program.command("build")
    .description("Build SherpaJS Server")
    .option("-i, --input <path>", "path to server or module, defaults to current directory")
    .option("--dev", "enable development mode, do not minify output")
    .addOption(new Option("-b, --bundler <type>", "bundler to package server with")
        .choices(Object.values(BundlerType))
        .default(BundlerType.Vercel))
    .action((options) => {
        let path = options.input ? options.input : process.cwd();
        if (!fs.existsSync(path)) {
            console.log(`Input "${path}" is not a valid path.`);
            return;
        }
        if (!GetConfigServerFilepath(path)) {
            console.log(`No server found in "${path}"`);
            return;
        }
        console.log(options.dev)
        SherpaJS.Build({
            input: path,
            bundler: options.bundler,
            output: process.cwd(),
            developer: {
                bundler: {
                    esbuild: {
                        minify: options.dev ? false : true
                    }
                }
            }
        });
    });


//! FIXME
program.command("clean")
//! FIXME


//! FIXME
program.command("start")
//! FIXME


program.command("lint")
    .description("Lint a server or module")
    .option("-i, --input <path>", "path to server or module, defaults to current directory")
    .action((options) => {
        let path = options.input ? options.input : process.cwd();
        if (!fs.existsSync(path)) {
            console.log(`Input "${path}" is not a valid path.`);
            return;
        }
        let server = GetConfigServerFilepath(path);
        let module = GetConfigModuleFilepath(path);
        if (!server && !module) {
            console.log(`No server or module found in "${path}"`);
            return;
        }
        if (server) {
            SherpaJS.LintServer(path);
        } else {
            SherpaJS.LintModule(path);
        }
    });


program.parse();

