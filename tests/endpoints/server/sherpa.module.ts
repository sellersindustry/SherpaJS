// @SherpaJS IgnoreInvalidSource
import { CreateModuleInterface } from "../../../src/compiler/models";
import { SherpaJS } from "../../../index";


export default SherpaJS.New.module({
    name: "pass-primary-2",
    interface: CreateModuleInterface<{ test: boolean }>
});
