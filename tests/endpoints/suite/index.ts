// FIXME - Implement Testing Suite
//! WIP

//! export all from here

import { BodyType, Method } from "../../../index.js";
import { equals } from "./helpers.js";
import { Suite } from "./suite.js";


let suite = new Suite("http://localhost:3000");

suite.test("Example 1", {
    method: Method.GET,
    path: "/"
}).expect((response) => {
    equals(response.bodyType, BodyType.JSON);
});


(async () => {
    suite.run();
})();
