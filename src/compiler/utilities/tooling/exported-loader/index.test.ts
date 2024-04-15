import { Files } from "../../files";
import { ExportLoaderType, getExportedLoader } from "./index";


const DIRNAME = Files.unix(Files.getDirectory(import.meta.url));


describe("Tooling Export Loader", () => {


	test("Non-Existent File", async () => {
        let file = Files.join(DIRNAME, "./tests/foo.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res).not.toHaveProperty("module");
        expect(res.errors).toHaveLength(1);
        expect(res.errors[0].text).toEqual("-- file not found.");
    });


    test("No Default Export", async () => {
        let file = Files.join(DIRNAME, "./tests/test1.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res).not.toHaveProperty("module");
        expect(res.errors).toHaveLength(1);
        expect(res.errors[0].text).toEqual("-- has no default export.");
    });


    test("No Import Module (1)", async () => {
        let file = Files.join(DIRNAME, "./tests/test2.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res).not.toHaveProperty("module");
        expect(res.errors).toHaveLength(1);
        expect(res.errors[0].text).toEqual("-- has invalid default export module.");
    });


    test("No Import Module (2)", async () => {
        let file = Files.join(DIRNAME, "./tests/test3.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res).not.toHaveProperty("module");
        expect(res.errors).toHaveLength(1);
        expect(res.errors[0].text).toEqual("-- has invalid default export module.");
    });


    test("Namespace Auto Detect", async () => {
        let file = Files.join(DIRNAME, "./tests/test4.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res.errors).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.file);
        expect(res.module?.filepath).toEqual("../../../../../../index");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("SherpaJS");
    });


    test("Namespace Declared", async () => {
        let file = Files.join(DIRNAME, "./tests/test4.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS", "New.module");
        expect(res.errors).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.file);
        expect(res.module?.filepath).toEqual("../../../../../../index");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("SherpaJS");
    });


    test("Invalid Namespace Declared", async () => {
        let file = Files.join(DIRNAME, "./tests/test4.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS2", "New.module");
        expect(res.errors).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.errors[0].text).toEqual("-- has invalid default export module.");
    });


    test("Invalid Prototype Declared", async () => {
        let file = Files.join(DIRNAME, "./tests/test4.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS", "New");
        expect(res.errors).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.errors[0].text).toEqual("-- has invalid default export module (invoke).");
    });


    test("Namespace Alias Auto Detect", async () => {
        let file = Files.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--");
        expect(res.errors).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.file);
        expect(res.module?.filepath).toEqual("../../../../../../index");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("Example");
    });


    test("Namespace Alias Declared", async () => {
        let file = Files.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS", "New.module");
        expect(res.errors).toHaveLength(0);
        expect(res).toHaveProperty("module");
        expect(res.module?.type).toEqual(ExportLoaderType.file);
        expect(res.module?.filepath).toEqual("../../../../../../index");
        expect(res.module?.namespace).toEqual("SherpaJS");
        expect(res.module?.binding).toEqual("Example");
    });


    test("Invalid Alias Namespace Declared", async () => {
        let file = Files.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS2", "New.module");
        expect(res.errors).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.errors[0].text).toEqual("-- has invalid default export module.");
    });


    test("Invalid Alias Prototype Declared", async () => {
        let file = Files.join(DIRNAME, "./tests/test5.ts");
		let res  = await getExportedLoader(file, "--", "SherpaJS", "New");
        expect(res.errors).toHaveLength(1);
        expect(res).not.toHaveProperty("module");
        expect(res.errors[0].text).toEqual("-- has invalid default export module (invoke).");
    });


});
