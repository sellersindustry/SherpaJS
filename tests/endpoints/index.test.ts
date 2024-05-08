import { Suite, BodyType, Method, equals } from "./suite/index.js";

// NOTE: Separate from Jest Tests executed by running `npm run test-server {host}`
const suite = new Suite("http://localhost:3000");


suite.test("Example 1", {
    method: Method.GET,
    path: "/regular"
}).expect((response) => {
    console.log(response.body);
    equals(response.bodyType, BodyType.JSON);
});


(async () => {
    suite.run();
})();
