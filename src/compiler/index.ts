import { getStructure } from "./structure/index.js";
import { Logger } from "./utilities/logger/index.js";
import { Files } from "./utilities/files/index.js";
import { NewBundler } from "./bundler/index.js";
import { BundlerType } from "./models.js";

(async () => {
    let entry = Files.join(process.cwd(), "test/test1");
    console.log(entry)
    
    let results = await getStructure(entry);
    if (!results.endpoints || !results.route) {
        Logger.raise({ text: `Unable to generate server.` });
        return;
    }

    let bundler = NewBundler(results.route,  results.endpoints, {
        input: "../../test2",
        output: "../../output",
        bundler: BundlerType.Local
    }, results.errors);

    console.log("============ Results ============");
    Logger.display(results.errors);
    console.log(JSON.stringify(results.route, null, 4));
    console.log(JSON.stringify(results.endpoints, null, 4));
})();


