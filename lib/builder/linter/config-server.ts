import Ajv from "ajv";
import { CONFIG_SERVER_SCHEMA, ConfigServer, ConfigServerApp, Level, Message } from "../models";


export function Linter(config:ConfigServer):Message[] {
    return [...schema(config), ...app(config)];
}


function schema(config:ConfigServer):Message[] {
    let validator = (new Ajv()).compile(CONFIG_SERVER_SCHEMA);
    if (!validator(config)) {
        return validator.errors.map((error) => {
            return {
                level: Level.ERROR,
                message: "Server Config Error: " + error.message,
                path: error.instancePath
            };
        });
    }
    return [];
}


function app(config:ConfigServer):Message[] {
    if (config.app == undefined) return [];
    return validateApp(config.app);
}


function validateApp(app:ConfigServerApp):Message[] {
    let keys = Object.keys(app);
    if (keys.includes("module"))
        return validateAppModule(app);
    return validateAppList(app);
}


function validateAppModule(app:ConfigServerApp):Message[] {
    let keys = Object.keys(app);
    //! validate module path exists
    //! ensure no extra keys
    return [];
}


function validateAppList(app:ConfigServerApp):Message[] {
    let keys = Object.keys(app);
    //! validate each key starts with slash and is validate name
    //! ensure no duplicates
    return keys.map(key => validateApp(app[key])).flat();
}
