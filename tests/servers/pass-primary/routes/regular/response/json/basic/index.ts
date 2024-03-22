import { Response } from "../../../../../../../../src/environment/index";


export function GET() {
    return Response.JSON({
        "string": "food",
        "number": 3,
        "boolean": true,
        "object": {
            "numbers": [3, -4]
        }
    });
}

