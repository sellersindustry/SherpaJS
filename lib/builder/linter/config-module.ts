import Ajv from "ajv";
import { ConfigModule, Level, Message } from "../models";
import { CONFIG_MODULE_SCHEMA } from "../models/config-module";


export function Linter(config:ConfigModule):Message[] {
    return schema(config);
}


export function schema(config:ConfigModule):Message[] {
    let validator = (new Ajv()).compile(CONFIG_MODULE_SCHEMA);
    if (!validator(config)) {
        return validator.errors.map((error) => {
            return {
                level: Level.ERROR,
                message: "Module Config Error: " + error.message,
                path: error.instancePath
            };
        });
    }
    return [];
}

