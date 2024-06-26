import { Path } from "../../path/index";
import { ExportLoaderType, getExportedLoader } from "./index";


const DIRNAME = Path.getDirectory(import.meta.url);


describe("Tooling Export Loader", () => {


	test("Non-Existent File", async () => {
        let file = Path.join(DIRNAME, "./tests/foo.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res).not.toHaveProperty("module");
        expect(res.logs).toHaveLength(1);
        expect(res.logs[0].text).toEqual("-- file not found.");
    });


    test("No Default Export", async () => {
        let file = Path.join(DIRNAME, "./tests/test1.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res).not.toHaveProperty("module");
        expect(res.logs).toHaveLength(1);
        expect(res.logs[0].text).toEqual("-- has no default export.");
    });


    test("No Import Module (1)", async () => {
        let file = Path.join(DIRNAME, "./tests/test2.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res).not.toHaveProperty("module");
        expect(res.logs).toHaveLength(1);
        expect(res.logs[0].text).toEqual("-- has invalid default export module.");
    });


    test("No Import Module (2)", async () => {
        let file = Path.join(DIRNAME, "./tests/test3.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res).not.toHaveProperty("module");
        expect(res.logs).toHaveLength(1);
        expect(res.logs[0].text).toEqual("-- has invalid default export module.");
    });


    test("Prototype Auto Detect", async () => {
        let file = Path.join(DIRNAME, "./tests/test4.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res.logs).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.file);
        expect(res.module?.filepath).toEqual("../../../../../../index");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("SherpaJS");
    });


    test("Prototype Namespace Auto Detect", async () => {
        let file = Path.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", ".New.module");
        expect(res.logs).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.package);
        expect(res.module?.filepath).toEqual("sherpa-core");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("Example");
    });


    test("Invalid Prototype Namespace Auto Detect", async () => {
        let file = Path.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", ".load");
        expect(res).not.toHaveProperty("module");
        expect(res.logs).toHaveLength(1);
        expect(res.logs[0].text).toEqual("-- has invalid default export module (prototype).");
    });


    test("Prototype Declared", async () => {
        let file = Path.join(DIRNAME, "./tests/test4.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS.New.module");
        expect(res.logs).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.file);
        expect(res.module?.filepath).toEqual("../../../../../../index");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("SherpaJS");
    });


    test("Invalid Prototype Declared", async () => {
        let file = Path.join(DIRNAME, "./tests/test4.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS.New");
        expect(res.logs).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.logs[0].text).toEqual("-- has invalid default export module (invoke).");
    });


    test("Invalid Prototype (Namespace) Declared", async () => {
        let file = Path.join(DIRNAME, "./tests/test4.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS2.New.module");
        expect(res.logs).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.logs[0].text).toEqual("-- has invalid default export module.");
    });


    test("Namespace Alias Auto Detect", async () => {
        let file = Path.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res.logs).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.package);
        expect(res.module?.filepath).toEqual("sherpa-core");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("Example");
    });


    test("Namespace Alias Declared", async () => {
        let file = Path.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS.New.module");
        expect(res.logs).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.package);
        expect(res.module?.filepath).toEqual("sherpa-core");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("Example");
    });


    test("Namespace Alias Declared with Source", async () => {
        let file = Path.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS.New.module", "sherpa-core");
        expect(res.logs).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.package);
        expect(res.module?.filepath).toEqual("sherpa-core");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("Example");
    });


    test("Invalid Alias Namespace Declared", async () => {
        let file = Path.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS2.New.module");
        expect(res.logs).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.logs[0].text).toEqual("-- has invalid default export module.");
    });


    test("Invalid Alias Prototype Declared", async () => {
        let file = Path.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS.New");
        expect(res.logs).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.logs[0].text).toEqual("-- has invalid default export module (invoke).");
    });


    test("Invalid Source", async () => {
        let file = Path.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS.New.module", "not-the-source");
        expect(res.logs).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.logs[0].text).toEqual("-- does not import from \"not-the-source\"");
    });


    test("Ignore Invalid Source Comment Flag", async () => {
        let file = Path.join(DIRNAME, "./tests/test6.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS.New.module", "sherpa-core");
        expect(res.logs).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("Example");
    });


    test("Type Generic", async () => {
        let file = Path.join(DIRNAME, "./tests/test7.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS.New.server", "sherpa-core");
        expect(res.logs).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("Example");
    });


    
});
