var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/compiler/models.js
var Method;
(function(Method3) {
  Method3["GET"] = "GET";
  Method3["PUT"] = "PUT";
  Method3["POST"] = "POST";
  Method3["PATCH"] = "PATCH";
  Method3["DELETE"] = "DELETE";
})(Method || (Method = {}));
var BundlerType;
(function(BundlerType2) {
  BundlerType2["Vercel"] = "Vercel";
  BundlerType2["Local"] = "Local";
})(BundlerType || (BundlerType = {}));

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/io/model.js
var BodyType;
(function(BodyType3) {
  BodyType3["JSON"] = "JSON";
  BodyType3["Text"] = "Text";
  BodyType3["None"] = "None";
})(BodyType || (BodyType = {}));
var CONTENT_TYPE = {
  [BodyType.JSON]: "application/json",
  [BodyType.Text]: "text/plain",
  [BodyType.None]: void 0
};

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/io/response/status-text.js
var STATUS_TEXT = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot \u{1FAD6}",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required"
};

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/io/response/index.js
var DEFAULT_OPTIONS = {
  headers: {},
  status: 200
};
var Response = class _Response {
  static new(options) {
    let _options = _Response.defaultOptions(BodyType.None, options);
    return {
      status: _options.status,
      statusText: _Response.getStatusText(_options.status),
      headers: _options.headers,
      redirect: void 0,
      body: void 0,
      bodyType: BodyType.None
    };
  }
  static text(text, options) {
    let _options = _Response.defaultOptions(BodyType.Text, options);
    return {
      status: _options.status,
      statusText: _Response.getStatusText(_options.status),
      headers: _options.headers,
      redirect: void 0,
      body: text,
      bodyType: BodyType.Text
    };
  }
  static JSON(JSON2, options) {
    let _options = _Response.defaultOptions(BodyType.JSON, options);
    return {
      status: _options.status,
      statusText: _Response.getStatusText(_options.status),
      headers: _options.headers,
      redirect: void 0,
      body: JSON2,
      bodyType: BodyType.JSON
    };
  }
  static redirect(redirect, options) {
    let _options = _Response.defaultOptions(BodyType.None, options);
    return {
      status: 302,
      statusText: _Response.getStatusText(302),
      headers: _options.headers,
      redirect,
      body: void 0,
      bodyType: BodyType.None
    };
  }
  static defaultOptions(bodyType, options) {
    let _options = {
      ...DEFAULT_OPTIONS,
      ...options
    };
    _options["header"] = {
      "Content-Type": CONTENT_TYPE[bodyType],
      ..._options["header"]
    };
    return _options;
  }
  static getStatusText(status) {
    let text = STATUS_TEXT[status];
    if (!text) {
      throw new Error(`Status code "${status}" is invalid.`);
    }
    return text;
  }
};

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/local-server/index.js
var import_http = require("http");

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/compiler/utilities/url/index.js
var URLs = class {
  static getPathname(url) {
    return this.getInstance(url).pathname;
  }
  static getSearchParams(url) {
    return this.getInstance(url).searchParams;
  }
  static getInstance(url) {
    url = url.endsWith("/") ? url.slice(0, -1) : url;
    return new URL(`https://example.com${url}`);
  }
};

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/local-server/index.js
var LocalServer = class {
  port;
  server;
  endpoints;
  constructor(port2) {
    this.endpoints = [];
    this.port = port2;
    this.server = null;
  }
  start() {
    if (this.server) {
      throw new Error("Server is already running");
    }
    this.server = (0, import_http.createServer)(this.handleRequest.bind(this));
    this.server.listen(this.port, () => {
      console.log(`SherpaJS Server is listening on port "${this.port}".`);
    });
  }
  stop() {
    if (!this.server) {
      throw new Error("Server is not running");
    }
    this.server.close(() => {
      console.log("Server has stopped");
    });
    this.server = null;
  }
  addRoute(url, handler) {
    this.endpoints.push({
      url: this.convertDynamicSegments(url),
      handler
    });
  }
  convertDynamicSegments(url) {
    return new RegExp("^/" + url.replace(/\[([^/]+?)\]/g, (_, segmentName) => {
      return `(?<${segmentName}>[^/]+)`;
    }) + "$");
  }
  async handleRequest(req, res) {
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
  getEndpoint(url) {
    let _url = URLs.getPathname(url);
    for (let endpoint of this.endpoints) {
      if (endpoint.url.test(_url)) {
        return endpoint;
      }
    }
    return void 0;
  }
};

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/io/request/transformer.js
var RequestTransform = class _RequestTransform {
  static async Local(req, segments) {
    if (!req.url || !req.method) {
      throw new Error("Missing URL and Methods");
    }
    let { body, bodyType } = await _RequestTransform.parseBodyLocal(req);
    return {
      url: URLs.getPathname(req.url),
      params: {
        path: _RequestTransform.parseParamsPath(req.url, segments),
        query: _RequestTransform.parseParamsQuery(req.url)
      },
      method: req.method.toUpperCase(),
      headers: _RequestTransform.parseHeader(req.headers),
      body,
      bodyType
    };
  }
  static Vercel() {
    return {
      url: "",
      params: {
        path: {},
        query: {}
      },
      method: Method.DELETE,
      headers: {},
      body: "",
      bodyType: BodyType.Text
    };
  }
  static parseBodyLocal(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      let bodyType = BodyType.Text;
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const contentType = req.headers["content-type"];
        if (!contentType || body == "") {
          resolve({
            body: void 0,
            bodyType: BodyType.None
          });
        }
        if (contentType == "application/json") {
          body = JSON.parse(body);
          bodyType = BodyType.JSON;
        }
        resolve({
          body,
          bodyType
        });
      });
      req.on("error", (error) => {
        resolve({ body: void 0, bodyType: BodyType.None });
      });
    });
  }
  static parseHeader(headers) {
    let _headers = {};
    Object.keys(headers).forEach((key) => {
      _headers[key] = headers[key];
    });
    return _headers;
  }
  static parseParamsPath(url, segments) {
    let params = {};
    url.split("/").filter((o) => o != "").forEach((value, index) => {
      if (segments[index].isDynamic) {
        let key = segments[index].name;
        let _value = _RequestTransform.parseParam(value);
        if (params[key]) {
          if (Array.isArray(params[key])) {
            params[key].push(_value);
          } else {
            params[key] = [params[key], _value];
          }
        } else {
          params[key] = _value;
        }
      }
    });
    return params;
  }
  static parseParamsQuery(url) {
    let params = {};
    URLs.getSearchParams(url).forEach((value, key) => {
      let _value = _RequestTransform.parseParam(value);
      if (params[key]) {
        if (Array.isArray(params[key])) {
          params[key].push(_value);
        } else {
          params[key] = [params[key], _value];
        }
      } else {
        params[key] = _value;
      }
    });
    return params;
  }
  static parseParam(value) {
    if (value == "true") {
      return true;
    } else if (value == "false") {
      return false;
    } else if (/^\d+$/.test(value)) {
      return parseInt(value);
    }
    return value;
  }
};

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/io/response/transform.js
var ResponseTransform = class {
  static Local(response, nativeResponse) {
    nativeResponse.statusCode = response.status;
    nativeResponse.statusMessage = response.statusText;
    for (let [key, value] of Object.entries(response.headers)) {
      nativeResponse.setHeader(key, value);
    }
    if (response.bodyType != BodyType.None && !nativeResponse.hasHeader("Content-Type")) {
      nativeResponse.setHeader("Content-Type", CONTENT_TYPE[response.bodyType]);
    }
    if (response.redirect) {
      nativeResponse.setHeader("Location", response.redirect);
    }
    let body = void 0;
    switch (response.bodyType) {
      case BodyType.Text:
        body = response.body;
        break;
      case BodyType.JSON:
        body = JSON.stringify(response.body);
        break;
    }
    nativeResponse.end(body);
  }
  static Vercel(response) {
  }
};

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/handler/index.js
async function Handler(endpoints, context, request) {
  let callback = endpoints[request.method];
  if (callback) {
    try {
      let response = await callback(request, context);
      if (!response) {
        return Response.new({ status: 200 });
      }
      return response;
    } catch (error) {
      return Response.text(error.message, { status: 500 });
    }
  } else {
    return Response.new({ status: 405 });
  }
}

