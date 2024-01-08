// validate configurations
// validate sherpa.server.ts

// example config
export default {
    "version": "1.0.0",
    "routes": {
        "foo": {
            "module": "./foo",
            "config": {}
        },
        "bar": {
            "1": {
                "module": "./bar",
                "config": {}
            },
            "2": {
                "module": "./bar",
                "config": {}
            },
        },
    },
};


// import { Project } from 'ts-morph';

// const filePath   = 'test.ts';
// const project    = new Project();
// const sourceFile = project.addSourceFileAtPath(filePath);
// console.log(Array.from(sourceFile.getExportedDeclarations().keys()));
