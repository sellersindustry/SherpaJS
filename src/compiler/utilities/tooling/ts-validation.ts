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
import { Files } from "../files/index.js";


const BUFFER_FILE_NAME = "sherpa.TS_VALIDATION_BUFFER.ts";
const CTRL_LINE_ZERO   = "// <SHERPA-LINE-0>";


export type SubSchema = {
    filepath:string;
    name:string;
}

export type Schema = {
    filepath:string;
    name:string;
    subtype?:SubSchema;
}


export class TypeValidation {

    private filepath: string;
    private fileTypeName: string;
    private functionName: string;
    private buffer: string;
    private bufferEnv: string;
    private schema: Schema;


    constructor(filepath:string, fileTypeName:string, functionName:string, schema:Schema) {
        this.filepath     = filepath;
        this.fileTypeName = fileTypeName;
        this.functionName = functionName;
        this.schema       = schema;
        this.buffer       = this.getBuffer();
        this.bufferEnv    = this.getBufferEnv();
    }


    public apply():Message[] {
        let hasDefaultExportErrors = this.hasDefaultExport();
        if (hasDefaultExportErrors.length > 0) {
            return hasDefaultExportErrors;
        }

        let errors:Message[] = [];
        this.writeBufferEnv();
        try {
            errors.push(...this.processDiagnostics(this.getDiagnostics()));
        } catch (error) {
            errors.push({
                level: Level.ERROR,
                text: `Failed to parse ${this.fileTypeName}.`,
                content: error.message,
                file: { filepath: this.filepath }
            });
        }
        this.deleteBufferEnv();
        
        return errors;
    }


    private getDiagnostics():readonly ts.Diagnostic[] {
        let program = ts.createProgram({
            rootNames: [this.getBufferEnvFilepath()],
            options: {},
            host: {
                ...ts.createCompilerHost({}),
                writeFile: () => {}
            }
        });
        return ts.getPreEmitDiagnostics(program);
    }


    private processDiagnostics(diagnostic:readonly ts.Diagnostic[]):Message[] {
        return diagnostic.map(diagnostic => {
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
                    line: this.getLineNumber(diagnostic.start)
                }
            };
        });
    }


    private getLineNumber(position:number):number {
        let lineOffset = this.bufferEnv.split("\n").indexOf(CTRL_LINE_ZERO);
        let source = ts.createSourceFile(this.getBufferEnvFilepath(), this.bufferEnv, ts.ScriptTarget.Latest);
        return source.getLineAndCharacterOfPosition(position).line - lineOffset;
    }
    

    private hasDefaultExport():Message[] {
        if (!this.buffer.match(/export\s+default\s+/)) {
            return [{
                level: Level.ERROR,
                text: `${this.fileTypeName} has no default export.`,
                file: { filepath: this.filepath }
            }];
        }

        if (!this.buffer.match(this.getFunctionDeclareRegex())) {
            return [{
                level: Level.ERROR,
                text: `${this.fileTypeName} does not utilize the ${this.functionName} instantiation.`,
                content: `Example: default export ${this.functionName}(...)`,
                file: { filepath: this.filepath }
            }];
        }

        return [];
    }


    private getFunctionDeclareRegex():RegExp {
        let regex = `export\\s+default\\s+${this.functionName}\\s?(<\\s?[a-zA-Z0-9_]+\\s?>)?\\s?\\(`;
        return new RegExp(regex);
    }


    private getBuffer():string {
        return fs.readFileSync(this.filepath, "utf8");;
    }


    private getBufferEnv():string {
        return [
            `import { ${this.schema.name} as __TYPE } from "${Files.unix(this.schema.filepath)}"`,
            (this.schema?.subtype) ? `import { ${this.schema.subtype.name} as __SUBTYPE } from "${Files.unix(this.schema.subtype.filepath)}"` : "",
            CTRL_LINE_ZERO,
            this.buffer.replace(
                this.getFunctionDeclareRegex(),
                `let __EXPORT:__TYPE${(this.schema?.subtype) ? "<__SUBTYPE>" : ""} = (`
            ),
            "export default __EXPORT;"
        ].join("\n");
    }


    private writeBufferEnv() {
        fs.writeFileSync(this.getBufferEnvFilepath(), this.bufferEnv);
    }


    private deleteBufferEnv() {
        if (fs.existsSync(this.getBufferEnvFilepath())) {
            fs.unlinkSync(this.getBufferEnvFilepath());
        }
    }


    private getBufferEnvFilepath():string {
        return Files.join(Files.getDirectory(this.filepath), BUFFER_FILE_NAME);
    }


}


// Because you know that the testing of your faith produces perseverance.
// - James 1:3
