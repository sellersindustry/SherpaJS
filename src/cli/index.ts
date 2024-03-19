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


import path from "path";
import { Command, Option } from "commander";
import { Compiler, BundlerType } from  "../compiler/index.js";
let CLI = new Command();


CLI.name("sherpa")
    .description("Module and Reusable Microservice Platform. Build and modularize custom API endpoints, inspired by NextJS APIs. Export to Vercel and ExpressJS.")
    .version(process.env.npm_package_version as string);


CLI.command("build")
    .description("Build SherpaJS Server")
    .option("-i, --input <path>", "path to SherpaJS server, defaults to current directory")
    .option("-o, --output <path>", "path to server output, defaults to input directory")
    .option("--dev", "enable development mode, do not minify output")
    .addOption(new Option("-b, --bundler <type>", "bundler to package server with")
        .choices(Object.values(BundlerType))
        .default(BundlerType.Local))
    .action((options) => {
        let input = options.input ? options.input : process.cwd();
        if (!path.isAbsolute(input)) {
            input = path.resolve(input);
        }

        let output = options.output ? options.output : input;
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


// Live as free people, but do not use your freedom as a cover-up for evil;
// live as God’s slaves.
// - 1 Peter 2:16
