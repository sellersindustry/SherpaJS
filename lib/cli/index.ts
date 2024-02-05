import fs from "fs";
import { Command, Option, program } from "commander";
import { GetVersion } from "./version";
import { GetConfigServerFilepath } from "../builder/generator/config-server";
import { GetConfigModuleFilepath } from "../builder/generator/config-module";
import { SherpaJS } from "../builder";
import { BundlerType } from "../builder/models/build";
import { NewBundler } from "../builder/generator/bundler";
let CLI = new Command();


CLI.name("SherpaJS")
    .description("CLI for SherpaJS - Modular Microservices Framework")
    .version(GetVersion());


CLI.command("build")
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


CLI.command("clean")
    .description("Remove build directories")
    .option("-i, --input <path>", "path to server or module, defaults to current directory")
    .action((options) => {
        let path = options.input ? options.input : process.cwd();
        Object.values(BundlerType).forEach((bundler) => {
            NewBundler(null, {
                bundler: bundler,
                input: path,
                output: path
            }).Clean();
        });
    });


CLI.command("start")
    .option("-i, --input <path>", "path to server or module, defaults to current directory")
    .option("-p, --port <number>", "port number of server, defaults to 3000")
    .action((options) => {
        let path = options.input ? options.input : process.cwd();
        let port = options.port ? parseInt(options.port) : 3000;
        SherpaJS.Build({
            input: path,
            bundler: BundlerType.ExpressJS,
            output: process.cwd(),
            port: port
        });
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`${process.cwd()}/.sherpa/index.js`);
    });


CLI.command("lint")
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


program.parse(process.argv);

