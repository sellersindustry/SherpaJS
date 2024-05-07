import { Request, Response } from "../../../../../index.js";


export function GET(request:Request, context:unknown) {
    return Response.JSON({
        request,
        context
    });
}

