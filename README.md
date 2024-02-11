
# SherpaJS - Module Microservice Framework 
![NPM Version](https://img.shields.io/npm/v/sherpa-core)
[![Node.js Package](https://github.com/sellersindustry/SherpaJS/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/sellersindustry/SherpaJS/actions/workflows/npm-publish.yml)


> [!NOTE]
> This project is in early development, so it is possible for you to run into issues. If you run into any issues please just create a new issue and link your code. Feel free to debug or update the code too!
> 
> Even if you fix are able to solve your issue, let us know, it could help us build a better linter.
> 
> If the documentation is ever not clear, ask and feel free to make updates.

SherpaJS empowers developers to effortlessly construct <ins>**modular and reusable microservices**</ins>. Developers can either choose to build their modular endpoints through a directory-based structure, inspired by NextJS, or import a variety of community-built modules. These modules can then be seamlessly integrated into a single SherpaJS server, each at its specific endpoints or sub-routes, with tailored behaviors according to predefined properties. SherpaJS servers can then be bundled into a variety of formats including Vercel Serverless and ExpressJS (with more to come later).


## Table of Contents
 - [Modules and Packages](#community-modules)
 - [Installation](#installation)
 - [Commands](#commands)
 - [Module](#modules)
    - [Create a Module](#create-a-module)
    - [Configuration](#module-configuration)
    - [Routes](#routes)
    - [Endpoints](#endpoints)
 - [Create a Server](#servers)
 - [Development & Contributing](#development)


<br>
<br>


## Community Modules


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
 - `clean [options]` Remove build directories
 - `start [options]` Build and Start local SherpaJS Server
 - `lint [options]` Lint a server or module
 - `help [command]` display help for command


<br>


### Build Command
Build SherpaJS Server.
```bash
sherpa build [options]
```

#### Options:
 - `-i`, `--input <path>`   path to server or module, defaults to current directory
 - `--dev`                  enable development mode, do not minify output
 - `-b`, `--bundler <type>` bundler to package server with (choices: "Vercel", "ExpressJS", default: "Vercel")
 - `-h`, `--help`           display help for command


<br>


### Clean Command
Remove build directories.
```bash
sherpa clean [options]
```

#### Options:
 - `-i`, `--input <path>` path to server or module, defaults to current directory
 - `-h`, `--help`         display help for command


<br>


### Start Command
Build and Start local SherpaJS Server.
```bash
sherpa start [options]
```

#### Options:
 - `-i`, `--input <path>`   path to server or module, defaults to current directory
 - `-p`, `--port <number>`  port number of server, defaults to 3000
 - `-h`, `--help`           display help for command


<br>


### Lint Command
Lint a server or module.
```bash
sherpa lint [options]
```

#### Options:
 - `-i`, `--input <path>`  path to server or module, defaults to current directory
 - `-h`, `--help`          display help for command


<br>


### Init Command
FIXME FIXME


<br>
<br>


## Modules
Modules are self-contained units of functional endpoints. They can do various tasks such as analytics, status updates, authentication, and more. There are plenty of [community modules](#community-modules), but if what you need doesn't exist, developing your own modules is very simple. Modules are just a collection of RESTful endpoints that follow a directory-based structure, inspired by Next.js.


<br>


### Create a Module
We recommend using `sherpa init module` ([CLI Commands](#init-command)) to create a new module. This must be done in an empty directory.

Check out the [SherpaJS Module Template](https://github.com/sellersindustry/SherpaJS-template-module) for an example of how to build your module.

#### Step 1
Setup a new NodeJS project with `npm init`.

#### Step 2
Install SherpaJS with `npm install sherpa-core`.

#### Step 3
Then create a module configuration file in the root directory of your modules named `sherpa.module.ts`. This file will default export a [module configuration](#module-configuration).

#### Step 3.5
Optionally you can export a type named `SHERPA_PROPERTIES`. This type acts as a validation of properties when your module is used in the [server configuration](#module-configuration). 

```typescript
// sherpa.module.ts
import { NewModule } from "sherpa-core";

export default NewModule({
    version: 1,
    name: "example-module",
});

export type SHERPA_PROPERTIES = {
    exampleProperty: string
}
```

*Note: you can make a new module in your server repository, the module just _needs its directory inside_ the server. So you can have `./server.sherpa.ts`, which loads module `./example` with module config `./example/module.sherpa.ts`.*

#### Step 4
To create [routes](#routes) and [endpoints](#endpoints) for a new module in SherpaJS, you'll define a new `/route` directory the module. Each path inside the route directory will correspond to it's relative endpoint. Endpoint logic is implemented in TypeScript file named `index.ts` within these route directories. For detailed instructions on creating routes and endpoints, refer to the [routes](#routes) and [endpoints](#endpoints) sections.

Check out the [SherpaJS Module Template](https://github.com/sellersindustry/SherpaJS-template-module) for an example of how to build your module.

#### Step 5
Verify your module with `sherpa lint` [Learn More](#lint-command).

#### Step 6
Create a [Sherpa Server](#servers) to import your module and run `sherpa start` [Learn More](#start-command)!

#### Step 7
Share your module with the world and get it listed as a [SherpaJS Community module](#community-modules) by [submitting a new issue](https://github.com/sellersindustry/SherpaJS/issues/new/choose).

Ensure your module is deployed as an NPM package and contains documentation on how to set it up. Please link people to the SherpaJS documentation so people understand how to set it up. 

**Thanks so much for helping support SherpaJS!!! 🥳🎉**


<br>


### Module Configuration
Configuration file located in the root of a Sherpa module. The file must be named `sherpa.module.ts` and default export the module configuration.

```typescript
type Module = {
    version:1;
    name:string;
}
```


<br>


### Routes
Routes in SherpaJS provide a flexible and intuitive way to define [endpoints](#endpoints) and handle incoming requests within your microservice architecture. Drawing inspiration from Next.js, SherpaJS routes follow a directory-based structure located in the `/routes` directory of your module.


#### Structure of Routes
In the `/routes` directory, you can create additional directories to organize your routes. For instance, you might have a directory like `/example`, which contains specific endpoints related to a particular feature or functionality. Each endpoint within a route is represented by a file named `index.ts`.

These subroutes are located relative to the modules subroute according to the [server configuration](#server-configuration). For example if an endpoint is host at  `/example` and the module is defined at `/app-1/foo` then the example endpoint will be accessed at `/app-1/foo/example`.


#### Subroutes and Dynamic Routes
SherpaJS supports the creation of subroutes and dynamic routes to enhance flexibility and customization. Subroutes allow you to nest endpoints within directories, enabling hierarchical organization of your API endpoints.

To define a dynamic route, simply name a directory using square brackets, such as `[id]`. Within a dynamic route directory, you can access the parameter value from the request object in your endpoint logic. For example, if you have a dynamic route named `[id]`, you can access the parameter using `request.params.id.`


#### Examples of Route Structures
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
│   └── index.ts     // Endpoint logic for "/:id" access ":id" with request.params.id
```

```less
/routes
│
├── /products
│   ├── index.ts     // Endpoint logic for "/products"
│   ├── /[productID]
│   │   └── index.ts // Endpoint logic for "/products/:productID" access ":productID" with request.params.productID
│   │
│   └── /category
│       └── index.ts // Endpoint logic for "/products/category"

```


<br>


### Endpoints
Endpoints represent the individual points of access within your microservice architecture, allowing clients to interact with specific functionalities or resources. Endpoints are defined within route files and are associated with specific HTTP methods (GET, POST, PATCH, PUT, DELETE) to perform corresponding actions.


#### Structure of Endpoints
Each endpoint is defined within a route file using the corresponding HTTP method function. These functions provide access to the incoming request and the environment, allowing developers to customize the endpoint's behavior based on the request data and the server environment.

Endpoint can be defined by exporting a function with the desired method name. The following HTTP methods are supported: `GET`, `POST`, `PATCH`, `PUT`, and `DELETE`.

Endpoint functions receive two parameters: the `request` object representing the incoming HTTP request and the `env` object representing the server environment. The request is the [standard HTTP request class](https://developer.mozilla.org/en-US/docs/Web/API/Request), with an addition of the the `params` property map for accessing [dynamic route](#subroutes-and-dynamic-routes) variables.

```typescript
import { Request, Environment, Response } from "sherpa-core";

// Example GET endpoint
export function GET(request:Request, env:Environment) {
    return Response("Hello World");
}

// Example POST endpoint
export function POST(request:Request, env:Environment) {
    return Response("Example POST", { status: 201 });
}

// Example DELETE endpoint
export function DELETE(request:Request, env:Environment) {
    return Response({ message: "DELETE request received" }, { status: 204 });
}
```


#### Response Handling
Response from any endpoint can be done by returning a [standard HTTP response class](https://developer.mozilla.org/en-US/docs/Web/API/Response), but the SherpaJS Response helper function can make it a little easier. This function allows developers to specify the response body as either a string or JSON (and it will be handled appropriately), along with [additional response options](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#options) such as status codes and headers.


#### Environment Access
The environment variable in SherpaJS provides developers with a powerful toolset for accessing contextual information and configurations within endpoint functions.

[Learn More](#environment-class)



<br>
<br>


## Servers
Servers are a collection of [modules](#modules) mounted at specific routes.

### Creating a Server
Creating a new server is extremely easy. But you can also use `sherpa init server` ([CLI Command](#init-command)) to create a new server.

Check out the [SherpaJS Server Template](https://github.com/sellersindustry/SherpaJS-template-server) for an example of how to build your server.


#### Step 1
Setup a new NodeJS project with `npm init`.

#### Step 2
Install SherpaJS with `npm install sherpa-core`.

#### Step 3
Create a new server configuration file in the root directory of your server name `sherpa.server.ts`. This file will default export a [server configuration](#server-configuration).

```typescript
// sherpa.server.ts
import { NewServer } from "sherpa-core";

export default NewServer({
    version: 1,
    app: {
        module: "./example-module",
        properties: {
            food: "2"
        }
    }
});
```

#### Step 4
Define where you would like to mount the modules inside the `app` property. You can can create subroutes to host multiple modules by providing an object with properties 
.... FIXME!!!!!!!
select the location of the module, and supply the module with what ever properties or configurations it requires to run.


FIXME STEPS

### Server Configuration


```typescript
type App = {
    module: string;
    filepath?: string;
    properties?: unknown;
} | {
    [key: `/${string}`]: App;
};

type ConfigServer = {
    version: 1;
    app: App;
};
```

### Examples

<br>
<br>


## Environment Class
The `Environment` class in SherpaJS provides developers with access to essential server and module configurations, properties, and metadata within endpoint functions. It serves as a central interface for retrieving contextual information about the runtime environment, enabling developers to build more dynamic and adaptable microservices.

The environment can be access from an [endpoint](#endpoints) inside a module.

```typescript
export function GET(request: Request, env: Environment) {
    const moduleConfig = env.GetModuleConfig();
    const serverConfig = env.GetServerConfig();
    const moduleID = env.GetModuleID();
    const properties = env.GetProperties();

    return Response({
        message: "Hello World!",
        module: moduleConfig,
        server: serverConfig,
        properties: properties,
        id: moduleID
    }, { status: 200 });
}
```

## Accessing Server Configuration
The `Environment` class allows developers to retrieve server-wide configurations using the `GetServerConfig()` method. This includes settings such as server port, environment variables, and other global parameters defined for the SherpaJS server instance.


## Accessing Module Configuration
Developers can access module-specific configurations using the `GetModuleConfig()` method. This includes properties defined for the specific module within the server configuration, such as route configurations, middleware settings, and custom options.


## Accessing Module ID
The `Environment` class provides access to the unique identifier (ID) of the current module using the `GetModuleID()` method. This ID corresponds to the subroute at which the module is hosted within the SherpaJS server instance.


## Accessing Module Properties
Properties set for the module within the server configuration can be retrieved using the `GetProperties()` method. These properties can be utilized to customize the behavior of the module dynamically based on the server configuration.



<br>
<br>


## Development

<br>
<br>

### Contributing


### TODO
- add init for server and module
    - https://www.npmjs.com/package/create-from-git
- Headers + Footers
- Documentation
- remove example-module from here

### Maintenance
 - Remove the utilities folder, and place the function in the appropriate locations.
 - Clean up the CLI system.
 - Start command does not have to build the server, just starts a local server. Will keep track to ensure that ExpressJS was the last build.
 - Remove the ExpressJS bundler as it's too large, use a different smaller system, and just call it the "local" bundler.
 - Make a document website with [Mintlify](https://mintlify.com/preview).
 - Better linting and cleaned linting system.
 - Better method for building JS instead of large multiple-line strings. Can we build a module that allows text files with inline JavaScript, similar to JSX?

### Proposed Features
 - Auto reloading development server.
 - Add SherpaJS 500 Error Page.
 - Add SherpaJS 404 Error Page.
 - Ability to add custom 500 and 404 error pages, with HTML in `/errors`.
 - Catch all dynamic routes.
 - Security concerns with exposing the whole server configuration.

### Proposed Modules
 - Dynamic redirect service.
