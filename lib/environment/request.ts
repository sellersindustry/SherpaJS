
export type SherpaRequest = Request & {
    query:{[key:string]:string};
    params:{[key:string]:string};
};

