import { Response, Request, Context } from "../../../../../../../../src/environment/index";


export function GET(request:Request, context:Context) {
    return Response.JSON({
        request,
        context
    });
}

