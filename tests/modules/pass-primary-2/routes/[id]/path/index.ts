import { Response, Request } from "../../../../../../src/environment";

export function GET(request:Request, context:any) {
    return Response.JSON({
        request,
        context
    });
}


