import { SherpaJS } from "./lib/builder";


SherpaJS.Build("./example-module", "./.vercel/output", {
    bundler: {
        esbuild: {
            minify: false
        }
    }
});
// (async () => {
//     console.log(await Bundler("./example-module"));
// })();
