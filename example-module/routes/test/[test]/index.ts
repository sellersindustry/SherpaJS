

export function GET(request:Request) {
    return new Response(JSON.stringify(request.headers), { status: 200 });
}
