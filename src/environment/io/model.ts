
export enum Method {
    GET="GET",
    PUT="PUT",
    POST="POST",
    PATCH="PATCH",
    DELETE="DELETE"
}

export enum BodyType {
    JSON = "JSON",
    Text = "Text",
    None = "None"
}

export const CONTENT_TYPE:Record<BodyType, string|undefined> = {
    [BodyType.JSON]: "application/json",
    [BodyType.Text]: "text/plain",
    [BodyType.None]: undefined
}

export type Body = Record<string, any>|string|undefined;

export type Headers = Record<string, string>;

export type URLParameter    = string|number|boolean;
export type PathParameters  = { [key:string]:URLParameter };
export type QueryParameters = { [key:string]:URLParameter|URLParameter[] }

