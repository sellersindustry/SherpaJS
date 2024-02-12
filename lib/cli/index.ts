#!/usr/bin/env node
import fs from "fs";
import { createFromGit } from "create-from-git";
import { Command, Option } from "commander";
import { GetConfigServerFilepath } from "../builder/generator/config-server";
import { GetConfigModuleFilepath } from "../builder/generator/config-module";
import { Builder } from "../builder";
import { BundlerType } from "../builder/models/build";
import { NewBundler } from "../builder/generator/bundler";
import { LogLevel, Logger } from "../builder/logger";
let CLI = new Command();


CLI.name("sherpa")
    .description("Module and Reusable Microservice Platform. Build and modularize custom API endpoints, inspired by NextJS APIs. Export to Vercel and ExpressJS.")
    .version(process.env.npm_package_version);


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
            Logger.Format([{
                level: LogLevel.ERROR,
                message: `Input "${path}" is not a valid path.`
            }]);
            return;
        }
        if (!GetConfigServerFilepath(path)) {
            Logger.Format([{
                level: LogLevel.ERROR,
                message: `No SherpaJS Server config found in "${path}".`
            }]);
            return;
        }
        Builder.Build({
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
    .description("Build and start local SherpaJS Server")
    .option("-i, --input <path>", "path to server or module, defaults to current directory")
    .option("-p, --port <number>", "port number of server, defaults to 3000")
    .action(async (options) => {
        let path = options.input ? options.input : process.cwd();
        let port = options.port ? parseInt(options.port) : 3000;
        await Builder.Build({
            input: path,
            bundler: BundlerType.ExpressJS,
            output: process.cwd(),
            port: port
        });
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`${process.cwd()}/.sherpa/index.js`);
    });


CLI.command("init [template] [name]")
    .description("Initialize a new server or module with starter template")
    .argument("<template>", "template type, either \"server\" or \"module\"")
    .argument("<name>", "name of project")
    .option("-i, --input <path>", "path to server or module, defaults to current directory")
    .action(async (template, name, options) => {
        let path  = options.input ? options.input : process.cwd();
        let files = fs.readdirSync(path);

        if (template != "server" && template != "module") {
            Logger.Format([{
                level: LogLevel.ERROR,
                message: `Please specify template type either "server" or "module".`
            }]);
            return;
        }

        if (files.length > 1 || (files.length == 1 && files[0] !== ".git")) {
            Logger.Format([{
                level: LogLevel.ERROR,
                message: `Directory is not empty. Please initialize a new project in a new directory.`,
            }]);
            return;
        }

        try {
            let moduleURL = "git@github.com:sellersindustry/SherpaJS-template-module.git";
            let serverURL = "git@github.com:sellersindustry/SherpaJS-template-server.git";
            await createFromGit({
                from: template == "server" ? serverURL : moduleURL,
                to: path,
                projectName: name,
            })
        } catch (e) {
            Logger.Format([{
                level: LogLevel.ERROR,
                message: `Something went wrong. Unable to initialize project.`,
                content: e.message
            }]);
        }
    });


CLI.command("lint")
    .description("Lint a server or module")
    .option("-i, --input <path>", "path to server or module, defaults to current directory")
    .action((options) => {
        let path = options.input ? options.input : process.cwd();
        if (!fs.existsSync(path)) {
            Logger.Format([{
                level: LogLevel.ERROR,
                message: `Input "${path}" is not a valid path.`
            }]);
            return;
        }
        let server = GetConfigServerFilepath(path);
        let module = GetConfigModuleFilepath(path);
        if (!server && !module) {
            Logger.Format([{
                level: LogLevel.ERROR,
                message: `No SherpaJS Server or Module config found in "${path}".`
            }]);
            return;
        }
        if (server) {
            Builder.LintServer(path);
        } else {
            Builder.LintModule(path);
        }
    });


CLI.parse();

