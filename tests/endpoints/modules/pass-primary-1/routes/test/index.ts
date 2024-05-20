import { Response } from "../../../../../../index.js";


export function POST() {
    return Response.text("Hello World", { status: 201 });
}

