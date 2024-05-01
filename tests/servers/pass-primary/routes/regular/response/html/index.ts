import { Response } from "../../../../../../../index.js";


export function POST() {
    return Response.JSON({
        "string": "food",
        "number": 3,
        "boolean": true,
        "object": {
            "numbers": [3, -4]
        }
    });
}

