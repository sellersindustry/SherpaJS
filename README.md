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


SherpaJS empowers developers to effortlessly construct <ins>**modular and agnostic serverless web framework**</ins>. Developers can easily build serverless web server using a directory-based structure, inspired by NextJS and even import pre-built modules at endpoints. SherpaJS servers can then be compiled to a variety of different web platforms including Vercel Serverless and Local Server (with more to come later).


## Table of Contents
 - [Supported Platforms](#deploy-a-server)
 - [Community Modules](#community-modules)
 - [Installation](#installation)
 - [Commands](#commands)
 - [Servers](#servers)
    - [Create a Server](#creating-a-server)
    - [Configuration](#server-configuration)
    - [Deploy a Server](#deploy-a-server)
 <!-- - [Modules](#modules)
    - [Create a Module](#create-a-module)
    - [Configuration](#module-configuration)
    - [Routes](#routes)
    - [Endpoints](#endpoints) -->
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
  - `-b`, `--bundler <type>` platform bundler ("**Vercel**", "**Local**", *default: "Local"*)
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
Create an your endpoints in the `/routes` directory. See an example below or [learn about endpoints](#endpoints).

```typescript
// ./routes/index.ts
import { Request, Response, Context } from "sherpa-core";

export function GET(request:Request, context:Context) {
    return Response.text("Hello World!");
}
```

> [!NOTE]
> It's here where you can load pre-build SherpaJS modules and provide them with context.
> [Loading Modules](#loading-modules)


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


## Endpoints


### Loading Modules


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


### Proposed Features
 - How do you handle Environment?
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
