/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: abstract.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Abstract Bundler
 *
 */


import fs from "fs";
import { remove } from "fs-extra";
import { BuildOptions, EndpointStructure } from "../../models.js";
import { Logger } from "../../utilities/logger/index.js";
import { Path } from "../../utilities/path/index.js";
import { Message } from "../../utilities/logger/model.js";


export abstract class Bundler {


    protected options:BuildOptions;
    protected endpoints:EndpointStructure;
    protected errors:Message[]|undefined;


    constructor(endpoints:EndpointStructure, options:BuildOptions, errors?:Message[]) {
        this.endpoints = endpoints;
        this.options   = options;
        this.errors    = errors;
    }


    getFilepath():string {
        return Path.join(this.options.output, ".sherpa");
    }


    async build() {
        await this.clean();
        this.makeBuildDirectory();
        this.makeBuildManifest();
    }


    async clean() {
        try {
            if (fs.existsSync(this.getFilepath())) {
                await remove(this.getFilepath());
            }
        } catch (error) {
            Logger.raise({
                text: "Failed to clean build directory.",
                file: {
                    filepath: this.getFilepath()
                }
            });
        }
    }


    private makeBuildDirectory() {
        fs.mkdirSync(this.getFilepath());
    }


    private makeBuildManifest() {
        let filepath = Path.join(this.getFilepath(), "sherpa.manifest.json");
        let data = {
            created: new Date().toISOString(),
            options: this.options,
            endpoints: this.endpoints,
            errors: this.errors
        };
        fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
    }

    
}


// I rejoice in following your statutes as one rejoices in great riches.
// - Psalm 119:14
