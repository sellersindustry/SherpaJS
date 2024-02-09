import { ConfigModule, ConfigServer, BundlerType } from "./lib/builder/models";
import { Environment } from "./lib/environment/index";
import { SherpaRequest } from "./lib/environment/request";

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
