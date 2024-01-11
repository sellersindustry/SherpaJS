import Ajv from "ajv";
import { CONFIG_MODULE_SCHEMA, ConfigModule, Level, Message } from "../models";


export function Linter(config:ConfigModule):Message[] {
    return schema(config);
}


function schema(config:ConfigModule):Message[] {
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

