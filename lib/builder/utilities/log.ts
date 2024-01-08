import { Level, Message } from "../models";


export class Log {


    public static Output(messages:Message[], exitOnError:boolean = true) {
        for (let message of messages)
            this.Print(message);
        if (!exitOnError) return;
        if (messages.filter(m => m.level == Level.ERROR).length > 0)
            this.Exit();
    }


    public static Print(log:Message) {
        let levelLabel = Level[log.level != undefined ? log.level : Level.INFO];
        console.log(`[${levelLabel}] ${log.message}`);
        if (log.content)
            console.log(`\t ${log.content}`);
        if (log.path)
            console.log(`\t Path: ${log.path}`);
    }


    public static Error(message:Message) {
        this.Print(message);
        this.Exit();
    }


    public static Exit() {
        console.log("EXITED");
        process.exit(1);
    }


}

