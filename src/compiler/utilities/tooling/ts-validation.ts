/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 04 2024
 *   file: ts-validation.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Validate Typescript
 *
 */


import fs from "fs";
import ts from "typescript";
import { Level, Message } from "../logger/model.js";


export class TypeValidation {

    private filepath: string;
    private fileTypeName: string;


    constructor(filepath:string, fileTypeName:string) {
        this.filepath     = filepath;
        this.fileTypeName = fileTypeName;
    }


    public apply():Message[] {
        try {
            return this.processDiagnostics(this.getDiagnostics());
        } catch (error) {
            return [{
                level: Level.ERROR,
                text: `Failed to parse ${this.fileTypeName}.`,
                content: error.message,
                file: { filepath: this.filepath }
            }];
        }        
    }


    private getDiagnostics():readonly ts.Diagnostic[] {
        let program = ts.createProgram({
            rootNames: [this.filepath],
            options: {},
            host: {
                ...ts.createCompilerHost({}),
                writeFile: () => {}
            }
        });
        return ts.getPreEmitDiagnostics(program);
    }


    private processDiagnostics(diagnostic:readonly ts.Diagnostic[]):Message[] {
        return diagnostic.filter(diagnostic => {
            return !diagnostic.messageText.toString().includes("--target"); // NOTE: Remove warning about targeting ES2022
        }).map(diagnostic => {
            let position = this.getLineNumber(diagnostic.start);
            let message = diagnostic.messageText.toString();
            if (diagnostic.relatedInformation && diagnostic.relatedInformation.length > 0) {
                let context = diagnostic.relatedInformation[0].messageText;
                message += " " + context.toString();
            }
            return {
                level: Level.WARN,
                text: `${this.fileTypeName} Type Error - ${message}`,
                file: {
                    filepath: this.filepath,
                    line: position.line,
                    character: position.character
                }
            };
        });
    }


    private getLineNumber(position:number):ts.LineAndCharacter {
        let buffer = fs.readFileSync(this.filepath, "utf8");
        let source = ts.createSourceFile(this.filepath, buffer, ts.ScriptTarget.Latest);
        return source.getLineAndCharacterOfPosition(position);
    }


}


// Because you know that the testing of your faith produces perseverance.
// - James 1:3
