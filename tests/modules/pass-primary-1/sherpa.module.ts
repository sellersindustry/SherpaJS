// @SherpaJS IgnoreInvalidSource
import { ContextSchema } from "../../../src/compiler/models";
import { SherpaJS } from "../../../src/environment/index";

export default SherpaJS.New.module({
    name: "pass-primary-1",
    interface: ContextSchema<{ test:string }>
});
