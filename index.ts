import { SherpaJS } from "./lib/builder";


SherpaJS.BuildModule("./example-module", "./.vercel/output");
// (async () => {
//     console.log(await Bundler("./example-module"));
// })();
