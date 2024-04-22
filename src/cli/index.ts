#!/usr/bin/env node
/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: N/A
 *
 */


import { Command, Option } from "commander";
import { Compiler, BundlerType } from  "../compiler/index.js";
import { getEnvironmentFiles, getAbsolutePath } from "./utilities.js";
let CLI = new Command();


CLI.name("sherpa")
    .description("Modular and agnostic serverless web framework, developed by Sellers Industries.")
    .version(process.env.npm_package_version as string);


CLI.command("build")
    .description("Build SherpaJS Server")
    .option("-i, --input <path>", "path to SherpaJS server, defaults to current directory")
    .option("-o, --output <path>", "path to server output, defaults to input directory")
    .option("--dev", "enable development mode, do not minify output")
    .addOption(new Option("-b, --bundler <type>", "platform bundler")
        .choices(Object.values(BundlerType))
        .default(BundlerType.local))
    .action((options) => {
        let input  = getAbsolutePath(options.input, process.cwd());
        let output = getAbsolutePath(options.output, input);

        Compiler.build({
            input: input,
            output: output,
            bundler: options.bundler,
            developer: {
                bundler: {
                    esbuild: {
                        minify: options.dev ? false : true
                    }
                },
                environment: {
                    files: getEnvironmentFiles(input)
                }
            }
        });
    });


CLI.command("clean")
    .description("Remove SherpaJS Build Directories")
    .option("-i, --input <path>", "path to SherpaJS build directories, defaults to current directory")
    .action((options) => {
        Compiler.clean(getAbsolutePath(options.input, process.cwd()));
    });


CLI.parse();


// Live as free people, but do not use your freedom as a cover-up for evil;
// live as God’s slaves.
// - 1 Peter 2:16
