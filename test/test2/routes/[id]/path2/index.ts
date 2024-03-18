import { Request, Response } from "../../../../../src/environment/index";


export function GET(request:Request, context:any) {
    return Response.JSON({
        bodyType: request.bodyType,
        body: request.body,
        query: request.params,
        url: request.url
    });
}


export function POST(request:Request, context:any) {
    return Response.text("foo");
}

