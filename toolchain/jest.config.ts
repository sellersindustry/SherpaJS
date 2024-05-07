import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
	verbose: true,
	roots: ["../"],
	transform: {
		"^.+\\.ts?$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	extensionsToTreatAsEsm: [".ts"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	testPathIgnorePatterns : ["../node_modules/", "../tests/endpoints/"],
};

export default config;
