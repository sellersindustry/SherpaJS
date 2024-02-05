import { SherpaSDK } from "../../lib/sdk";

export function GET() {
    return SherpaSDK.Response({ "foo": 200 });
}
