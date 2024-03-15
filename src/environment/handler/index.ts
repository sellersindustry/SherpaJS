import { Method } from "../io/model.js";
import { Context } from "../../compiler/models.js";
import { IResponse } from "../io/response/interface.js";
import { IRequest } from "../io/request/interface";
import { Response } from "../io/response/index.js";


type callback  = (request?:IRequest, context?:Context) => Promise<IResponse|undefined>|IResponse|undefined;
type endpoints = {
    [key in keyof typeof Method]: undefined|callback;
};


export async function Handler(endpoints:endpoints, context:Context, request:IRequest):Promise<IResponse> {
    let callback = endpoints[request.method];
    if (callback) {
        try {
            let response = await callback(request, context);
            if (!response) {
                return Response.new({ status: 200 });
            }
            //! NOTE: in the future you might want to validate the response
            return response;
        } catch (error) {
            return Response.text(error.message, { status: 500 });
        }
    } else {
        return Response.new({ status: 405 });
    }
}

