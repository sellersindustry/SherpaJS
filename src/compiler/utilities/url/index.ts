

export class URLs {


    static getPathname(url:string):string {
        return this.getInstance(url).pathname;
    }


    static getSearchParams(url:string):URLSearchParams {
        return this.getInstance(url).searchParams;
    }


    private static getInstance(url:string):URL {
        // NOTE: a base url is required
        url = url.endsWith("/") ? url.slice(0, -1) : url;
        return new URL(`https://example.com${url}`);
    }

}

