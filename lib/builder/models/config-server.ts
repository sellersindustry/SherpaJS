import { Schema } from "ajv";


export type ConfigAppProperties = {
    module:string;
    properties?:unknown;
} | { [key:`/${string}`]:ConfigAppProperties };


export type ConfigServer = {
    version:1;    
    app:ConfigAppProperties;
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

