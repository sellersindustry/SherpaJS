import { ConfigModule, ConfigServer, BundlerType } from "./lib/builder/models/index.js";
import { Environment } from "./lib/environment/index.js";
import { SherpaRequest } from "./lib/environment/request.js";

const NewModule = (config:ConfigModule) => config;
const NewServer = (config:ConfigServer) => config;
const Response  = Environment.Response;

export {
    BundlerType as Bundler,
    Environment,
    Response,
    NewModule,
    NewServer
};

export type {
    SherpaRequest as Request,
    ConfigModule as Module,
    ConfigServer as Server
};


// For God so loved the world that he gave his one and only Son, that whoever
// believes in him shall not perish but have eternal life.
// - John 3:16
