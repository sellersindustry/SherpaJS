import { CONFIG_MODULE_SCHEMA, ConfigModule } from "./config-module";
import { CONFIG_SERVER_SCHEMA, ConfigServer, ConfigAppProperties } from "./config-server";
import { Module, Endpoint, Route, VALID_EXPORTS, Server } from "./structure";
import { BuildOptions } from "./build";


export {
    VALID_EXPORTS,
    CONFIG_MODULE_SCHEMA,
    CONFIG_SERVER_SCHEMA
};
export type {
    BuildOptions,
    Server,
    Module,
    ConfigModule,
    ConfigServer,
    ConfigAppProperties,
    Endpoint,
    Route,
};

