/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Sun Feb 11 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Logger
 *
 */


import { cyan, dim, magenta, red, yellow } from "colorette"
import { Message, Level, MessageFile } from "./model.js";


export class Logger {


    public static format(messages:Message[]) {
        for (let message of messages) {
            this.display(message);
        }
    }


    public static display(message:Message) {
        console.log(`${this.levelToString(message.level)} ${message.text}`);
        if (message.content) {
            console.log(`\t${message.content}`);
        }
        if (message.file) {
            console.log(this.fileToString(message.file));
        }
    }


    public static error(message:Message):Message {
        return { ...message, level: Level.ERROR };
    }


    // public static raise(message:Message) {
    //     this.display({ ...message, level: Level.ERROR });
    //     this.exit();
    // }


    // public static exit() {
    //     console.log("EXITED");
    //     process.exit(1);
    // }


    private static levelToString(level:Level=Level.INFO):string {
        if (level == Level.ERROR) {
            return red(`[${level}]`);
        } else if (level == Level.WARN) {
            return yellow(`[${level}]`);
        } else if (level == Level.DEBUG) {
            return magenta(`[${level}]`);
        } else {
            return cyan(`[${level}]`);
        }
    }

    
    private static fileToString(file?:MessageFile):string {
        if (!file) return "";
        let properties = file.properties ? file.properties.join(".") + " " : "";
        let path       = file.filepath + (file.line ? ":" + file.line : "");
        return dim(`\tat ${properties}(${path})`);
    }


}


export type { Message as Log };
export { Level as LogLevel };


// Who is it that overcomes the world? Only the one who believes that Jesus is
// the Son of God.
// - 1 John 5:5
