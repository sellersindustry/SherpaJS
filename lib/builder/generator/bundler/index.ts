import { BuildOptions, Server } from "../../models";
import { BundlerType } from "../../models/options";
import { Utility } from "../../utilities";
import { Bundler } from "./abstract";
import { BundlerVercel } from "./vercel";



export function NewBundler(server:Server, options:BuildOptions):Bundler {
    if (options.bundler === BundlerType.Vercel) {
        return new BundlerVercel(server, options);
    } else if (options.bundler === BundlerType.ExpressJS) {
        return null;
    } else {
        Utility.Log.Error({ message: "Invalid bundler." });
    }
}

