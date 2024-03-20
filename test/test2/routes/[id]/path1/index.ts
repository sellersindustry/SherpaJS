import { Response } from "../../../../../src/environment";

export function GET(request:Request, context:any) {
    return Response.redirect("../path2");
}


