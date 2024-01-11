import { BuildOptions as ESBuildOptions } from "esbuild";


export type BuildOptions = {
    input:string;
    output:string;
    developer?:{
        bundler?:{
            esbuild?:Partial<ESBuildOptions>;
        }
    }
}

