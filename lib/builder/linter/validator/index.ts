

const ALPHA_NUMERIC_DASH = /^[a-zA-Z0-9-]+$/;


export class Validate {


    public static AlphaNumericDash(value:string):boolean {
        return ALPHA_NUMERIC_DASH.test(value);
    }

}

