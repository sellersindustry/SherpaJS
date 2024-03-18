import { SherpaJS } from "../../src/environment/index";

export default SherpaJS.New.module({
    name: "foo"
});

export type ContextSchema = {
    test: boolean
};
