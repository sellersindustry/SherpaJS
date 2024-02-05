

export enum LogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG
}


export type Log = {
    level?:LogLevel;
    message:string;
    content?:string;
    path?:string;
};

