// FIXME - Add Headers + Footers

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


export function includes(buffer:string, searchString:string) {
    if (!buffer.includes(searchString)) {
        throw new Fail(`Expected "${buffer.slice(0, 10)}..." to include "${searchString}"`);
    }
}

