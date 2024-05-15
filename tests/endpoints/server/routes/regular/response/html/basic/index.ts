import { Response } from "../../../../../../../../index.js";


export function POST() {
    return Response.JSON({
        "string": "food",
        "number": 3,
        "boolean": true,
        "object": {
            "numbers": [3, -4]
        }
    }, {
        status: 201
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
    }, {
        status: 201
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
    }, {
        status: 201
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
    }, {
        status: 201
    });
}

