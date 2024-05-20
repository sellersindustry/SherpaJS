import { Response } from "../../../../../../../../index.js";


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


export function PUT() {
    return Response.JSON({
        "string": "food",
        "number": 3,
        "boolean": true,
        "object": {
            "numbers": [3, -4]
        }
    });
}


export function PATCH() {
    return Response.JSON({
        "string": "food",
        "number": 3,
        "boolean": true,
        "object": {
            "numbers": [3, -4]
        }
    });
}


export function DELETE() {
    return Response.JSON({
        "string": "food",
        "number": 3,
        "boolean": true,
        "object": {
            "numbers": [3, -4]
        }
    });
}

