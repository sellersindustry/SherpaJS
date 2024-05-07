// FIXME - Add Headers + Footers

import { Tester } from "./tester.js";
import { Options, TestResults } from "./model.js";
import { bold, green, red, gray } from "colorette";


export class Suite {


    private host:string;
    private tests:Tester[] = [];
    private results:TestResults[] = [];


    constructor(host:string) {
        this.host = host;
    }


    test(name:string, options:Options):Tester {
        let test = new Tester(
            name,
            options.method,
            new URL(options.path, this.host).toString(),
            options.body
        );
        this.tests.push(test);
        return test;
    }


    async run() {
        for (let test of this.tests) {
            this.results.push(await test.invoke());
        }
        this.display();
    }


    private display() {
        let passed = this.results.filter((result) => result.success).length;
        let failed = this.results.filter((result) => !result.success).length;
        let total  = this.results.length;

        for (let test of this.results) {
            if (test.success) {
                console.log(`${green("√")} ${gray(test.name)}`);
            } else {
                console.log(`${red("×")} ${gray(test.name)}`);
                if (test.message) {
                    console.log(`    ${red(test.message)}\n`);
                }
                if (test.stack) {
                    for (let line of test.stack.split("\n")) {
                        console.log(`    ${gray(line)}`);
                    }
                }
                console.log("");
            }
        }

        console.log(`${bold("Tests:")} ${green(`${passed} passed,`)} ${red(`${failed} failed,`)} total ${total}`);
    }


}

