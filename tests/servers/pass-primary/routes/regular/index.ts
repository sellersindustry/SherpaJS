import { Response } from "../../../../../src/environment/index";


export function GET(request:Request, context:unknown) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}


export function POST(request:Request, context:unknown) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}


export function PUT(request:Request, context:unknown) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}


export function PATCH(request:Request, context:unknown) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}


export function DELETE(request:Request, context:unknown) {
    return Response.JSON({ 
        request: request,
        context: context
    }, { status: 201 });
}

