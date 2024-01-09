
export function GET(request:Request) {
    return new Response(request.url, { status: 200 });
}
