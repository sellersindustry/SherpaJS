/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu May 16 2024
 *   file: bench.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Endpoint Test Suite - Test Benches
 *
 */


import { Path } from "../../../src/compiler/utilities/path/index.js";
import { ChildProcess, spawn } from "child_process";


export class Bench {


    private name:string;
    private host:string;
    private setupCmds:string[];
    private teardownCmds:string[];
    private startCmd:string|undefined;
    private server:ChildProcess;


    constructor(name:string, host:string, start?:string, setup:string[]=[], teardown:string[]=[]) {
        this.name = name;
        this.host = host;
        this.setupCmds = setup;
        this.teardownCmds = teardown;
        this.startCmd = start;
    }


    public getName():string {
        return this.name;
    }


    public getHost():string {
        return this.host;
    }


    public async setup() {
        for (const command of this.setupCmds) {
            await this.execute(command);
        }
    }


    public async start() {
        if (this.startCmd) {
            let args    = this.getArguments(this.startCmd);
            this.server = spawn(args[0], args.slice(1), { cwd: this.getCWD() });
            await this.wait(1000);
        }
    }


    public async teardown() {
        if (this.server) {
            this.server.kill();
        }
        for (const command of this.teardownCmds) {
            await this.execute(command);
        }
    }


    private async execute(command:string):Promise<void> {
        return new Promise((resolve) => {
            let args    = this.getArguments(command);
            let process = spawn(args[0], args.slice(1), { cwd: this.getCWD(), shell: true });
        
            process.stderr.on("data", (data) => {
                throw new Error(`Failed to execute command "${command}" for "${this.name}" test bench.\n${args.join(" ")}\n${data}`);
            });
        
            process.on("close", (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    throw new Error(`Failed to execute command "${command}" for "${this.name}" test bench.\n${args.join(" ")}\ncode: ${code}`);
                }
            });
        });
    }


    private getCWD():string {
        return Path.join(Path.getDirectory(import.meta.url), "../../../../tests/endpoints/server");
    }


    private getArguments(command:string):string[] {
        return command.replace(/^%sherpa-cli%/, "node ../../../dist/src/cli/index.js").split(" ");
    }


    private async wait(ms:number):Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }


}


// If I give all I possess to the poor and give over my body to hardship that
// I may boast, but do not have love, I gain nothing.
// - 1 Corinthians 13:3
