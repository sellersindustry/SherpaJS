import { Body, BodyType } from "../model.js";
import { IRequest } from "../request/interface.js";
import { IResponse } from "./interface.js";
import { ServerResponse as LocalResponse } from "http";


export class ResponseTransform {


    public static Local(response:IResponse, nativeResponse:LocalResponse) {
        nativeResponse.statusCode    = response.status;
        nativeResponse.statusMessage = response.statusText;

        for (let [key, value] of Object(response.headers).entries()) {
            nativeResponse.setHeader(key, value);
        }

        if (response.redirect) {
            nativeResponse.setHeader("Location", response.redirect);
        }

        let body:Body = undefined;
        switch (response.bodyType) {
            case BodyType.Text:
                body = response.body;
                break;
            case BodyType.JSON:
                body = JSON.stringify(response.body);
                break;
        }
        nativeResponse.end(body);
    }


    public static Vercel(response:IResponse) {

    }

    
}

