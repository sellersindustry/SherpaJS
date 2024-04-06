import { jest } from "@jest/globals";
jest.useFakeTimers();
import path from "path";
import { getDefaultExportInvokedJSModule } from "./index";


describe("Tooling Default Export", () => {


	test("Non-Existent File", async () => {
        let file = path.join(import.meta.dirname, "./tests/foo.ts");
		let res  = await getDefaultExportInvokedJSModule(file, "-");
        expect(res).not.toHaveProperty("module");
        expect(res.errors).toHaveLength(1);
    });


});

