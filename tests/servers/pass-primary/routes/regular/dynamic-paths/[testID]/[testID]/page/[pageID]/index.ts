import { Context, Response } from "../../../../../../../../../../src/environment/index";

export function GET(request:Request, context:Context) {
    return Response.JSON({ 
        request: request,
        context: context
    });
}

