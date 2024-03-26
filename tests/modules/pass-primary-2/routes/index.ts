import { Request, Response } from "../../../../src/environment/index";


export function GET(request:Request, context:unknown) {
    return Response.JSON({
        request,
        context
    });
}

