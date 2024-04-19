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


import {
    ModuleInterface,
    ModuleConfig,
    ModuleLoader, ServerConfig
} from "../../compiler/models.js";


export class New {


    static server<T=undefined>(config:ServerConfig<T>):ServerConfig<T> {
        return config;
    }


    static module<Interface extends ModuleInterface<Schema>, Schema>(config:ModuleConfig<Interface, Schema>):ModuleLoader<Interface, Schema> {
        return {
            ...config,
            load: (context:Schema) => {
                return new config.interface(context);
            }
        };
    }


}


// In the same way, faith by itself, if it is not accompanied by action, is dead.
// - James 2:17
