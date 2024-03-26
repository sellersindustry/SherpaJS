import { SherpaJS } from "../../../../../../src/environment";

export default SherpaJS.Load.module({
    entry: "../../../../../modules/pass-primary-1",
    context: {
        test: "Hello World"
    }
});