// /Users/sellerew/Desktop/libraries/sherpa-core/dist/src/environment/index.js
var __internal__ = {
  RequestTransform,
  ResponseTransform,
  LocalServer,
  Handler
};

// /Users/sellerew/Desktop/libraries/sherpa-core/test/test2/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  GET: () => GET,
  POST: () => POST
});

// /Users/sellerew/Desktop/libraries/sherpa-core/src/environment/instantiate/index.ts
var New2 = class {
  static server(config) {
    return config;
  }
  static module(config) {
    return config;
  }
};
var Load2 = class {
  //! FIXME - Load.module<boolean>("", true);
  //! Consider this when writing docs and making context checker
  static module(module2) {
    return module2;
  }
};

// /Users/sellerew/Desktop/libraries/sherpa-core/src/environment/io/model.ts
var CONTENT_TYPE2 = {
  ["JSON" /* JSON */]: "application/json",
  ["Text" /* Text */]: "text/plain",
  ["None" /* None */]: void 0
};

// /Users/sellerew/Desktop/libraries/sherpa-core/src/environment/io/response/status-text.ts
var STATUS_TEXT2 = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot \u{1FAD6}",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required"
};

// /Users/sellerew/Desktop/libraries/sherpa-core/src/environment/io/response/index.ts
var DEFAULT_OPTIONS2 = {
  headers: {},
  status: 200
};
var Response2 = class _Response {
  static new(options) {
    let _options = _Response.defaultOptions("None" /* None */, options);
    return {
      status: _options.status,
      statusText: _Response.getStatusText(_options.status),
      headers: _options.headers,
      redirect: void 0,
      body: void 0,
      bodyType: "None" /* None */
    };
  }
  static text(text, options) {
    let _options = _Response.defaultOptions("Text" /* Text */, options);
    return {
      status: _options.status,
      statusText: _Response.getStatusText(_options.status),
      headers: _options.headers,
      redirect: void 0,
      body: text,
      bodyType: "Text" /* Text */
    };
  }
  static JSON(JSON2, options) {
    let _options = _Response.defaultOptions("JSON" /* JSON */, options);
    return {
      status: _options.status,
      statusText: _Response.getStatusText(_options.status),
      headers: _options.headers,
      redirect: void 0,
      body: JSON2,
      bodyType: "JSON" /* JSON */
    };
  }
  static redirect(redirect, options) {
    let _options = _Response.defaultOptions("None" /* None */, options);
    return {
      status: 302,
      statusText: _Response.getStatusText(302),
      headers: _options.headers,
      redirect,
      body: void 0,
      bodyType: "None" /* None */
    };
  }
  static defaultOptions(bodyType, options) {
    let _options = {
      ...DEFAULT_OPTIONS2,
      ...options
    };
    _options["header"] = {
      "Content-Type": CONTENT_TYPE2[bodyType],
      ..._options["header"]
    };
    return _options;
  }
  static getStatusText(status) {
    let text = STATUS_TEXT2[status];
    if (!text) {
      throw new Error(`Status code "${status}" is invalid.`);
    }
    return text;
  }
};

