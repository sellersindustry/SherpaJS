

export const VALID_EXPORTS    = ["GET", "POST", "PUT", "PATCH", "DELETE"];


export type Endpoint = {
    filename:string;
    filetype:string;
    filepath:string;
    exports:string[];
    route:Route[];
};


export type Route = {
    name:string;
    isDynamic:boolean;
    orginal?:string;
};


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

