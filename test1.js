import fs from "fs-extra";

(async () => {
    for (let i = 0; i < 100; i++) {
        await fs.readFile("package.json");
    }    
})();
