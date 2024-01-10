import { BuildOptions } from "esbuild";


export type DeveloperParamaters = {
    bundler?:{
        esbuild?:Partial<BuildOptions>;
    }
}

