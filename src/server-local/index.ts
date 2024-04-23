/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 19 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Local Server
 *
 */


import {
    IncomingMessage, ServerResponse,
    Server as HTTPServer, createServer
} from "http";
import { cyan, green, bold, magenta, gray, red } from "colorette"
import { OriginURL } from "../native/url/index.js";


type handler = (request?:IncomingMessage, response?:ServerResponse) => Promise<undefined>|undefined;
type endpoint = {
    url:RegExp;
    handler:handler;
};


export class ServerLocal {

    private port: number;
    private server: HTTPServer|null;
    private endpoints:endpoint[];

    
    constructor(port:number) {
        this.endpoints = [];
        this.port      = port;
        this.server    = null;
    }


    public start():void {
        if (this.server) {
            throw new Error("Server is already running");
        }

        this.server = createServer(this.handleRequest.bind(this));
        this.server.listen(this.port, () => {
            console.log(`${green("SherpaJS Server is started at")} ${cyan(`http://localhost:${bold(this.port)}`)}${green(".")}`);
        });
    }


    public stop():void {
        if (!this.server) {
            throw new Error("Server is not running");
        }

        this.server.close(() => {
            console.log("Server has stopped");
        });
        this.server = null;
    }


    public addRoute(url:string, handler:handler):void {
        this.endpoints.push({
            url: this.convertDynamicSegments(url),
            handler: handler
        });
    }


    private convertDynamicSegments(url:string):RegExp {
        return new RegExp("^/" + url.replace(/\[([^/]+?)\]/g, () => {
            return `([^/]+)`
        }) + "(/)?$");
    }


    private async handleRequest(req:IncomingMessage, res:ServerResponse):Promise<void> {
        let url = req.url;
        if (!url) {
            res.writeHead(400);
            res.end();
            return;
        }

        let endpoint = this.getEndpoint(url);
        if (!endpoint) {
            res.writeHead(404);
            res.end();
            return;
        }

        let startTime = Date.now();
        await endpoint.handler(req, res);
        let deltaTime = Date.now() - startTime;
        let method = req.method ? req.method.toUpperCase() : "UNKNOWN";
        console.log(`${magenta(method)} ${req.url} ${res.statusCode} ${gray("in")} ${red(deltaTime)}${red("ms")}`);
    }


    private getEndpoint(url:string):endpoint|undefined {
        let _url = new OriginURL(url).pathname;
        for (let endpoint of this.endpoints) {
            if (endpoint.url.test(_url)) {
                return endpoint;
            }
        }
        return undefined;
    }


}


// Whoever has the Son has life; whoever does not have the Son of God does
// not have life.
// - 1 John 5:12
