import { getStructure } from "./structure/index.js";
import { Logger } from "./utilities/logger/index.js";
import { Files } from "./utilities/files/index.js";
import { NewBundler } from "./bundler/index.js";
import { BundlerType } from "./models.js";

(async () => {
    let entry = Files.join(process.cwd(), "test/test1");
    
    let results = await getStructure(entry);

    console.log("============ Results ============");
    Logger.display(results.errors);
    console.log(JSON.stringify(results.route, null, 4));
    console.log(JSON.stringify(results.endpoints, null, 4));

    
    if (!results.endpoints || !results.route) {
        Logger.raise({ text: `Unable to generate server.` });
        return;
    }


    let bundler = NewBundler(results.route,  results.endpoints, {
        input: "C:/Users/sellerew/Desktop/libraries/sherpa-core/test/test2",
        output: "C:/Users/sellerew/Desktop/libraries/sherpa-core/output",
        bundler: BundlerType.Local,
        developer: {
            bundler: {
                esbuild: {
                    minify: false
                }
            }
        }
    }, results.errors);

    bundler.build();
})();


