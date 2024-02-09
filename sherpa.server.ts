import { NewServer } from "./dist/index";

export default NewServer({
    version: 1,
    app: {
        "/foo": {
            "/nice": {
                module: "./example-module",
                properties: {
                    food: "nice"
                }
            },
        }
    }
});