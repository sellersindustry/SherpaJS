import { GetConfigServer } from "./config-server";
import { GetConfigModule } from "./config-module";
import { GetEndpoints } from "./endpoints";
import { Bundler } from "./bundler/abstract";
import { BundlerVercel } from "./bundler/vercel";


export const Generator = {
    GetConfigServer,
    GetConfigModule,
    GetEndpoints,
    Bundler,
    BundlerVercel
};

