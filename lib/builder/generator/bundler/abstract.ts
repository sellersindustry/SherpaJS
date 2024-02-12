/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: abstract.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Abstract Bundle Generator
 *
 */


import { Logger } from "../../logger";
import { BuildOptions, Server } from "../../models";
import { remove } from "fs-extra";


export abstract class Bundler {

    protected server:Server;
    protected build :BuildOptions;

    
    constructor(server:Server, build:BuildOptions) {
        this.server = server;
        this.build  = build;
    }


    abstract GetPath(): string;
    abstract Build(): Promise<void>;


    async Clean() {
        try {
            await remove(this.GetPath());
        } catch (error) {
            Logger.RaiseError({
                message: "Failed to clean build directory.",
                path: this.GetPath()
            });
        }
    }

    
}


// I rejoice in following your statutes as one rejoices in great riches.
// - Psalm 119:14
