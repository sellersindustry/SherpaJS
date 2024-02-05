

export default function NewResponse(body?:unknown, options?:ResponseInit):Response {
    if (body) {
        if (typeof body == "string") {
            return new Response(body, options);
        } else {
            return Response.json(body, options);
        }
    }
    return new Response();
}

