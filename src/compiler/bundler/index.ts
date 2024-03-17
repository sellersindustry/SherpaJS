import { BuildOptions, BundlerType, Endpoint, Route } from "../models.js";
import { Logger } from "../utilities/logger/index.js";
import { Message } from "../utilities/logger/model.js";
import { Bundler } from "./platforms/abstract.js";


export function NewBundler(route:Route, endpoints:Endpoint[], options:BuildOptions, errors?:Message[]):Bundler {
    if (options.bundler === BundlerType.Vercel) {
        // return new BundlerVercel(server, options);
    } else if (options.bundler === BundlerType.Local) {
        // return new BundlerExpressJS(server, options);
    } else {
        Logger.raise({
            text: `Invalid bundler "${options.bundler}"`
        });
    }
}

