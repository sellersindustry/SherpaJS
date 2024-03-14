import { Message } from "../logger/model.js";
import { Route } from "../models/index.js";
import { getServerStructure } from "./config-server/index.js";
import { getRouteStructure } from "./routes/index.js";


export async function getStructure(entry:string):Promise<{ errors:Message[], route?:Route }> {
    let errors:Message[] = [];
    let { server, errors: errorsServer } = await getServerStructure(entry);
    errors.push(...errorsServer);
    if (!server) {
        return { errors };
    }

    let { route, errors: errorsRoute } = await getRouteStructure(entry, server.config.context);
    errors.push(...errorsRoute);
    return { route, errors };
}

