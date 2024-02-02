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
    };

    
}

