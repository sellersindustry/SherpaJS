import { Request, Response } from "../../../../src/environment/index";


export function GET(request:Request, context:any) {
    return Response.JSON({
        request,
        context
    });
}

