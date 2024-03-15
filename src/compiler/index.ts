import { getStructure } from "./structure/index.js";
import { Logger } from "./utilities/logger/index.js";
import { Files } from "./utilities/files/index.js";


(async () => {
    let entry = Files.join(process.cwd(), "test/test1");
    console.log(entry)
    
    let results = await getStructure(entry);
    console.log("============ Results ============");
    Logger.display(results.errors);
    console.log(JSON.stringify(results.route, null, 4));
    console.log(JSON.stringify(results.endpoints, null, 4));
})();


