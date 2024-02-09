import { Response } from "../../../../index";

export function GET(request:Request) {
    return Response(request.url, { status: 200 });
}
