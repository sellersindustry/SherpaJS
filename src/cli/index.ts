#!/usr/bin/env node
import path from "path";
import { BundlerType, Compiler } from "../../index.js"
import { Command, Option } from "commander";
let CLI = new Command();


CLI.name("sherpa")
    .description("Module and Reusable Microservice Platform. Build and modularize custom API endpoints, inspired by NextJS APIs. Export to Vercel and ExpressJS.")
    .version(process.env.npm_package_version as string);


CLI.command("build")
    .description("Build SherpaJS Server")
    .option("-i, --input <path>", "path to SherpaJS server, defaults to current directory")
    .option("-o, --output <path>", "path to server output, defaults to current directory")
    .option("--dev", "enable development mode, do not minify output")
    .addOption(new Option("-b, --bundler <type>", "bundler to package server with")
        .choices(Object.values(BundlerType))
        .default(BundlerType.Local))
    .action((options) => {
        let input = options.input ? options.input : process.cwd();
        if (!path.isAbsolute(input)) {
            input = path.resolve(input);
        }

        let output = options.output ? options.output : process.cwd();
        if (!path.isAbsolute(output)) {
            output = path.resolve(output);
        }

        Compiler.build({
            input: input,
            output: output,
            bundler: options.bundler,
            developer: {
                bundler: {
                    esbuild: {
                        minify: options.dev ? false : true
                    }
                }
            }
        });
    });


CLI.parse();

