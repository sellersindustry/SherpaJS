// FIXME - Add Headers + Footers

import { Method, Body } from "../../../index.js";


export type TestOptions = {
    method:Method,
    path:string,
    body?:Body
}


export type BenchOptions = {
    host:string;
    start?:string;
    setup?:string[];
    teardown?:string[];
}


export type TestResults = {
    name:string,
    success:boolean,
    message?:string,
    stack?:string
};

