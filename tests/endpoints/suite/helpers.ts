// FIXME - Implement Testing Suite
//! WIP

export class Fail extends Error {
    constructor(message:string) {
        super(message);
    }
}


export function equals(expect:unknown, actual:unknown) {
    if (expect != actual) {
        throw new Fail(`Expected "${expect}" but got "${actual}"`);
    }
}


