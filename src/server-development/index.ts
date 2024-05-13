/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon May 13 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Local Development Server
 *
 */


import fs from "fs";
import chokidar from "chokidar";
import { BuildOptions, Compiler } from "../compiler/index.js";
import { Path } from "../compiler/utilities/path/index.js";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { Logger } from "../compiler/utilities/logger/index.js";
import { cyan, green, red } from "colorette";


export class ServerDevelopment {


    private readonly options:BuildOptions;
    private readonly port:number|undefined;
    private server:ChildProcessWithoutNullStreams;
    private initial:boolean;

    
    constructor (options:BuildOptions, port?:number) {
        this.options = options;
        this.port    = port;
        this.initial = true;
        this.makeTempDir();
        this.start();
    }


    private start() {
        this.refresh();
        chokidar.watch(this.options.input, {
            persistent: true,
            ignored: /(^|[\/\\])\../, // note: . files are ignored
        }).on("change", (path, stats) => {
            if (path && stats) {
                this.refresh();
            }
        });
    }


    private async refresh() {
        if (!this.initial) {
            console.log(cyan("SherpaJS detected change, rebuilding..."));
        }

        this.removeTempDir();
        this.makeTempDir();

        let { success, logs } = await Compiler.build({
            ...this.options,
            output: this.getTempDir()
        }, false);

        if (success) {
            this.copyFromTempDir();
            if (this.server) {
                this.server.kill();
            }
            this.server = spawn("node", [
                Path.join(this.options.output, "/.sherpa/index.js"),
                this.port ? this.port.toString() : "",
                !this.initial ? "--silent-startup" : ""
            ]);
            this.server.stdout.on("data", (data) => console.log(data.toString().replace("\n", "")));
            this.server.stderr.on("data", (data) => console.log(data.toString().replace("\n", "")));
            this.server.on("close", (data) => { if (data) console.log(data.toString().replace("\n", "") )});
            if (!this.initial) {
                console.log(green("SherpaJS Server Rebuilt Successfully."));
            } else {
                this.initial = false;
            }
        } else {
            this.removeTempDir();
            Logger.display(logs);
            console.log(red("SherpaJS Failed to Build Server.") + " See logs for more information.")
        }
    }


    private copyFromTempDir() {
        let filepath = Path.join(this.options.output, ".sherpa");
        if (fs.existsSync(filepath)) {
            fs.rmSync(filepath, { recursive: true });
        }
        this.copyDirectory(
            Path.join(this.getTempDir(), ".sherpa"),
            Path.join(this.options.output, ".sherpa")
        )
        this.removeTempDir();
    }


    private copyDirectory(source:string, destination:string) {
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
    
        fs.readdirSync(source).forEach(file => {
            let sourcePath = Path.join(source, file);
            let destPath = Path.join(destination, file);
    
            if (fs.statSync(sourcePath).isDirectory()) {
                this.copyDirectory(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
        });
    }


    private makeTempDir() {
        let filepath = this.getTempDir();
        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(filepath);
        }
    }


    private removeTempDir() {
        let filepath = this.getTempDir();
        if (fs.existsSync(filepath)) {
            fs.rmSync(filepath, { recursive: true });
        }
    }


    private getTempDir() {
        return Path.join(this.options.output, ".sherpa-dev");
    }


}


// Teach me your way, Lord, that I may rely on your faithfulness; give me an
// undivided heart, that I may fear your name.
// - Psalm 86:11
