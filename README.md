# SherpaJS - Module Microservice Framework 
![NPM Version](https://img.shields.io/npm/v/sherpa-core)
[![Node.js Package](https://github.com/sellersindustry/SherpaJS/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/sellersindustry/SherpaJS/actions/workflows/npm-publish.yml)

SherpaJS empowers developers to effortlessly construct <ins>**modular and reusable microservices**</ins>. Developers can either choose to build their modular endpoints through a directory-based structure, inspired by NextJS, or import a variety of community-built modules. These modules can then be seamlessly integrated into a single SherpaJS server, each at its specific endpoints or sub-routes, with tailored behaviors according to predefined properties. SherpaJS servers can then be bundled into a variety of formats including Vercel Serverless and ExpressJS (with more to come later).


## Table of Contents
 - [Modules and Packages](#modules-and-packages)
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


## Modules and Packages


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
Modules are self-contained units of functional endpoints. They can do various tasks such as analytics, status updates, authentication, and more. There are plenty of [community modules](#modules-and-packages), but if what you need doesn't exist, developing your own modules is very simple. Modules are just a collection of RESTful endpoints that follow a directory-based structure, inspired by Next.js.

<br>

### Create a Module
We recommend using `sherpa init module` ([CLI Commands](#init-command)) to create a new module. This must be done in an empty directory.

Check out the [SherpaJS Module Template](https://github.com/sellersindustry/SherpaJS-template-module) for an example of how to build your module.

#### Step 1
Install SherpaJS with `npm install sherpa-core`.

#### Step 2
Then create a module configuration file in the root directory of your modules named `sherpa.module.ts`. This file will default export a [module configuration](#module-configuration).

#### Step 2.5
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

#### Step 3
Setup the routes...

#### Step 4
Setup the endpoints...

#### Step 5
Create a Sherpa Server Config. Go!

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


#### Subroutes and Dynamic Routes
SherpaJS supports the creation of subroutes and dynamic routes to enhance flexibility and customization. Subroutes allow you to nest endpoints within directories, enabling hierarchical organization of your API endpoints. Additionally, dynamic routes enable parameterized endpoints, allowing for more dynamic handling of requests.

To define a dynamic route, simply name a directory using square brackets, such as `[id]`. Within a dynamic route directory, you can access the parameter value from the request object in your endpoint logic. For example, if you have a dynamic route named `[id]`, you can access the parameter using `request.params.id.`


#### Examples
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


<br>
<br>

## Servers


### Server Configuration


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
 - Make a document website.
 - Better linting and cleaned linting system.
 - Better method for building JS instead of large multiple-line strings. Can we build a module that allows text files with inline JavaScript, similar to JSX?

### Proposed Features
 - Auto reloading development server.
 - Add SherpaJS 500 Error Page.
 - Add SherpaJS 404 Error Page.
 - Ability to add custom 500 and 404 error pages, with HTML in `/errors`.
 - Catch all dynamic routes.

### Proposed Modules
 - Dynamic redirect service.
