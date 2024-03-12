
# SherpaJS - Module Microservice Framework 
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


SherpaJS empowers developers to effortlessly construct <ins>**modular and agnostic serverless microservices platform**</ins>. Developers can either choose to build their modular endpoints through a directory-based structure, inspired by NextJS, or import a variety of community-built modules. These modules can then be seamlessly integrated into a single SherpaJS server, each at its specific endpoints or sub-routes, with tailored behaviors according to predefined properties. SherpaJS servers can then be bundled into a variety of formats including Vercel Serverless and ExpressJS (with more to come later).


## Table of Contents
 - [Modules and Packages](#community-modules)
 - [Installation](#installation)
 - [Commands](#commands)
 - [Modules](#modules)
    - [Create a Module](#create-a-module)
    - [Configuration](#module-configuration)
    - [Routes](#routes)
    - [Endpoints](#endpoints)
 - [Servers](#servers)
    - [Create a Server](#creating-a-server)
    - [Configuration](#server-configuration)
    - [Deploy a Server](#deploy-a-server)
 - [Development & Contributing](#development)


<br>
<br>


## Community Modules
| Module | Description | Developer |
|---|---|---|
| [Static Flags](https://github.com/sellersindustry/SherpaJS-static-flags) | Create static flags of booleans, strings, or numbers | [Sellers Industries](https://github.com/sellersindustry) |

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
<br>


## Modules
Modules are self-contained units of functional endpoints. They can do various tasks such as analytics, status updates, authentication, and more. There are plenty of [community modules](#community-modules), but if what you need doesn't exist, developing your own modules is very simple. Modules are just a collection of RESTful endpoints that follow a directory-based structure, inspired by Next.js.


<br>


### Create a Module
A new module can be created relatively easily in just a couple of minutes. Check out the [SherpaJS Module Template](https://github.com/sellersindustry/SherpaJS-template-module) for an example of how to build your module.


#### Step 1
Setup a new NodeJS project with `npm init`.

#### Step 2
Install SherpaJS with `npm install sherpa-core`.

#### Step 3
Then create a module configuration file in the root directory of your modules named `sherpa.module.ts`. This file will default export a [module configuration](#module-configuration).

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

> [!NOTE]
> You can make a module in your server repository. So you can have `./server.sherpa.ts`, which loads module `./example` with module config `./example/module.sherpa.ts`. Also if you only plan to have single module your server config and module config can be in the directory.

#### Step 3.5
Optionally you can export a type named `SHERPA_PROPERTIES`. This type acts as a validation of properties when your module is used in the [server configuration](#module-configuration). 

#### Step 4
To create [routes](#routes) and [endpoints](#endpoints) for a new module in SherpaJS, you'll define a new `/route` directory the module. Each path inside the route directory will correspond to it's relative endpoint. Endpoint logic is implemented in TypeScript file named `index.ts` within these route directories.

A simple implementation of an endpoint can be seen below. For detailed instructions on creating routes and endpoints, refer to the [routes](#routes) and [endpoints](#endpoints) sections.
```typescript
// ./route/example/index.ts
import { Response, Request, Environment } from "sherpa-core";

export function GET(request:Request, env:Environment) {
    return Response({ "hello": "world" });
}
```

> [!TIP]
> Check out the [SherpaJS Module Template](https://github.com/sellersindustry/SherpaJS-template-module) for an example of how to build your module.

#### Step 5
Verify your module with the `sherpa lint` [command](#lint-command).

#### Step 6
Create a [Sherpa Server](#servers) to import your module and run the `sherpa start` [command](#start-command)! For more details about creating server configs see [server configuration](#servers) section. [Ready to deploy?](#deploy-a-server)
```typescript
// sherpa.server.ts
import { NewServer } from "sherpa-core";

export default NewServer({
    version: 1,
    app: {
        module: ".", // assuming the module config is in the same directory 
        properties: {
            exampleProperty: "hello world"
        }
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
Configuration file located in the root of a Sherpa module. The file must be named `sherpa.module.ts` and default export the module configuration.

```typescript
type Module = {
    version:1;
    name:string;
}
```


<br>


## Routes
Routes in SherpaJS provide a flexible and intuitive way to define [endpoints](#endpoints) and handle incoming requests within your microservice architecture. Drawing inspiration from Next.js, SherpaJS routes follow a directory-based structure located in the `/routes` directory of your module.


### Structure of Routes
In the `/routes` directory, you can create additional directories to organize your routes. For instance, you might have a directory like `/example`, which contains specific endpoints related to a particular feature or functionality. Each endpoint within a route is represented by a file named `index.ts`.

These subroutes are located relative to the modules subroute according to the [server configuration](#server-configuration). For example if an endpoint is host at  `/example` and the module is defined at `/app-1/foo` then the example endpoint will be accessed at `/app-1/foo/example`.


### Subroutes and Dynamic Routes
SherpaJS supports the creation of subroutes and dynamic routes to enhance flexibility and customization. Subroutes allow you to nest endpoints within directories, enabling hierarchical organization of your API endpoints.

To define a dynamic route, simply name a directory using square brackets, such as `[id]`. Within a dynamic route directory, you can access the parameter value from the request object in your endpoint logic. For example, if you have a dynamic route named `[id]`, you can access the parameter using `request.params.id.`


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
<br>


## Endpoints
Endpoints represent the individual points of access within your microservice architecture, allowing clients to interact with specific functionalities or resources. Endpoints are defined within route files and are associated with specific HTTP methods (GET, POST, PATCH, PUT, DELETE) to perform corresponding actions.


### Structure of Endpoints
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


### Response Handling
Response from any endpoint can be done by returning a [standard HTTP response class](https://developer.mozilla.org/en-US/docs/Web/API/Response), but the SherpaJS Response helper function can make it a little easier. This function allows developers to specify the response body as either a string or JSON (and it will be handled appropriately), along with [additional response options](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#options) such as status codes and headers.


### Environment Access
The environment variable in SherpaJS provides developers with a powerful toolset for accessing contextual information and configurations within endpoint functions. This is also how you access properties of the module defined in the [server configuration](#server-configuration). 

[Learn More](#environment-class)



<br>
<br>


## Servers
Servers are a collection of [modules](#modules) mounted at specific routes.

### Creating a Server
Creating a new server is extremely easy and can be done within a couple of minutes. Check out the [SherpaJS Server Template](https://github.com/sellersindustry/SherpaJS-template-server) for an example of how to build your server.


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
Define where you would like to mount the modules inside the `app` property. You can create subroutes by prefixing route paths with a forward slash, allowing for hierarchical organization, like `/product-1` and `/product-2`. 
See [server configurations](#server-configuration) for examples.

#### Step 5
Verify the server with the `sherpa lint` [command](#lint-command).

#### Step 6
Start the server locally with the `sherpa start` [command](#start-command), this will build and start the server at `localhost:3000` by default.

#### Step 7
Now your ready to deploy, see the [deployment](#deploy-a-server) section for more details.


<br>


### Server Configuration
Sherpa servers are configured using a `sherpa.server.ts` file, where you define the structure and behavior of your server. This configuration file serves as the backbone of your Sherpa server, allowing you to specify modules, routes, and various server settings.


The server configuration object passed to the NewServer function defines the overall structure of your Sherpa server. It consists of the following properties:

 - `version`: The version of the server configuration. This helps manage changes and updates over time.
 - `app`: The root of the server configuration, where you define modules and routes for your server.


#### Modules Routes
Within the `app` property, you define modules and routes using route paths. Each route path corresponds to a specific endpoint or functionality within your server. You can create subroutes by prefixing route paths with a forward slash, allowing for hierarchical organization.

The module property in route configurations can either be the path to a module file or the name of an NPM package containing the module.

#### Examples
```typescript
import { NewServer } from "sherpa-core";

export default NewServer({
    version: 1,
    app: {
        "/product-1": {
            "/a": {
                module: "./example-module",
                properties: {
                    exampleProperty: "1"
                }
            },
            "/b": {
                module: "./example-module",
                properties: {
                    exampleProperty: "2"
                }
            }
        },
        "/product-2": {
            module: "./example-module",
            properties: {
                exampleProperty: "3"
            }
        }
    }
})
```

> [!WARNING]
> You cannot have both a subroute and a module defined at the same level within the app configuration. This ensures clarity and avoids conflicts in route resolution.


<br>


### Deploy a Server
Currently there are only two options for deploying servers. You can either build them locally (ExpressJS) or deploy to the [Vercel Platform](https://vercel.com/).


> [!NOTE]
> We would like to support more platforms in the future, but for now it's just these two platforms.


#### ExpressJS Bundler (Local Deployment)
To deploy your Sherpa server locally using the ExpressJS bundler, follow these steps:
1) Run the `sherpa build -b ExpressJS` [command](#build-command).
2) Start the server with either `node ./.sherpa/index.js` or with the `sherpa start` [command](#start-command).
3) Navigate to `localhost:3000` and verify that your Sherpa server is running correctly by accessing it and testing each endpoint.


#### Vercel Bundler (Serverless Deployment)
To deploy your Sherpa server on the [Vercel Platform](https://vercel.com/), follow these steps:
1) Set up a new project on the Vercel platform and connect it to your Git repository containing your Sherpa server code.
2) Ensure your `package.json` build command runs the `sherpa build -b Vercel` [command](#build-command).
3) Monitor Deployment: Monitor the deployment process in the Vercel dashboard and ensure that your Sherpa server is deployed successfully.
4) Test Server: Verify that your Sherpa server is running correctly by accessing it using the provided deployment URL on the Vercel platform.



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

### Accessing Server Configuration
The `Environment` class allows developers to retrieve server-wide configurations using the `GetServerConfig()` method. This includes settings such as server port, environment variables, and other global parameters defined for the SherpaJS server instance.


### Accessing Module Configuration
Developers can access module-specific configurations using the `GetModuleConfig()` method. This includes properties defined for the specific module within the server configuration, such as route configurations, middleware settings, and custom options.


### Accessing Module ID
The `Environment` class provides access to the unique identifier (ID) of the current module using the `GetModuleID()` method. This ID corresponds to the subroute at which the module is hosted within the SherpaJS server instance.


### Accessing Module Properties
Properties set for the module within the server configuration can be retrieved using the `GetProperties()` method. These properties can be utilized to customize the behavior of the module dynamically based on the server configuration.



<br>
<br>


## Development
This project is in early development, so it is possible for you to run into issues. We do use this product in production, but that doesn't mean there could be issues. If you run into any issues, they will probably be at build time, just let us know.


<br>


### Contributing
Any help is very much appreciated. Build some useful modules and [submit them to our community](https://github.com/sellersindustry/SherpaJS/issues/new/choose) module list. Even help with documentation or refactoring code is helpful.


<br>


### TODO
 - build static flag module
 - Add Documentation to static flag and list
 - deploy example server to vercel...
 - Update Website
 - Inform People


<br>


### Maintenance
 - Allow capitizal letters in dynamic routes
 - Remove the utilities folder, and place the function in the appropriate locations.
 - Clean up the CLI system.
 - Start command does not have to build the server, just starts a local server. Will keep track to ensure that ExpressJS was the last build. Also allow point controls from arguments on the build file.
 - Remove the ExpressJS bundler as it's too large, use a different smaller system, and just call it the "local" bundler.
 - Console Development Server, Live Logs
 - Allow Null Response Body
 - Make a document website with [Mintlify](https://mintlify.com/preview).
 - Better linting and cleaned linting system.
 - Better method for building JS instead of large multiple-line strings. Can we build a module that allows text files with inline JavaScript, similar to JSX?


<br>


### Proposed Features
 - Add Init Command to build Server and Module
 - Auto reloading development server.
 - Add SherpaJS 500 Error Page.
 - Add SherpaJS 404 Error Page.
 - Ability to add custom 500 and 404 error pages, with HTML in `/errors`.
 - Catch all dynamic routes.
 - Security concerns with exposing the whole server configuration.
 - Migrate Compiler to Rust (Eventually)


<br>

### Proposed Modules
 - Dynamic redirect service.
 - Authical Authentication Service.
 - GitHub Issue Creator Form for Support

