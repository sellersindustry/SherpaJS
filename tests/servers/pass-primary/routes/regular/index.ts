import { Context, Response } from "../../../../../src/environment/index";


export function GET(request:Request, context:Context) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}


export function POST(request:Request, context:Context) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}


export function PUT(request:Request, context:Context) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}


export function PATCH(request:Request, context:Context) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}


export function DELETE(request:Request, context:Context) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}

