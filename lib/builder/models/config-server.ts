import { Schema } from "ajv";


export type ConfigServerApp = {
    module:string;
    properties?:any;
} | { [key:`/${string}`]:ConfigServerApp };


export type ConfigServer = {
    version:1;    
    app:ConfigServerApp;
}


export const CONFIG_SERVER_SCHEMA:Schema = {
    type: "object",
    properties: {
        version: {
            type: "integer",
            minimum: 1,
            maximum: 1
        },
        app: {
            type: "object"
        }
    },
    required: ["version", "app"],
    additionalProperties: false
};

