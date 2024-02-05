import { Logger } from "../../logger";
import { BuildOptions, Server } from "../../models";
import { BundlerType } from "../../models/build";
import { Bundler } from "./abstract";
import { BundlerExpressJS } from "./expressjs";
import { BundlerVercel } from "./vercel";



export function NewBundler(server:Server, options:BuildOptions):Bundler {
    if (options.bundler === BundlerType.Vercel) {
        return new BundlerVercel(server, options);
    } else if (options.bundler === BundlerType.ExpressJS) {
        return new BundlerExpressJS(server, options);
    } else {
        Logger.RaiseError({ message: "Invalid bundler." });
    }
}

