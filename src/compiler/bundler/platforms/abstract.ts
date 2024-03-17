import { mkdir, remove, writeFile } from "fs-extra";
import { BuildOptions, Endpoint, Route } from "../../models.js";
import { Logger } from "../../utilities/logger/index.js";
import { Files } from "../../utilities/files/index.js";
import { Message } from "../../utilities/logger/model.js";


export abstract class Bundler {


    protected options:BuildOptions;
    protected route:Route;
    protected endpoints:Endpoint[];
    protected errors:Message[]|undefined;


    constructor(route:Route, endpoints:Endpoint[], options:BuildOptions, errors?:Message[]) {
        this.route     = route;
        this.endpoints = endpoints;
        this.options   = options;
        this.errors    = errors;
    }


    getFilepath():string {
        return Files.join(this.options.output, ".sherpa");
    }


    async build() {
        await this.clean();
        await this.makeBuildDirectory();
        await this.makeBuildManifest();
    }


    async clean() {
        try {
            if (Files.exists(this.getFilepath())) {
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


    private async makeBuildDirectory() {
        await mkdir(this.getFilepath());
    }


    private async makeBuildManifest() {
        let filepath = Files.join(this.getFilepath(), "sherpa.manifest.json");
        let data = {
            created: new Date().toISOString(),
            options: this.options,
            route: this.route,
            endpoints: this.endpoints,
            errors: this.errors
        };
        await writeFile(filepath, JSON.stringify(data, null, 4));
    }

    
}

