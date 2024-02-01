import { SherpaJS } from "./lib/builder";


(async () => {
    await SherpaJS.Build({
        input: process.cwd(),
        output: process.cwd(),
        bundler: "vercel",
        developer: {
            bundler: {
                esbuild: {
                    minify: false
                }
            }
        }
    });
})();
