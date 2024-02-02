import { Schema } from "ajv";


export type ConfigModule = {
    version:1;
    name:string;
}


export const CONFIG_MODULE_SCHEMA:Schema = {
    type: "object",
    properties: {
        version: {
            type: "integer",
            minimum: 1,
            maximum: 1
        },
        name: {
            type: "string",
            minLength: 3,
            maxLength: 32,
            pattern: "^[a-zA-Z0-9-]+$"
        }
    },
    required: ["version", "name"],
    additionalProperties: false
};
