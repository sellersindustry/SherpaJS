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


import fs from "fs";
import { spawn } from "child_process";
import { Command, Option } from "commander";
import { Compiler, BundlerType } from  "../compiler/index.js";
import { getEnvironmentFiles, getAbsolutePath, getKeyValuePairs, getVersion } from "./utilities.js";
import { Logger } from "../compiler/utilities/logger/index.js";
import { Path } from "../compiler/utilities/path/index.js";
import { Level } from "../compiler/utilities/logger/model.js";
let CLI = new Command();


CLI.name("sherpa")
    .description("Modular and agnostic serverless web framework, developed by Sellers Industries.")
    .version(getVersion());


CLI.command("build")
    .description("Build SherpaJS Server")
    .option("-i, --input <path>", "path to SherpaJS server, defaults to current directory")
    .option("-o, --output <path>", "path to server output, defaults to input directory")
    .option("--dev", "enable development mode, do not minify output")
    .option("-v, --variable [keyvalue...]", "Specify optional environment variables as key=value pairs")
    .addOption(new Option("-b, --bundler <type>", "platform bundler")
        .choices(Object.values(BundlerType))
        .default(BundlerType.local))
    .action((options) => {
        let input     = getAbsolutePath(options.input, process.cwd());
        let output    = getAbsolutePath(options.output, input);
        let variables = getKeyValuePairs(options.variable);

        if (Logger.hasError(variables.logs)) {
            Logger.display(variables.logs);
            Logger.exit();
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
                },
                environment: {
                    files: getEnvironmentFiles(input),
                    variables: variables.values
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


CLI.command("start")
    .description("Start SherpaJS Server Locally")
    .option("-i, --input <path>", "path to SherpaJS build directories, defaults to current directory")
    .option("-p, --port <number>", "port number", (3000).toString())
    .action((options) => {
        let directory = getAbsolutePath(options.input, process.cwd());
        let filepath  = Path.join(directory, "/.sherpa/index.js");

        if (!fs.existsSync(filepath)) {
            Logger.display({
                level: Level.ERROR,
                text: "SherpaJS build directory not found",
                file: { filepath }
            });
            Logger.exit();
        }

        let server = spawn("node", [filepath, options.port]);
        server.stdout.on("data", (data) => console.log(data.toString().replace("\n", "")));
        server.stderr.on("data", (data) => console.log(data.toString().replace("\n", "")));
        server.on("close", (data) => console.log(data.toString().replace("\n", "")));
    });


CLI.parse();


// Live as free people, but do not use your freedom as a cover-up for evil;
// live as God’s slaves.
// - 1 Peter 2:16
