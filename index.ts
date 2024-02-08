import { ConfigModule, ConfigServer, BundlerType } from "./lib/builder/models";
import { SherpaSDK } from "./lib/sdk/index";
import { SherpaRequest } from "./lib/sdk/request";

const NewModule = (config:ConfigModule) => config
const NewServer = (config:ConfigServer) => config

export {
    SherpaSDK,
    BundlerType as Bundler,
    NewModule,
    NewServer
};

export type {
    SherpaRequest as Request,
    ConfigModule as Module,
    ConfigServer as Server
};
