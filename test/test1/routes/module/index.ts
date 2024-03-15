import { SherpaJS } from "../../../../src/environment";

export default SherpaJS.Load.module({
    entry: "../../../test2",
    context: {
        test: "Hello World"
    }
});


