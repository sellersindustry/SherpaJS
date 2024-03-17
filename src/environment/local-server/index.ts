import {
    IncomingMessage, ServerResponse,
    Server as HTTPServer, createServer
} from "http";


type handler = (request?:IncomingMessage, response?:ServerResponse) => Promise<undefined>|undefined;
type endpoint = {
    url:RegExp;
    handler:handler;
};


export class LocalServer {

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
            console.log(`SherpaJS Server is listening on port "${this.port}".`);
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
        return new RegExp(url.replace(/\[([^/]+?)\]/g, (_, segmentName) => {
            return `(?<${segmentName}>[^/]+)`
        }));
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

        await endpoint.handler(req, res);
    }


    private getEndpoint(url:string):endpoint|undefined {
        for (let endpoint of this.endpoints) {
            if (endpoint.url.test(url)) {
                return endpoint;
            }
        }
        return undefined;
    }


}

