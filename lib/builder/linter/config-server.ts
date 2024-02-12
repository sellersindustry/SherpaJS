/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: config-server.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Server Config Linter
 *
 */


import Ajv from "ajv";
import { CONFIG_SERVER_SCHEMA, ConfigServer, ConfigAppProperties } from "../models";
import { Validate } from "./validator";
import { Log, LogLevel } from "../logger";
import { SourceCode } from "../sourcecode";
import fs from "fs";
import path from "path";


export function Linter(config:ConfigServer, path:string):Log[] {
    return new ConfigServerLinter(config, path).GetMessages();
}


class ConfigServerLinter {

    private config: ConfigServer;
    private filepath: string;


    constructor(config:ConfigServer, filepath:string) {
        this.config   = config;
        this.filepath = filepath;
    }


    GetMessages():Log[] {
        return [
            ...this.validateBySchema(),
            ...this.validateByStructure(),
        ];
    }


    private validateBySchema():Log[] {
        let validator = (new Ajv()).compile(CONFIG_SERVER_SCHEMA);
        if (!validator(this.config)) {
            return validator.errors.map((error) => {
                return {
                    level: LogLevel.ERROR,
                    message: "Server Config Error: " + error.message,
                    path: this.filepath + " - ",
                    propertyRoute: error.instancePath.split(".").slice(1)
                };
            });
        }
        return [];
    }


    private validateByStructure():Log[] {
        if (this.config.app == undefined) return [];
        if (this.config.app["/sherpa"]) {
            return [{
                level: LogLevel.ERROR,
                message: `Server Config Error: App route "/sherpa" is not allowed.`,
                path: this.filepath,
                propertyRoute: ["app"]
            }];
        }
        return this._validateApp(this.config.app, []);
    }


    private _validateApp(app:ConfigAppProperties, subroute:string[]):Log[] {
        let keys = Object.keys(app);
        if (!keys.includes("module"))
            return this._validateAppSubroute(app, subroute);
        return this._validateAppModule(app, subroute);
    }
    

    private _validateAppSubroute(app:ConfigAppProperties, subroute:string[]):Log[] {
        let keys     = Object.keys(app);
        let messages = [];
        keys.map((key) => {
            if (!key.startsWith("/")) {
                messages.push({
                    level: LogLevel.ERROR,
                    message: `Server Config Error: App routes must begin with "/".`,
                    path: this.filepath,
                    propertyRoute: ["app", ...subroute]
                });
            }
            if (!Validate.AlphaNumericDash(key.replace("/", ""))) {
                messages.push({
                    level: LogLevel.ERROR,
                    message: `Server Config Error: App routes should only contain `
                        + `letters, numbers, and `
                        + `dashes. The following route is invalid: "${key}".`,
                    path: this.filepath,
                    propertyRoute: ["app", ...subroute]
                });
            }
            if (key.toLowerCase() != key) {
                messages.push({
                    level: LogLevel.ERROR,
                    message: `Server Config Error: App routes should be `
                        + `lowercase "${key}".`,
                    path: this.filepath,
                    propertyRoute: ["app", ...subroute]
                });
            }
        })
        return [...messages, ...keys.map(key => this._validateApp(app[key], [...subroute, key])).flat()];
    }


    private _validateAppModule(app:ConfigAppProperties, subroute:string[]):Log[] {
        let keys     = Object.keys(app);
        let messages = [];
        for (let key of keys) {
            if (!["module", "filepath", "properties"].includes(key)) {
                messages.push({
                    level: LogLevel.ERROR,
                    message: `Server Config Error: App routes should only contain `
                        + `"module" and "properties".`,
                    path: this.filepath,
                    propertyRoute: ["app", ...subroute]
                });
            }
        }

        let moduleConfigPath = path.join(app["filepath"], "sherpa.module.ts");
        if (hasPropertiesType(moduleConfigPath) && app["properties"] == undefined) {
            messages.push({
                level: LogLevel.ERROR,
                message: `Server Config Error: App routes is missing properties attributes.`,
                path: this.filepath,
                propertyRoute: ["app", ...subroute]
            });
        }
        return [
            ...messages,
            ...this.validateAppModuleTypes(app, subroute)
        ];
    }


