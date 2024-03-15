import { BodyType, Method } from "../model.js";
import { IRequest } from "./interface.js";


export class RequestTransform {

    static Vercel():IRequest {
        return {
            url: "",
            params: {
                path: {},
                query: {}
            },
            method: Method.DELETE,
            headers: {},
            body: "",
            bodyType: BodyType.Text
        }
    }

}

