# SherpaJS - Module Microservice Framework 
![NPM Version](https://img.shields.io/npm/v/sherpa-core)
[![Node.js Package](https://github.com/sellersindustry/SherpaJS/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/sellersindustry/SherpaJS/actions/workflows/npm-publish.yml)

SherpaJS empowers developers to effortlessly construct <ins>**modular and reusable microservices**</ins>. Developers can either choice to build their own modular endpoints through a directory-based structure, inspired by NextJS, or import a variety of community built modules. These modules can then be seamlessly integrated into a single SherpaJS server, each at it's own specific endpoints or sub-routes, with tailored behaviors according to predefined properties. SherpaJS servers can then be bundled into a variety of formats including Vercel Serverless and ExpressJS (with more to come later).


## Table of Contents
 - [Modules and Packages](#modules-and-packages)
 - [Installation](#installation)
 - [Commands](#commands)
 - [Create a Module](#create-a-module)
 - [Create a Server](#create-a-server)
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
<br>

## Create a Module

<br>
<br>

## Create a Server

<br>
<br>

## Development

<br>
<br>

### Contributing


### TODO
- Verify exports of module config
- Remove ExpressJS Support - https://www.npmjs.com/package/http-server-simple
- add init for server and module
    - https://www.npmjs.com/package/create-from-git
- Headers + Footers
- Documentation


### Future Features
- Attempt to remove utilites folder...
- Make Better Error Page
- Custom Error 404 Pages...
    - [Adding to Vercel](https://vercel.com/guides/custom-404-page)
    - [Adding to ExpressJS](https://stackoverflow.com/questions/6528876/how-to-redirect-404-errors-to-a-page-in-expressjs/)

