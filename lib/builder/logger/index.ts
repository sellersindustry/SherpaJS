import { Log, LogLevel } from "./model";


export class Logger {


    public static Output(messages:Log[], exitOnError:boolean = true) {
        for (let message of messages)
            this.Print(message);
        if (!exitOnError) return;
        if (messages.filter(m => m.level == LogLevel.ERROR).length > 0)
            this.Exit();
    }


    public static Print(log:Log) {
        let levelLabel = LogLevel[log.level != undefined ? log.level : LogLevel.INFO];
        console.log(`[${levelLabel}] ${log.message}`);
        if (log.content)
            console.log(`\t ${log.content}`);
        if (log.path)
            console.log(`\t Path: ${log.path}`);
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
