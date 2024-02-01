import { BuildOptions as ESBuildOptions } from "esbuild";


export type BuildOptions = {
    input:string;
    output:string;
    bundler:"vercel"|"expressjs";
    developer?:{
        bundler?:{
            esbuild?:Partial<ESBuildOptions>;
        }
    }
}

