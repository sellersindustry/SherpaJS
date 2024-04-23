// @SherpaJS IgnoreInvalidSource
import { SherpaJS as Example } from "../../../../../../index";

type foo = { bar: string };

export default Example.New.server<foo>({
    context: {
        bar: "foo"
    }
});
