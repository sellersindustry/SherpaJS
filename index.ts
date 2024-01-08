import { SherpaJS } from "./lib/builder";
import { Bundle } from "./lib/builder/generator/bundler";
import { Endpoint } from "./lib/builder/models";


SherpaJS.BuildModule("./example-module", [], "./.vercel/output");
