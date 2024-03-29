import { ContextSchema } from "../../../src/compiler/models";
import { SherpaJS } from "../../../src/environment/index";

export default SherpaJS.New.module({
    name: "pass-primary-2",
    interface: ContextSchema<{ test: boolean }>
});