// /Users/sellerew/Desktop/libraries/sherpa-core/src/environment/index.ts
var SherpaJS = {
  New: New2,
  Load: Load2
};

// /Users/sellerew/Desktop/libraries/sherpa-core/test/test2/routes/index.ts
function GET(request, context) {
  return Response2.JSON({
    context: context.test
  });
}
function POST(request, context) {
  return Response2.JSON({
    bodyType: request.bodyType,
    body: request.body,
    query: request.params,
    url: request.url
  });
}

// /Users/sellerew/Desktop/libraries/sherpa-core/test/test1/routes/module/index.ts
var module_default = SherpaJS.Load.module({
  entry: "../../../test2",
  context: {
    test: "Hello World"
  }
});

// /Users/sellerew/Desktop/libraries/sherpa-core/test/test2/routes/[id]/path1/index.ts
var path1_exports = {};
__export(path1_exports, {
  GET: () => GET2
});
function GET2(request, context) {
}

// /Users/sellerew/Desktop/libraries/sherpa-core/test/test2/routes/[id]/path2/index.ts
var path2_exports = {};
__export(path2_exports, {
  GET: () => GET3,
  POST: () => POST2
});
function GET3(request, context) {
  return Response2.JSON({
    bodyType: request.bodyType,
    body: request.body,
    query: request.params,
    url: request.url
  });
}
function POST2(request, context) {
  return Response2.text("foo");
}

