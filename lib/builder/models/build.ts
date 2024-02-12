/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: build.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Build Options
 *
 */


import { BuildOptions as ESBuildOptions } from "esbuild";


export enum BundlerType {
    Vercel = "Vercel",
    ExpressJS = "ExpressJS",
}


export type BuildOptions = {
    input:string;
    output:string;
    bundler:BundlerType;
    port?:number;
    developer?:{
        bundler?:{
            esbuild?:Partial<ESBuildOptions>;
        }
    }
}


// Hearing this, Jesus said to Jairus, "Don’t be afraid; just believe, and she
// will be healed."
// - Luke 8:50
