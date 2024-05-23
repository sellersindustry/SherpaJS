import { Request, Response, AJV } from "../../../../../index.js";
import schemaFoo from "../../src/foo.schema.json";
const validatorFoo = AJV(schemaFoo);


export function POST(request:Request) {
    try {
        if (!validatorFoo(request.body)) {
            return Response.text(JSON.stringify(validatorFoo.errors));
        }
        return Response.text("OK");
    } catch (e) {
        console.log(e);
        return Response.text(e.toString());
    }
}

