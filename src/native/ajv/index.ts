/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Wed May 22 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: AJV Wrapper
 *
 */


import { ValidateFunction, Schema, JSONSchemaType } from "ajv";


export function AJV<T=unknown>(schema:Schema|JSONSchemaType<T>):ValidateFunction<T> {
    return schema as ValidateFunction<T>;
}


// The grace of the Lord Jesus Christ be with your spirit. Amen.
// - Philippians 4:23
