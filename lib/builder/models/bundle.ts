import { DeveloperParamaters } from "./developer"
import { Endpoint, Module } from "./structure"


export type EndpointBundleParamaters = {
    endpoint:Endpoint,
    module:Module,
    server:any,
    output:string,
    dev?:DeveloperParamaters
}

