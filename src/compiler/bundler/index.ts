import { BuildOptions, BundlerType, Endpoint, Route } from "../models.js";
import { Local } from "./platforms/local/index.js";
import { Logger } from "../utilities/logger/index.js";
import { Message } from "../utilities/logger/model.js";
import { Bundler } from "./platforms/abstract.js";


export function NewBundler(route:Route, endpoints:Endpoint[], options:BuildOptions, errors?:Message[]):Bundler {
    if (options.bundler === BundlerType.Vercel) {
        // return new BundlerVercel(server, options);
        //! FIXME
        return new Local(route, endpoints, options, errors);
    } else if (options.bundler === BundlerType.Local) {
        return new Local(route, endpoints, options, errors);
    } else {
        Logger.raise({ text: `Invalid bundler "${options.bundler}"` });
        return undefined as unknown as Bundler;
    }
}

