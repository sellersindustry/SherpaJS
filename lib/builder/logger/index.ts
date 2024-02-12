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
import { Log, LogLevel } from "./model";


export class Logger {


    public static Format(messages:Log[], exitOnError:boolean = true) {
        for (let message of messages)
            this.Print(message);
        if (!exitOnError) return;
        if (messages.filter(m => m.level == LogLevel.ERROR).length > 0)
            this.Exit();
    }


    public static Print(log:Log) {
        console.log(`${this.printStatus(log)} ${log.message}`);
        if (log.content)
            console.log(`\t${log.content}`);
        if (log.path)
            console.log(this.printPath(log));
    }


    private static printStatus(log:Log):string {
        let levelLabel = LogLevel[log.level != undefined ? log.level : LogLevel.INFO];
        if (log.level == LogLevel.ERROR) {
            return red(`[${levelLabel}]`);
        } else if (log.level == LogLevel.WARN) {
            return yellow(`[${levelLabel}]`);
        } else if (log.level == LogLevel.DEBUG) {
            return magenta(`[${levelLabel}]`);
        } else {
            return cyan(`[${levelLabel}]`);
        }
    }

    
    private static printPath(log:Log):string {
        if (!log.path) return;
        let route = log.propertyRoute ? log.propertyRoute.join(".") + " " : "";
        let file  = log.path + (log.lineNumber ? ":" + log.lineNumber : "");
        return dim(`\tat ${route}(${file})`);
    }


    public static RaiseError(log:Log) {
        this.Print({ ...log, level: LogLevel.ERROR });
        this.Exit();
    }


    public static Exit() {
        console.log("EXITED");
        process.exit(1);
    }


}


export type { Log };
export { LogLevel };


// Who is it that overcomes the world? Only the one who believes that Jesus is
// the Son of God.
// - 1 John 5:5
