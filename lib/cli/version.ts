import { readFileSync } from "fs";
import path from "path";


export function GetVersion():string {
    let file = path.join(__dirname, "../../package.json");
    let buff = readFileSync(file, "utf8")
    let data = JSON.parse(buff);
    return data.version;
}

