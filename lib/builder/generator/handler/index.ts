import { SherpaRequest, SherpaSDK } from "../../../sdk";
import { ConfigServer, Endpoint, REQUEST_METHODS } from "../../models";
import { BundlerType } from "../../models/build";


type MethodFunctions = { [key:string]:(request:SherpaRequest, sherpa:SherpaSDK) => Response };


export function Handler(
    request:Request, functions:MethodFunctions, 
    endpoint:Endpoint, config:ConfigServer, type:BundlerType
):Response {
    let method = request.method.toUpperCase();
    if (REQUEST_METHODS.includes(method) && functions[method]) {
        let sherpaRequest = prepareRequest(request, type);
        let sherpaSDK     = new SherpaSDK(config, endpoint);
        return functions[method](sherpaRequest, sherpaSDK);
    } else {
        return new Response(`Unsupported method "${request.method}".`, { status: 405 });
    }
}


function prepareRequest(request:Request, type:BundlerType):SherpaRequest {
    if (type === BundlerType.Vercel) {
        return prepareRequestVercel(request);
    } else {
        throw new Error("Not implemented");
    }

}


function prepareRequestVercel(request:Request):SherpaRequest {
    let params   = new URLSearchParams(request.url);
    let _request = request as SherpaRequest;
    _request["query"]  = {};
    _request["params"] = {};
    params.forEach((value, key) => {
        if (key.startsWith("PARAM--")) {
            _request["params"][key.replace("PARAM--", "")] = value;
        } else {
            _request["query"][key] = value;
        }
    });
    return _request;
}

