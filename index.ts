import { SherpaJS } from "./lib/builder";


SherpaJS.Build({
    input: process.cwd(),
    output: process.cwd(),
    developer: {
        bundler: {
            esbuild: {
                minify: false
            }
        }
    }
});
// (async () => {
//     console.log(await Bundler("./example-module"));
// })();
