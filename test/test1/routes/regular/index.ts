import { Response } from "../../../../src/environment/index";

export function GET(request:Request, context:any) {
    return Response.JSON({ test: 2, context: context }, { status: 201 });
}


