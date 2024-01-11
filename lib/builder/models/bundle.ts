import { BuildOptions } from "./options";
import { Endpoint, Module, Server } from "./structure"


export type BundleParamaters = {
    endpoint:Endpoint;
    module:Module;
    server:Server;
    options:BuildOptions
}

