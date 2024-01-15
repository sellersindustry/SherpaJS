import Ajv from "ajv";
import { CONFIG_SERVER_SCHEMA, ConfigServer, ConfigServerApp, Level, Message } from "../models";
import { Utility } from "../utilities";


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
    return [];
}


function validateAppList(app:ConfigServerApp):Message[] {
    let keys     = Object.keys(app);
    let messages = [];
    keys.map((key) => {
        if (!key.startsWith("/")) {
            messages.push({
                level: Level.ERROR,
                message: `Server Config Error: App routes must begin with "/".`,
                path: key
            });
        }
        key = key.replace("/", "");
        if (!Utility.Validate.AlphaNumericDash(key)) {
            messages.push({
                level: Level.ERROR,
                message: `Server Config Error: App routes should only contain `
                    + `letters, numbers, and `
                    + `dashes. The following route is invalid: \"${key}\".`
            });
        }
        if (key.toLowerCase() != key) {
            messages.push({
                level: Level.ERROR,
                message: `Server Config Error: App routes should be `
                    + `lowercase "${key}".`,
            });
        }
    })
    return [...messages, ...keys.map(key => validateApp(app[key])).flat()];
}
