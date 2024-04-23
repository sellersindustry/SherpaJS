/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Entry
 *
 */


export * from "./src/native/index.js";
export type * from "./src/native/index.js";

import { New } from "./src/instantiate/index.js";
const SherpaJS = {
    New
};

export { SherpaJS };


// For God so loved the world that he gave his one and only Son, that whoever
// believes in him shall not perish but have eternal life.
// - John 3:16
