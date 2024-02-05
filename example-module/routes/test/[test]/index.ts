import { SherpaSDK } from "../../../../lib/sdk";

export function GET(request:Request) {
    return SherpaSDK.Response(request.url, { status: 200 });
}
