/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Validate Typescript
 *
 */

import fs from "fs";
import ts from "typescript";
import checksum from "checksum";
import { KV as KVStorage } from "../../kv/index.js";
import { Path } from "../../path/index.js";
import { Level, Message } from "../../logger/model.js";
const KV = new KVStorage("TYPE-VALIDATION");


export async function typeValidation(filepath:string, fileTypeName:string):Promise<Message[]> {
    let cachedLogs = await getCache(filepath);
    if (cachedLogs) {
        return cachedLogs;
    }

    try {
        let logs = processDiagnostics(filepath, fileTypeName, getDiagnostics(filepath));
        setCache(filepath, logs);
        return logs;
    } catch (error) {
        return [{
            level: Level.ERROR,
            text: `Failed to parse ${this.fileTypeName}.`,
            content: error.message,
            file: { filepath: this.filepath }
        }];
    }
}


function getDiagnostics(filepath:string):readonly ts.Diagnostic[] {
    let program = ts.createProgram({
        rootNames: [filepath],
        options: {
            noEmit: true
        },
        host: {
            ...ts.createCompilerHost({}),
            writeFile: () => {}
        }
    });
    return ts.getPreEmitDiagnostics(program);
}


function processDiagnostics(filepath:string, fileTypeName:string, diagnostic:readonly ts.Diagnostic[]):Message[] {
    return diagnostic.filter(diagnostic => {
        return !diagnostic.messageText.toString().includes("--target"); // NOTE: Remove warning about targeting ES2022
    }).map((diagnostic):Message => {
        let position = getLineNumber(filepath, diagnostic.start as number);
        let message = diagnostic.messageText.toString();
        if (diagnostic.relatedInformation && diagnostic.relatedInformation.length > 0) {
            let context = diagnostic.relatedInformation[0].messageText;
            message += " " + context.toString();
        }
        return {
            level: Level.WARN,
            text: `${fileTypeName} Type Error - ${message}`,
            file: {
                filepath: filepath,
                line: position.line,
                character: position.character
            }
        };
    });
}


function getLineNumber(filepath:string, position:number):ts.LineAndCharacter {
    let buffer = fs.readFileSync(filepath, "utf8");
    let source = ts.createSourceFile(filepath, buffer, ts.ScriptTarget.Latest);
    return source.getLineAndCharacterOfPosition(position);
}


async function setCache(filepath:string, logs:Message[]):Promise<void> {
    KV.set(getCacheKey(filepath), {
        filepath: filepath,
        checksum: await getChecksum(filepath),
        logs: logs
    });
}


async function getCache(filepath:string):Promise<Message[]|undefined> {
    let key = getCacheKey(filepath);
    if (KV.has(key)) {
        let data = KV.get(key) as { filepath:string, checksum: string, logs: Message[] };
        if (data.checksum == await getChecksum(filepath)) {
            return data.logs;
        }
    }
    return undefined;
}


function getCacheKey(filepath:string):string {
    return btoa(Path.unix(filepath));
}


async function getChecksum(filepath:string):Promise<string> {
    return new Promise((resolve) => {
        checksum.file(filepath, { algorithm: "sha1" }, (error, hash) => {
            resolve(hash);
        });
    });

}


// Because you know that the testing of your faith produces perseverance.
// - James 1:3
