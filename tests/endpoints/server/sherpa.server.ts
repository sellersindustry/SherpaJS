// @SherpaJS IgnoreInvalidSource
import { SherpaJS } from "../../../index";


export default SherpaJS.New.server({
    context: {
        foo: "bar",
        exampleNum: 3,
        exampleBool: true,
        exampleArray: [1, 2, 3],
        deeperNested: {
            example: "foo"
        }
    }
});


