import { getStructure } from "./structure/index.js";
import { Logger } from "./logger/index.js";
import { Files } from "./files/index.js";


(async () => {
    let entry = Files.join(process.cwd(), "test");
    console.log(entry)
    
    let results = await getStructure(entry);
    console.log("============ Results ============");
    Logger.display(results.errors);
    console.log(JSON.stringify(results.route, null, 4));
})();


