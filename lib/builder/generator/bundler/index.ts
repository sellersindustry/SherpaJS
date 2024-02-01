import { BuildOptions, Server } from "../../models";
import { Utility } from "../../utilities";
import { Bundler } from "./abstract";
import { BundlerVercel } from "./vercel";



export function NewBundler(server:Server, options:BuildOptions):Bundler {
    if (options.bundler === "vercel") {
        return new BundlerVercel(server, options);
    } else if (options.bundler === "expressjs") {
        return null;
    } else {
        Utility.Log.Error({ message: "Invalid bundler." });
    }
}

