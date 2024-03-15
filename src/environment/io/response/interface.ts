import { Headers, Body, BodyType } from "../model.js";

export interface IResponse {

    readonly status:number;
    readonly statusText:string;
    readonly headers:Headers;

    readonly redirect:string|undefined;
    readonly body:Body;
    readonly bodyType:keyof typeof BodyType;

}
