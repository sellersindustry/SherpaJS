

export enum Level {
    ERROR,
    WARN,
    INFO,
    DEBUG
};


export type Message = {
    level?:Level;
    message:string;
    content?:string;
    path?:string;
};

