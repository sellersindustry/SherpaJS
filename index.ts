import { SherpaJS } from "./lib/builder";
import { BundlerType } from "./lib/builder/models/build";


(async () => {
    await SherpaJS.Build({
        input: process.cwd(),
        output: process.cwd(),
        bundler: BundlerType.Vercel,
        developer: {
            bundler: {
                esbuild: {
                    minify: false
                }
            }
        }
    });
})();
