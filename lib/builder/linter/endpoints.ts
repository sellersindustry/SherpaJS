import { Endpoint, Level, Message, VALID_EXPORTS } from "../models";


const VALID_FILE_TYPES = ["JS", "CJS", "TS"];


export function Linter(endpoints:Endpoint[]):Message[] {
    let messages:Message[] = [];
    for (let endpoint of endpoints) {
        messages.push(...filetype(endpoint));
        messages.push(...filename(endpoint));
        messages.push(...routes(endpoint));
        messages.push(...exported(endpoint));
    }
    return messages;
}


function filetype(endpoint:Endpoint):Message[] {
    if (VALID_FILE_TYPES.includes(endpoint.filetype.toUpperCase())) return [];
    return [{
        level: Level.ERROR,
        message: "Invalid File Type. Must be " + VALID_FILE_TYPES.join(", ") + ".",
        path: endpoint.filepath
    }];
}


function filename(endpoint:Endpoint):Message[] {
    if (endpoint.filename == "index") return [];
    return [{
        level: Level.ERROR,
        message: "Invalid File Name. Must be \"index\".",
        path: endpoint.filepath
    }];
}


function routes(endpoint:Endpoint):Message[] {
    for (let subroute of endpoint.route) {
        if (subroute.isDynamic) continue;
        if (subroute.name == subroute.orginal) continue;
        return [{
            level: Level.WARN,
            message: `Routes should be lowercase \"${endpoint.route.map(r => r.orginal).join("/")}\".`,
            path: endpoint.filepath
        }];
    }
    return [];
}


function exported(endpoint:Endpoint):Message[] {
    let messages:Message[] = [];
    for (let variable of endpoint.exports) {
        if (!VALID_EXPORTS.includes(variable)) {
            messages.push({
                level: Level.WARN,
                message: `Invalid Export. \"${variable}\" will be ignored. `
                    + "Must be " + VALID_EXPORTS.join(", ") + ".",
                path: endpoint.filepath
            });
        }
    }
    if ( endpoint.exports.filter((name) => VALID_EXPORTS.includes(name)).length == 0) {
        messages.push({
            level: Level.ERROR,
            message: "No Valid Exports. No route will be generated.",
            path: endpoint.filepath
        });
    }
    return messages;
}
