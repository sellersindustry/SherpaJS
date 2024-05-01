// FIXME - Implement Testing Suite
//! WIP

import { Method, Body } from "../../../index.js";


export type Options = {
    method:Method,
    path:string,
    body?:Body
}


export type TestResults = {
    name:string,
    success:boolean,
    message?:string,
    stack?:string
};

