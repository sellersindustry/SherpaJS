import { Files } from "../../files";
import { getExportedLoader } from "./index";


const DIRNAME = Files.unix(Files.getDirectory(import.meta.url));


describe("Tooling Default Export", () => {


	test("Non-Existent File", async () => {
        let file = Files.join(DIRNAME, "./tests/foo.ts");
		let res  = await getExportedLoader(file, "-");
        expect(res).not.toHaveProperty("module");
        expect(res.errors).toHaveLength(1);
    });


});
