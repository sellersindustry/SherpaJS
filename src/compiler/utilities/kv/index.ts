/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Apr 29 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Key Value Cache
 *
 */


import fs from "fs";
import { Path } from "../path/index.js";


const FILENAME = "SHERPA-KV.json";
const FILEPATH = Path.join(Path.getRootDirectory(), FILENAME);


type KVStructure = Record<string, Record<string, { data: unknown, timestamp: string }>>;


export class KV {

    private namespace:string;

    constructor(namespace:string) {
        this.namespace = namespace;
    }


    getNamespace():string {
        return this.namespace;
    }


    get(key:string):unknown {
        return KV.load()[this.namespace][key].data;
    }


    has(key:string):boolean {
        if (!KV.load()[this.namespace]) {
            return false;
        }
        return Object.keys(KV.load()[this.namespace]).includes(key);
    }


    set(key:string, value:unknown) {
        let data = KV.load();
        if (!data[this.namespace]) {
            data[this.namespace] = {};
        }
        data[this.namespace][key] = {
            data: value,
            timestamp: new Date().toISOString()
        };
        KV.store(data);
    }


    delete(key:string) {
        let data = KV.load();
        delete data[this.namespace][key];
        if (Object.keys(data[this.namespace]).length === 0) {
            delete data[this.namespace];
        }
        KV.store(data);
    }


    getKeys():string[] {
        return Object.keys(KV.load()[this.namespace]);
    }


    getValues():unknown[] {
        return Object.values(KV.load()[this.namespace]).map(o => o["data"]);
    }


    static getFilepath():string {
        return FILEPATH;
    }


    private static load():KVStructure {
        try {
            return JSON.parse(fs.readFileSync(this.getFilepath(), "utf8"));
        } catch (error) {
            return {};
        }
    }


    private static store(data:KVStructure) {
        fs.writeFileSync(this.getFilepath(), JSON.stringify(data, null, 4), "utf8");
    }


}


// He replied, "Blessed rather are those who hear the word of God and obey it."
// - Luke 11:28
