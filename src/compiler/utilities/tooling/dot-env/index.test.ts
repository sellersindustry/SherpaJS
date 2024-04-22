import { Path } from "../../../utilities/path/index";
import { BundlerType } from "../../../models";
import { getEnvironmentVariables } from "./index";


const DIRNAME = Path.getDirectory(import.meta.url);


describe("Tooling Dot Environment", () => {


	test("Native Environment Variables", () => {
		process.env.Test = "example";
		let envVars = getEnvironmentVariables({
			input: "--",
			output: "--",
			bundler: BundlerType.local
		});
		expect(envVars).toHaveProperty("Test", "example");
    });


	test("Additional Environment Variables", () => {
		process.env.Test = "example";
		let envVars = getEnvironmentVariables({
			input: "--",
			output: "--",
			bundler: BundlerType.local,
			developer: {
				environment: {
					variables: {
						"TEST_2": "12foo-bar",
						"TEST_3": "true",
						"TEST_4": 123432,
						"TEST_5": "123432",
					}
				}
			}
		});
		expect(envVars).toHaveProperty("Test", "example");
		expect(envVars).toHaveProperty("TEST_2", "12foo-bar");
		expect(envVars).toHaveProperty("TEST_3", true);
		expect(envVars).toHaveProperty("TEST_4", 123432);
		expect(envVars).toHaveProperty("TEST_5", 123432);
    });


	test("Non-Existent Environment File", () => {
		process.env.Test12 = "Example12";
		process.env.Test13 = "Example13";
		let envVars = getEnvironmentVariables({
			input: "--",
			output: "--",
			bundler: BundlerType.local,
			developer: {
				environment: {
					variables: {
						"Test13": "OVERRIDE",
						"FOO": "BAR",
						"BAR": "43",
					},
					files: [ "/foo/test.env" ]
				}
			}
		});
		expect(envVars).toHaveProperty("Test12", "Example12");
		expect(envVars).toHaveProperty("Test13", "OVERRIDE");
		expect(envVars).toHaveProperty("FOO", "BAR");
		expect(envVars).toHaveProperty("BAR", 43);
    });


	test("Simple Environment File", () => {
		process.env.Test12 = "Example12";
		let envVars = getEnvironmentVariables({
			input: "--",
			output: "--",
			bundler: BundlerType.local,
			developer: {
				environment: {
					variables: {
						"FOO": "BAR"
					},
					files: [
						Path.join(DIRNAME, "./tests/test1.env")
					]
				}
			}
		});
		expect(envVars).toHaveProperty("Test12", "Example12");
		expect(envVars).toHaveProperty("FOO", "BAR");
		expect(envVars).toHaveProperty("SINGLE_VARIABLE", "value");
    });


	test("Simple Environment File Override", () => {
		let envVars = getEnvironmentVariables({
			input: "--",
			output: "--",
			bundler: BundlerType.local,
			developer: {
				environment: {
					variables: {
						"FOO": "BAR",
						"SINGLE_VARIABLE": "OVERRIDE"
					},
					files: [
						Path.join(DIRNAME, "./tests/test1.env"),
						Path.join(DIRNAME, "./tests/test2.env")
					]
				}
			}
		});
		expect(envVars).toHaveProperty("FOO", "BAR");
		expect(envVars).toHaveProperty("SINGLE_VARIABLE", "OVERRIDE");
		expect(envVars).toHaveProperty("VARIABLE_ONE", "value_1");
		expect(envVars).toHaveProperty("VARIABLE_TWO", "value_2");
    });


	test("Complex Environment File", () => {
		let envVars = getEnvironmentVariables({
			input: "--",
			output: "--",
			bundler: BundlerType.local,
			developer: {
				environment: {
					files: [
						Path.join(DIRNAME, "./tests/test3.env")
					]
				}
			}
		});
		expect(envVars).toHaveProperty("VARIABLE_ONE", 1);
		expect(envVars).toHaveProperty("VARIABLE_TWO", "string");
		expect(envVars).toHaveProperty("VARIABLE_THREE", false);
		expect(envVars).not.toHaveProperty("COMMENTED_OUT", "false");
    });

});

