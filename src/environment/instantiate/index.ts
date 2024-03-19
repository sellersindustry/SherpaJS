/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Environment Instantiations
 *
 */



import { LoadModule, ModuleConfig, ServerConfig } from "../../compiler/models.js";


export class New {

    static server(config:ServerConfig):ServerConfig {
        return config;
    }

    static module(config:ModuleConfig):ModuleConfig {
        return config;
    }

}


export class Load {

    //! FIXME - Load.module<boolean>("", true);
    //! Consider this when writing docs and making context checker
    static module<T>(module:LoadModule<T>):LoadModule<T> {
        return module;
    }

}


// In the same way, faith by itself, if it is not accompanied by action, is dead.
// - James 2:17
