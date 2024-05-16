/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu May 16 2024
 *   file: suite.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Endpoint Test Suite - Suite
 *
 */


import { Tester } from "./tester.js";
import { BenchOptions, TestOptions, TestResults } from "./model.js";
import { bold, green, red, gray } from "colorette";
import { Bench } from "./bench.js";


export class Suite {


    private tests:Tester[] = [];
    private benches:Bench[] = [];
    private results:{ [name:string]:TestResults[] } = {};


    test(name:string, options:TestOptions):Tester {
        let test = new Tester(
            name,
            options.method,
            options.path,
            options.body
        );
        this.tests.push(test);
        return test;
    }


    bench(name:string, options:BenchOptions):Bench {
        let bench = new Bench(
            name,
            options.host,
            options.start,
            options.setup || [],
            options.teardown || []
        );
        this.benches.push(bench);
        return bench;
    }


    async run() {
        for await (const bench of this.benches) {
            if (this.results[bench.getName()]) {
                throw new Error(`Test bench name duplicate: "${bench.getName()}"`);
            }
            this.results[bench.getName()] = [];

            await bench.setup();
            await bench.start();
            for await (const test of this.tests) {
                this.results[bench.getName()].push(await test.invoke(bench.getHost()));
            }
            await bench.teardown();
        }

        this.display();
    }


    private display() {
        for (let bench of this.benches) {
            let _passed = this.results[bench.getName()].filter((result) => result.success).length;
            let _failed = this.results[bench.getName()].filter((result) => !result.success).length;
            let _total  = this.results[bench.getName()].length;

            console.log("\n============ " + bold(bench.getName()) + " =============");
    
            for (let test of this.results[bench.getName()]) {
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
    
            console.log(`${bold("Tests:")} ${green(`${_passed} passed,`)} ${red(`${_failed} failed,`)} total ${_total}`);
        }

        let passed = 0;
        let failed = 0;
        let total  = 0;

        console.log("\n============ " + bold("Overview") + " =============");
        for (let bench of this.benches) {
            let _passed = this.results[bench.getName()].filter((result) => result.success).length;
            let _failed = this.results[bench.getName()].filter((result) => !result.success).length;
            let _total  = this.results[bench.getName()].length;
            passed += _passed;
            failed += _failed;
            total  += _total;
            console.log(`${bold(`${bench.getName()}:`)} ${green(`${_passed} passed,`)} ${red(`${_failed} failed,`)} total ${_total}`);
        }
        console.log(`${bold("All Tests:")} ${green(`${passed} passed,`)} ${red(`${failed} failed,`)} total ${total}`);
        if (failed > 0) {
            process.exit(1);
        }
    }


}


// Wives, submit yourselves to your own husbands as you do to the Lord. For the
// husband is the head of the wife as Christ is the head of the church, his
// body, of which he is the Savior.
// - Ephesians 5:22-23
