import fs from "fs";
import { Path } from "../path/index.js";

const FILENAME = "SHERPA-KV.json";
const FILEPATH = Path.join(Path.getRootDirectory(), FILENAME);


export class KV {


    static get(key:string):unknown {
        return this.load()[key];
    }


    static has(key:string):boolean {
        return Object.keys(this.load()).includes(key);
    }


    static set(key:string, value:unknown) {
        this.store({ ...this.load(), [key]: value });
    }


    static delete(key:string) {
        let data = this.load();
        delete data[key];
        this.store(data);
    }


    static getKeys():string[] {
        return Object.keys(this.load());
    }


    static getValues():unknown[] {
        return Object.values(this.load());
    }


    static getAll():Record<string, unknown> {
        return this.load();
    }


    static getFilepath():string {
        return FILEPATH;
    }


    private static load():Record<string, unknown> {
        try {
            return JSON.parse(fs.readFileSync(this.getFilepath(), "utf8"));
        } catch (error) {
            return {};
        }
    }


    private static store(data:Record<string, unknown>) {
        fs.writeFileSync(this.getFilepath(), JSON.stringify(data, null, 4), "utf8");
    }


}
