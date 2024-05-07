// @SherpaJS IgnoreInvalidSource
import { SherpaJS, CreateModuleInterface } from "../../../../index";

export default SherpaJS.New.module({
    name: "pass-primary-2",
    interface: CreateModuleInterface<{ test: boolean }>
});
