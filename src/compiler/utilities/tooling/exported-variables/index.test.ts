import { Path } from "../../path/index";
import { getExportedVariables } from "./index";


const DIRNAME = Path.getDirectory(import.meta.url);


describe("Tooling Exported Variables", () => {


	test("Non-Existent File", async () => {
        let file = Path.join(DIRNAME, "./tests/foo.ts");
		let res  = await getExportedVariables(file);
        expect(res).toEqual([]);
    });


    test("Standard Default Export", async () => {
        let file = Path.join(DIRNAME, "./tests/test1.ts");
		let res  = await getExportedVariables(file);
        expect(res).toEqual([{
            name: "default"
        }]);
    });


    test("Standard Single Export", async () => {
        let file = Path.join(DIRNAME, "./tests/test2.ts");
		let res  = await getExportedVariables(file);
        expect(res).toEqual([{
            name: "foo"
        }]);
    });


    test("Standard Multiple Export", async () => {
        let file = Path.join(DIRNAME, "./tests/test3.ts");
		let res  = await getExportedVariables(file);
        expect(res).toEqual([{ 
            name: "POST"
        }, {
            name: "GET"
        }, {
            name: "FOO"
        }]);
    });


});
