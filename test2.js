import fs from "fs";



for (let i = 0; i < 100; i++) {
    fs.existsSync("./foo.png");
    fs.existsSync("package.json");
}
