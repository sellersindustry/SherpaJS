import { readFileSync} from "fs";


export function GetVersion():string {
    let path = __dirname + "/../../../package.json";
    let file = readFileSync(path, "utf8")
    let data = JSON.parse(file);
    return data.version;
}

