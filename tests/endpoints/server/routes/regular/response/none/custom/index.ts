import { Response, Headers as SherpaHeaders } from "../../../../../../../../index.js";


export function GET() {
    return new Response({
        status: 401,
        headers: {
            "X-Foo": "bar"
        }
    });
}


export function POST() {
    return Response.new({
        status: 401,
        headers: new Headers({
            "X-Foo": "bar"
        })
    });
}


export function PUT() {
    return Response.new({
        status: 401,
        headers: new SherpaHeaders({
            "X-Foo": "bar"
        })
    });
}


export function PATCH() {
    return Response.new({
        status: 401,
        headers: [["X-Foo", "bar"]]
    });
}


export function DELETE() {
    return Response.new({
        status: 401,
        headers: new SherpaHeaders([["X-Foo", "bar"]])
    });
}

