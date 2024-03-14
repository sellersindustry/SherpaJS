import path from "path";
import { getStructure } from "./structure/index.js";


(async () => {
    let entry = path.join(process.cwd(), "test");
    console.log(entry)
    
    let results = await getStructure(entry);
    console.log("============ Results ============");
    console.log(JSON.stringify(results, null, 4));
})();


