import Ajv from "ajv";
import { CONFIG_SERVER_SCHEMA, ConfigServer, ConfigServerApp, Level, Message } from "../models";
import { Utility } from "../utilities";


export function Linter(config:ConfigServer, path:string):Message[] {
    return [...schema(config, path), ...app(config, path)];
}


function schema(config:ConfigServer, path:string):Message[] {
    let validator = (new Ajv()).compile(CONFIG_SERVER_SCHEMA);
    if (!validator(config)) {
        return validator.errors.map((error) => {
            return {
                level: Level.ERROR,
                message: "Server Config Error: " + error.message,
                path: path + " - " + error.instancePath
            };
        });
    }
    return [];
}


function app(config:ConfigServer, path:string):Message[] {
    if (config.app == undefined) return [];
    if (config.app["/sherpa"]) {
        return [{
            level: Level.ERROR,
            message: `Server Config Error: App route "/sherpa" is not allowed.`,
            path: path
        }];
    }
    return validateApp(config.app, path);
}


function validateApp(app:ConfigServerApp, path:string):Message[] {
    let keys = Object.keys(app);
    if (keys.includes("module"))
        return validateAppModule(app, path);
    return validateAppList(app, path);
}


function validateAppModule(app:ConfigServerApp, path:string):Message[] {
    let keys = Object.keys(app);
    for (let key of keys) {
        if (!["module", "properties"].includes(key)) {
            return [{
                level: Level.ERROR,
                message: `Server Config Error: App routes should only contain `
                    + `\"module\" and \"properties\".`,
                path: path
            }];
        }
    }
    return [];
}


function validateAppList(app:ConfigServerApp, path:string):Message[] {
    let keys     = Object.keys(app);
    let messages = [];
    keys.map((key) => {
        if (!key.startsWith("/")) {
            messages.push({
                level: Level.ERROR,
                message: `Server Config Error: App routes must begin with "/".`,
                path: path + " - " + key
            });
        }
        key = key.replace("/", "");
        if (!Utility.Validate.AlphaNumericDash(key)) {
            messages.push({
                level: Level.ERROR,
                message: `Server Config Error: App routes should only contain `
                    + `letters, numbers, and `
                    + `dashes. The following route is invalid: \"${key}\".`,
                path: path + " - " + key
            });
        }
        if (key.toLowerCase() != key) {
            messages.push({
                level: Level.ERROR,
                message: `Server Config Error: App routes should be `
                    + `lowercase "${key}".`,
                path: path + " - " + key
            });
        }
    })
    return [...messages, ...keys.map(key => validateApp(app[key], path)).flat()];
}
