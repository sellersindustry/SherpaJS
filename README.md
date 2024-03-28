![](./logo.png)

# SherpaJS - Serverless Web Framework 
![NPM Version](https://img.shields.io/npm/v/sherpa-core)
[![Node.js Package](https://github.com/sellersindustry/SherpaJS/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/sellersindustry/SherpaJS/actions/workflows/npm-publish.yml)


> [!IMPORTANT]
> This project is in early development, so it is possible for you to run into issues. If you run into any issues please just create a new issue and link your code. Feel free to debug or update the code!
> 
> - If you have an issue, [let us know](https://github.com/sellersindustry/SherpaJS/issues), even if you fix it. It could help us build a better linter.
> - If the documentation is confusing some place, [ask](https://github.com/sellersindustry/SherpaJS/issues). Also feel free to make a pull request with the updates.
> - Have a suggested change or feature? [Submit a Ticket](https://github.com/sellersindustry/SherpaJS/issues)
> - Need a module that isn't built? Please help us build the SherpaJS Community and built it following our [build guide](#create-a-module), then [submit your module to the community](https://github.com/sellersindustry/SherpaJS/issues).
> 
> [Development Notes](#development)


SherpaJS empowers developers to effortlessly construct <ins>**modular and agnostic serverless web framework**</ins>. Developers can easily build serverless web server using a directory-based structure, inspired by NextJS and even import pre-built modules at endpoints. SherpaJS servers can then be compiled to a variety of different web platforms including Vercel Serverless and local Server (with more to come later).


## Table of Contents
 - [Supported Platforms](#deploy-a-server)
 - [Community Modules](#community-modules)
 - [Installation](#installation)
 - [Commands](#commands)
 - [Servers](#servers)
    - [Create a Server](#creating-a-server)
    - [Configuration](#server-configuration)
    - [Deploy a Server](#deploy-a-server)
 - [Endpoints & Routes](#routes--endpoints)
 - [Modules](#modules)
    - [Create a Module](#creating-a-module)
    - [Configuration](#module-configuration)
 - [Development & Contributing](#development)


<br>
<br>


## Community Modules
| Module | Description | Developer |
|---|---|---|
| [Static Flags](https://github.com/sellersindustry/SherpaJS-static-flags) | Create static flags of booleans, strings, or numbers | [Sellers Industries](https://github.com/sellersindustry) |
| [Events](https://github.com/sellersindustry/SherpaJS-events) | Create event sending endpoints for analytics platforms like PostHog using [Metadapter Events](https://github.com/sellersindustry/metadapter-event) | [Sellers Industries](https://github.com/sellersindustry) |

<br>
<br>


## Installation
To install SherpaJS, simply run the following command in your terminal:
```bash
npm install sherpa-core -g
```
This command will globally install the SherpaJS core package, enabling you to utilize its features across your system. Once installed, you can easily run the SherpaJS command-line interface (CLI) using the following command:
```bash
npx sherpa
```
This command initializes the SherpaJS CLI, allowing you to efficiently manage and configure your modular microservice endpoints. [Learn about CLI Commands](#commands).


<br>
<br>


## Commands
CLI for SherpaJS - Modular Microservices Framework

```bash
sherpa [options] [command]
```

#### Options:
 - `-V`, `--version` output the version number
 - `-h`, `--help` display help for command

#### Commands:
 - `build [options]` Build SherpaJS Server
 - `help [command]` display help for command


<br>


### Build Command
Build SherpaJS Server.
```bash
sherpa build [options]
```

#### Options:
 - `-i`, `--input <path>` path to SherpaJS server, defaults to current directory
 - `-o`, `--output <path>` path to server output, defaults to input directory
  - `-b`, `--bundler <type>` platform bundler ("**Vercel**", "*local**", *default: "local"*)
 - `--dev` enable development mode, does not minify output
 - `-h`, `--help` display help for command


<br>
<br>


## Servers
A SherpaJS server is a backend web server framework, akin to Flask, primarily
designed for creating serverless applications, offering developers a
lightweight and modular approach to building scalable backend services in JavaScript.

### Creating a Server
Creating a new server is extremely easy and can be done within a couple of
minutes. Check out the [SherpaJS Server Template](https://github.com/sellersindustry/SherpaJS-template-server)
for an example of how to build your server.

#### Step 1
Setup a new NodeJS project with `npm init`.

#### Step 2
Install SherpaJS with `npm install sherpa-core`.

#### Step 3
Create a new server configuration file in the root directory of your server name `sherpa.server.ts`. This file will default export a [server configuration](#server-configuration).

```typescript
// sherpa.server.ts
import { SherpaJS } from "sherpa-core";

export default SherpaJS.New.server({
    context: { // contexts are provided to endpoints, and are optional
        example: "foo"
    }
});
```

#### Step 4
Create an your endpoints in the `/routes` directory. See an example below or [learn about endpoints](#routes--endpoints).

```typescript
// ./routes/index.ts
import { Request, Response, Context } from "sherpa-core";

export function GET(request:Request, context:Context) {
    return Response.text("Hello World!");
}
```

> [!NOTE]
> It's here where you can load pre-build SherpaJS modules and provide them with context.
> [Loading Modules](#module-endpoint)


#### Step 6
Build the local server with `sherpa build` [command](#build-command). This
will create a NodeJS file at `./.sherpa/index.js` which you can start at using
`node ./.sherpa/index.js` see [local server platform](#local-server) for additional information.

That's it! You're now ready to start building powerful serverless web
applications with SherpaJS. Happy coding! ⚓


<br>


### Server Config
Sherpa servers are configured using a `sherpa.server.ts` file, where you define
the structure and behavior of your server. This configuration file serves as
the entry point for your Sherpa server.


#### Config File
The file must located at `sherpa.server.ts` and have a default export of the
config and use the `SherpaJS.New.server` function as follows:
```typescript
import SherpaJS from "sherpa-core";

export default SherpaJS.New.server();
```

#### Config Structure
 - **Context:** An optional property that allows you to define a context
    object. Contexts are provided to endpoints and can contain any
    additional data or settings needed for request processing.

The configuration provided to the server must match the TypeScript object as follows:
```typescript
export type Context = unknown;

export type ServerConfig = {
    context?: Context;
};
```

#### Example Config
```typescript
// sherpa.server.ts
import { SherpaJS } from "sherpa-core";

export default SherpaJS.New.server({
    context: {
        serverSecret: "foo",
        allowThingy: true
    }
});
```

<br>


### Deploy a Server
SherpaJS can compile to various different web platforms, with more to come later. [Want to support a new framework? Submit a Ticket](https://github.com/sellersindustry/SherpaJS/issues). See the [build command](#build-command) to compile to each platform.


#### Vercel Serverless
Building to Vercel will generate a Vercel serverless server in the `.vercel` directory relative to your output. When your SherpaJS server repository is deployed Vercel this folder will automatically be deployed. Ensure your build command is set to build SherpaJS with the Vercel bundler.


#### Local Server
Building to local server will generate a NodeJS server, that utilizes the built in HTTP service. This server will be located at the `.sherpa/index.js` relative to your output. By default the port number is `3000` but you can provide an different port number with an argument `node ./.sherpa/index.js 5000`.


<br>
<br>


## Routes & Endpoints


## Routes
Routes in SherpaJS provide a flexible and intuitive way to define
[endpoints](#endpoints) and handle incoming requests within your microservice
architecture. Drawing inspiration from Next.js, SherpaJS routes follow a
directory-based structure located in the `/routes` directory of your module.


### Structure of Routes
In the `/routes` directory, you can create additional directories to organize
your routes. For instance, you might have a directory like `/example`, which
contains specific endpoints related to a particular feature or functionality.
Each endpoint within a route is represented by a file named `index.ts`.

Subroutes are located relative to the modules. For example if an endpoint is
defined in a module at `/example` and the module is loaded at `/app-1/foo` then
the example endpoint will be accessed at `/app-1/foo/example`.

### Dynamic Routes
To define a dynamic route, simply name a directory using square brackets, such
as `[id]`. Within a dynamic route directory, you can access the parameter value
from the request object in your endpoint logic. For example, if you have a
dynamic route named `[id]`, you can access the parameter using
`request.params.path.get("id")`, to learn more see [endpoint requests](#requests).

### Examples of Route Structures
```less
/routes
│
├── /users
│   └── index.ts     // Endpoint logic for "/users"
│
├── /posts
│   └── index.ts     // Endpoint logic for "/posts"
│
├── /auth
│   └── index.ts     // Endpoint logic for "/auth"

```

```less
/routes
│
├── /example
│   ├── index.ts     // Endpoint logic for "/example"
│   ├── /subroute
│       └── index.ts // Endpoint logic for "/example/subroute"
│
├── /[id]
│   └── index.ts     // Endpoint logic for "/[id]" access "[id]" with request.params.path.get("id")
```

```less
/routes
│
├── /products
│   ├── index.ts     // Endpoint logic for "/products"
│   ├── /[productID]
│   │   └── index.ts // Endpoint logic for "/products/[productID]" access "[productID]" with request.params.path.get("productID")
│   │
│   └── /category
│       └── index.ts // Endpoint logic for "/products/category"

```


<br>


## Endpoints
Endpoints represent the individual points of access within your microservice
architecture, allowing clients to interact with specific functionalities or
resources. Endpoints are defined within route files `index.ts` and are
associated with specific HTTP methods (GET, POST, PATCH, PUT, DELETE) to
perform corresponding actions.

### Regular Endpoint
Each endpoint is defined within a route file using the corresponding
HTTP method function. These functions provide access to the incoming request
and the environment, allowing developers to customize the endpoint's behavior
based on the request data and the server environment.

Endpoint can be defined by exporting a function with the desired method name.
The following HTTP methods are supported: `GET`, `POST`, `PATCH`, `PUT`, and
`DELETE`.

Endpoint functions receive two parameters: the [request](#requests) which
contains the HTTP request information and the [context](#context) which is
additional properties provided to configure the endpoint. The context is either
provided by the [server configuration](#server-config), if it's the root route
or the [module loader](#module-endpoint), if it's a module route.

A response should be returned by the function, using the
[SherpaJS Response utility](#response).

```typescript
import { Request, Context, Response } from "sherpa-core";

// Example GET endpoint
export function GET(request:Request, context:Context) {
    return Response.text("Hello World");
}

// Example POST endpoint
export function POST(request:Request, env:Environment) {
    return Response.text("Example POST", { status: 201 });
}

// Example DELETE endpoint
export function DELETE(request:Request, env:Environment) {
    return Response.JSON({ message: "DELETE request received" }, { status: 204 });
}
```


### Module Endpoint
SherpaJS allows endpoint modules to be loaded, which is a set of endpoints
built by the [community](#community-modules) or [your self](#creating-a-module).
By integrating these prebuilt modules which can range from authentication to
analytics into your server, you can easily extend your server's
functionality without duplicating code. This promotes code organization,
modularity, and reusability, simplifying development and accelerating
time-to-market for your web applications.

Modules are loaded in the same endpoint file (`index.ts`) as a regular endpoint,
but instead of export HTTP methods you export a loaded module. Simply use the
module loader provided `SherpaJS.Load.module`.

Provide the loader an entry point for the module, this should be the root
directory of the module. This entry point can either be a relative directory
or a NPM package name. Optionally you can also provide context to the module.
The module your loading may require a context with specific properties so
please adhere to the modules requirements.

```typescript
// index.ts
import { SherpaJS } from "sherpa-core";

export default SherpaJS.Load.module({
    entry: "../modules/pass-primary-1",
    context: {
        test: "Hello World"
    }
});
```

You can also provide the module loader with context schema as exported by the
module. This is completely optional and we will verify the schema regardless
but it could be helpful.
```typescript
// index.ts
import { SherpaJS } from "sherpa-core";
import { ContextSchema } from "../modules/pass-primary-1/sherpa.module.ts";

export default SherpaJS.Load.module<ContextSchema>({
    entry: "../modules/pass-primary-1",
    context: {
        test: "Hello World"
    }
});
```


### Requests
The request as a typescript type. Parameters are parsed are parsed as the types
they are provided as and if multiple are provided as an array.

```typescript
enum BodyType {
    JSON = "JSON",
    Text = "Text",
    None = "None"
}

type Body = Record<string, any>|string|undefined;

interface Request {
    readonly url:string;
    readonly params:{ path:Parameters, query:Parameters };
    readonly method:keyof typeof Method;
    readonly headers:Headers;
    readonly body:Body;
    readonly bodyType:keyof typeof BodyType;
}
```

#### Request Example
 - `doc/abc/def/page/2?thing1=foo,bar&thing2=true&thing2=false&thing3=4`
 - `doc/[testID]/[testID]/page/[pageID]`
 - `request.params.path.get("testID")` ➜ `"abc"`
 - `request.params.path.getAll("testID")` ➜ `[ "abc", "def" ]`
 - `request.params.path.has("testID")` ➜ `true`
 - `request.params.path.keys()` ➜ `[ "testID", "pageID" ]`
```json
{
    "url": "/regular/dynamic-paths/abc/def/page/2",
    "params": {
        "path": {
            "testID": [ "abc", "def" ],
            "pageID": [ 2 ]
        },
        "query": {
            "thing1": [ "foo", "bar" ],
            "thing2": [ true, false ],
            "thing3": [ 4 ]
        }
    },
    "method": "POST",
    "headers": {
        "content-type": "application/json",
    },
    "bodyType": "JSON",
    "body":  {
        "test": "hello world"
    }
}
```


### Context
The [context](#context) is additional properties provided to configure the
endpoint. The context is either provided by the
[server configuration](#server-config), if it's the root route or the
[module loader](#module-endpoint), if it's a module route. If the module provides
a context schema type, the context provided will be verified during build.


### Response
The Response class is used to generate HTTP responses. It provides static
methods to create different types of responses, such as text, JSON, and
redirects.

#### Blank Response
Creates a new response object with default options. Optional provide object that
specifies custom response options such as headers and status code.

```typescript
import { Request, Headers } from "sherpa-core";
Response.new();
Response.new({ status: 201 });
Response.new({ status: 201, headers: new Headers() });
```

#### Text Response
Generates a text response with the specified text content. Optional provide
object that specifies custom response options such as headers and status code.

```typescript
import { Request, Headers } from "sherpa-core";
Response.text("hello world");
Response.text("hello world", { status: 201 });
Response.text("hello world", { status: 201, headers: new Headers() });
```


#### JSON Response
Generates a JSON response with the specified JSON data. Optional provide
object that specifies custom response options such as headers and status code.

```typescript
import { Request, Headers } from "sherpa-core";
Response.text({ test: "hello world" });
Response.text({ foo: "bar" }, { status: 201 });
Response.text({ num: 3 }, { status: 201, headers: new Headers() });
```


#### Redirect Response
Generates a redirect response with the specified URL. This URL can either be either...
 - Absolute with Origin `https://example.com/foo`
 - Absolute `/foo`
 - Relative `./foo` or `../foo`
Optional provide object that specifies custom response options such as headers
and status code.

```typescript
import { Request, Headers } from "sherpa-core";
Response.redirect("https://example.com/foo");
Response.redirect("/foo", { status: 201 });
Response.redirect("../foo", { status: 201, headers: new Headers() });
```


<br>
<br>


## Modules
Modules are self-contained units of functional endpoints. They can do various
tasks such as analytics, status updates, authentication, and more. There are
plenty of [community modules](#community-modules), but if what you need doesn't
exist, developing your own modules is very simple.

<br>

### Creating a Module
A new module can be created relatively easily in just a couple of minutes. Check
out the [SherpaJS Module Template](https://github.com/sellersindustry/SherpaJS-template-module) 
for an example of how to build your module.

#### Step 1
Setup a new NodeJS project with `npm init`.

> [!TIP]
> You don't have to create a repository to make a module. If you choice you can
> simply create a new directory in your server and skip to [step 3](#step-3-1).

Ensure your main is set to `sherpa.module.ts` so your ContextSchema and other
resources are accessible by servers implementing your module.
```json
{
	"name": "sherpa-module",
	"version": "0.0.2",
	"main": "sherpa.module.ts",
	"scripts": {
		"build": "sherpa build -b Vercel",
		"dev": "sherpa build -b local && node ./.sherpa/index.js"
	},
	"dependencies": {
		"sherpa-core": "^1.0.4"
	}
}
```

#### Step 2
Install SherpaJS with `npm install sherpa-core`.

#### Step 3
Then create a module configuration file in the root directory of your modules named `sherpa.module.ts`. This file will default export a [module configuration](#module-configuration).

Optionally you can export a type named `ContextSchema`. This type acts
as a validation of properties when your module is [loaded](#module-endpoint). 

```typescript
// sherpa.module.ts
import { SherpaJS } from "sherpa-core";

export default SherpaJS.New.module({
    name: "example-module"
});

export type ContextSchema = {
    test: boolean
};
```

#### Step 4
To create endpoints for a new module in SherpaJS, you'll create a new
`/routes` directory the module. Each path inside the route directory will
correspond to it's relative endpoint. Endpoint logic is implemented in
javascript file named `index.ts` within these route directories.

A simple implementation of an endpoint can be seen below. For detailed
instructions on creating routes and endpoints, see the [endpoints](#routes--endpoints)
section.

```typescript
// ./route/example/index.ts
import { Response, Request, Environment } from "sherpa-core";

export function GET(request:Request, env:Environment) {
    return Response({ "hello": "world" });
}
```

#### Step 6
Create a [Sherpa Server](#servers) to test your module. For more details about
creating server configs see the [creating a server](#creating-a-server) section.

```typescript
// sherpa.server.ts
import { SherpaJS } from "sherpa-core";

export default SherpaJS.New.server({
    context: {
        test: true
    }
});
```


#### Step 7
Share your module with the world and get it listed as a [SherpaJS Community module](#community-modules) by [submitting a new issue](https://github.com/sellersindustry/SherpaJS/issues/new/choose).

> [!IMPORTANT]
> Ensure your module...
> - Is deployed as an NPM package
> - Contains the documentation on how to set it up, like what properties are required.
> - Link to the SherpaJS documentation, so people understand how to set it up.
> - Share your creation with the world!! Help support SherpaJS!!!

**Thanks so much for helping support SherpaJS!!! 🥳🎉**

<br>

### Module Configuration
Sherpa modules are configured using a `sherpa.module.ts` file, where you define
the structure and behavior of your module. This configuration file serves as
the entry point for your Sherpa module.


#### Config File
The file must located at `sherpa.module.ts` and have a default export of the
config and use the `SherpaJS.New.module` function as follows:

```typescript
import SherpaJS from "sherpa-core";

export default SherpaJS.New.module({
    name: "example-name"
});
```

Optionally you can export a type named `ContextSchema`. This type acts
as a validation of properties when your module is [loaded](#module-endpoint). 


#### Config Structure
 - **Name:** The name of the module

The configuration provided to the module creator must match the TypeScript object as follows:
```typescript
export type ModuleConfig = {
    name: string;
};
```

#### Example Config
```typescript
// sherpa.module.ts
import SherpaJS from "sherpa-core";

export default SherpaJS.New.module({
    name: "example-name"
});

export type ContextSchema = {
    value: number
}
```


<br>
<br>


## Development
This project is in early development, so it is possible for you to run into issues. We do use this product in production, but that doesn't mean there could be issues. If you run into any issues, they will probably be at build time, just let us know.


<br>


### Contributing
Any help is very much appreciated. Build some useful modules and [submit them to our community](https://github.com/sellersindustry/SherpaJS/issues/new/choose) module list. Even help with documentation or refactoring code is helpful.


<br>


### TODO
 - deploy example server to vercel...
 - Update Website
 - Inform People


<br>


### Proposed Features
 - How do you handle Environment files?
 - Build Test Harness to test standard endpoint features, bug detection, (and later Vercel Deployment).
 - Support more than Text and JSON body payloads
 - Auto reloading development server.
 - Clean Command.
 - Add SherpaJS 500 Error Page.
 - Add SherpaJS 404 Error Page.
 - Ability to add custom 500 and 404 error pages, with HTML in `/errors`.
 - Catch all dynamic routes.
 - Ability to add admin portal
 - Ability to interact with modules. This can allow other endpoints or code
    in the system or admin portals to call special functions that are part of the
    module, with the given context.
    - Import the endpoint which loads the module. The default export
        using SherpaJS.Load.module(path, context, interactionClass); will have
        a added optional variable of a class. The sherpaJS.Load.module will return
        an instatiatied version of tha class with the context.
 - Public Assets
 - Migrate to RUST (Start by Migrating Tooling as it probs takes the longest)
 - Make a document website with [Mintlify](https://mintlify.com/preview).
 - Console Development Server, Live Logs


<br>

### Proposed Modules
 - Dynamic redirect service.
 - Authical Authentication Service.
 - GitHub Issue Creator Form for Support

<br>

### Credits
 - Illustration by <a href="https://icons8.com/illustrations/author/zD2oqC8lLBBA">Icons 8</a> from <a href="https://icons8.com/illustrations">Ouch!</a>
