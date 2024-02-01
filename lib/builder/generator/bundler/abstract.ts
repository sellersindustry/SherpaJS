import { BuildOptions, Server } from "../../models";


export abstract class Bundler {
    protected server:Server;
    protected build :BuildOptions;

    constructor(server:Server, build:BuildOptions) {
        this.server = server;
        this.build  = build;
    }

    abstract Build(): Promise<void>;
    abstract Clean(): Promise<void>;
}

