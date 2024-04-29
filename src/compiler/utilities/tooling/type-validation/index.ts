import fs from "fs";
import { Message } from "../../logger/model.js";
import { KV } from "../../kv/index.js";
import checksum from "checksum";
import { Path } from "../../path/index.js";


export async function typeValidation(filepath:string, fileTypeName:string):Promise<Message[]> {
    let cachedLogs = await cache(filepath);
    if (cachedLogs) {
        return cachedLogs;
    }


}


async function cache(filepath:string):Promise<Message[]|undefined> {
    let key = `type-validation-${Path.unix(filepath)}`;
    if (KV.has(key)) {
        let data = KV.get(key) as { checksum: string, logs: Message[] };
        if (data.checksum == await getChecksum(filepath)) {
            return data.logs;
        }
    }
    return undefined;
}


async function getChecksum(filepath:string):Promise<string> {
    return new Promise((resolve) => {
        checksum.file(filepath, { algorithm: "sha1" }, (error, hash) => {
            resolve(hash);
        });
    });

}

