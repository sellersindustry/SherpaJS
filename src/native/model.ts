/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: model.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: IO (Request/Response) Models
 *
 */


export enum BodyType {
    JSON = "JSON",
    Text = "Text",
    None = "None"
}


export const CONTENT_TYPE:Record<BodyType, string|undefined> = {
    [BodyType.JSON]: "application/json",
    [BodyType.Text]: "text/plain",
    [BodyType.None]: undefined
}


export type Body = Record<string, unknown>|string|undefined;


// For you were once darkness, but now you are light in the Lord. Live as
// children of light.
// - Ephesians 5:8
