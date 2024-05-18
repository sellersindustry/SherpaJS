function makeValidator(schema:unknown) {
    return schema as (data:unknown) => {};
}

//! Transition to other branch

import { Response } from "../../../../../index.js";
const validateFoo = makeValidator(import("../../src/foo.schema.json"));



export function GET() {
    const ok = validateFoo({ foo: true })
    if (!ok) {
        return Response.JSON(validateFoo.errors)
    }
    return Response.text("OK");
}

