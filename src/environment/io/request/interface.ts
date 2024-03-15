import { Method, Body, BodyType, Headers, PathParameters, QueryParameters } from "../model.js";


export interface IRequest {

    readonly url:string;
    readonly params:{ path:PathParameters, query:QueryParameters };
    readonly method:keyof typeof Method;
    readonly headers:Headers;

    readonly body:Body;
    readonly bodyType:keyof typeof BodyType;

}

