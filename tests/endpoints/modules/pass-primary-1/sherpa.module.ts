// @SherpaJS IgnoreInvalidSource
import { SherpaJS, CreateModuleInterface } from "../../../../index";

export default SherpaJS.New.module({
    name: "pass-primary-1",
    interface: CreateModuleInterface<{ test:string }>
});
