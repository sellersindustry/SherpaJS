import Ajv from "ajv";
import { CONFIG_MODULE_SCHEMA, ConfigModule, Level, Message } from "../models";


export function Linter(config:ConfigModule, path:string):Message[] {
    return schema(config, path);
}


function schema(config:ConfigModule, path:string):Message[] {
    let validator = (new Ajv()).compile(CONFIG_MODULE_SCHEMA);
    if (!validator(config)) {
        return validator.errors.map((error) => {
            return {
                level: Level.ERROR,
                message: "Module Config Error: " + error.message,
                path: path + " - " + error.instancePath
            };
        });
    }
    return [];
}

