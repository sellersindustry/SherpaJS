import { Environment, Response } from "../../../../index";

export function GET(request:Request, env:Environment) {
    return Response({
        message: "Hello World!",
        module: env.GetModuleConfig(),
        server: env.GetServerConfig(),
        properties: env.GetProperties(),
        id: env.GetModuleID(),
    }, { status: 200 });
}