// /Users/sellerew/Desktop/libraries/sherpa-core/test/test1/routes/regular/index.ts
var regular_exports = {};
__export(regular_exports, {
  GET: () => GET4
});
function GET4(request, context) {
  return Response2.JSON({ test: 2, context }, { status: 201 });
}

// /Users/sellerew/Desktop/libraries/sherpa-core/test/test1/sherpa.server.ts
var sherpa_server_default = SherpaJS.New.server({
  context: "foo"
});

// <stdin>
var portArg = process.argv[2];
var port = portArg && !isNaN(parseInt(portArg)) ? parseInt(portArg) : 3e3;
var server = new __internal__.LocalServer(port);
var context_0 = module_default.context;
var segments_0 = [{ "name": "module", "isDynamic": false }];
var url_0 = "module";
server.addRoute(url_0, async (nativeRequest, nativeResponse) => {
  let req = await __internal__.RequestTransform.Local(nativeRequest, segments_0);
  let res = await __internal__.Handler(routes_exports, context_0, req);
  __internal__.ResponseTransform.Local(res, nativeResponse);
});
var context_1 = module_default.context;
var segments_1 = [{ "name": "module", "isDynamic": false }, { "name": "id", "isDynamic": true }, { "name": "path1", "isDynamic": false }];
var url_1 = "module/[id]/path1";
server.addRoute(url_1, async (nativeRequest, nativeResponse) => {
  let req = await __internal__.RequestTransform.Local(nativeRequest, segments_1);
  let res = await __internal__.Handler(path1_exports, context_1, req);
  __internal__.ResponseTransform.Local(res, nativeResponse);
});
var context_2 = module_default.context;
var segments_2 = [{ "name": "module", "isDynamic": false }, { "name": "id", "isDynamic": true }, { "name": "path2", "isDynamic": false }];
var url_2 = "module/[id]/path2";
server.addRoute(url_2, async (nativeRequest, nativeResponse) => {
  let req = await __internal__.RequestTransform.Local(nativeRequest, segments_2);
  let res = await __internal__.Handler(path2_exports, context_2, req);
  __internal__.ResponseTransform.Local(res, nativeResponse);
});
var context_3 = sherpa_server_default.context;
var segments_3 = [{ "name": "regular", "isDynamic": false }];
var url_3 = "regular";
server.addRoute(url_3, async (nativeRequest, nativeResponse) => {
  let req = await __internal__.RequestTransform.Local(nativeRequest, segments_3);
  let res = await __internal__.Handler(regular_exports, context_3, req);
  __internal__.ResponseTransform.Local(res, nativeResponse);
});
server.start();
//! NOTE: in the future you might want to validate the response
// Generated by SherpaJS