    private validateAppModuleTypes(app:ConfigAppProperties, subroute:string[]):Log[] {
        let moduleConfigPath = path.join(app["filepath"], "sherpa.module.ts");
        if (!hasPropertiesType(moduleConfigPath)) {
            return [];
        }

        let code        = this.getCode(app, moduleConfigPath);
        let lineOffset  = code.split("\n").indexOf("// LINE ZERO") + 1;
        let diagnostics = SourceCode.TypeScriptValidation(code);

        return diagnostics.map(diagnostic => {
            let message = diagnostic.messageText.toString();
            let line    = this.getLineNumber(code, diagnostic.start, lineOffset);
            if (diagnostic.relatedInformation && diagnostic.relatedInformation.length > 0) {
                let context = diagnostic.relatedInformation[0].messageText;
                message += " " + context.toString();
            }
            message = message.replaceAll(
                "'SHERPA_PROPERTIES'",
                "properties of module '" + app["module"] + "'"
            );
            return {
                level: LogLevel.ERROR,
                message: `Server Config Error: Type Error - ${message}`,
                path: this.filepath,
                lineNumber: line,
                propertyRoute: ["app", ...subroute]
            };
        });
    }


    private getCode(app:ConfigAppProperties, moduleConfigPath:string) {
        return this.getCodeType(app, moduleConfigPath)
            + "\n// LINE ZERO\n"
            + this.getCodeConfig();
    }
    
    
    private getCodeConfig() {
        let buffer = fs.readFileSync(this.filepath, "utf8");
        if (buffer.match(/export\s+default\s+NewServer\s?\(/)) {
            buffer = buffer.replace(/export\s+default\s+NewServer\s?\(/, "let SHERPA_CONFIG:ConfigServer = _NewServer(");
        } else if (buffer.match(/export\s+const/)) {
            buffer = buffer.replace(/export\s+const/, "let SHERPA_CONFIG:ConfigServer = ");
        }
        return buffer + "\nconsole.log(SHERPA_CONFIG);";
    }
    
    
    private getCodeType(app:ConfigAppProperties, moduleConfigPath:string):string {
        if (!app["module"]) return "";
        let otherModules = getAllModules(app).filter(m => m != app["module"]);
        let buffer = [
            `import { SHERPA_PROPERTIES as MODULE_PROPERTIES } from "${moduleConfigPath.replaceAll("\\", "/").replace(".ts", "")}";`,
            `type ConfigAppProperties = { module: "${otherModules.join("\" | \"")}"; properties?:unknown; }`,
            `\t| { module: "${app["module"]}"; properties?:MODULE_PROPERTIES; }`,
            `\t| { [key:\`/\${string}\`]:ConfigAppProperties }`,
            `type ConfigServer = { version:number; app:ConfigAppProperties; }`,
            `const _NewServer = (config:ConfigServer):ConfigServer => { return config; };`
        ];
        return buffer.join("\n");
    }


    private getLineNumber(buffer:string, position:number, offset:number = 0):number {
        let lines      = buffer.split("\n");
        let currentPos = 0;
        for (let i = 0; i < lines.length; i++) {
            currentPos += lines[i].length + 1;
            if (currentPos >= position) {
                return i + 1 - offset;
            }
        }
        return -1;
    }
    

}


function getAllModules(app:ConfigAppProperties):string[] {
    if (app["module"]) {
        return [app["module"]];
    }
    return Object.keys(app).map(key => getAllModules(app[key])).flat();
}


function hasPropertiesType(filepath:string):boolean {
    if (!fs.existsSync(filepath)) return false;
    return SourceCode.GetExportedVariableNames(filepath).includes("SHERPA_PROPERTIES");
}


// Paul said, "John's baptism was a baptism of repentance. He told the people
// to believe in the one coming after him, that is, in Jesus."
// - Acts 19:4
