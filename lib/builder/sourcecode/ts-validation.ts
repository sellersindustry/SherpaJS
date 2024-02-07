import path from "path";
import ts from "typescript";


const BUFFER_FILE_NAME = "TS_BUFFER.ts";


export function TypeScriptValidation(buffer:string):readonly ts.Diagnostic[] {
    let host    = getHost(buffer);
    let program = getProgram(host);
    return ts.getPreEmitDiagnostics(program);
}


function getProgram(host:ts.CompilerHost):ts.Program {
    return ts.createProgram({
        rootNames: [BUFFER_FILE_NAME],
        options: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.Node10,
        },
        host: host,
    });
}


function getHost(buffer:string):ts.CompilerHost {
    let defaultLibPath = path.dirname(require.resolve("typescript")) + "/lib/lib.d.ts";
    return {
        getSourceFile: (filename) => {
            if (filename === BUFFER_FILE_NAME) {
                return ts.createSourceFile(
                    BUFFER_FILE_NAME,
                    buffer,
                    ts.ScriptTarget.Latest
                );
            } else if (filename == defaultLibPath) {
                let content = ts.sys.readFile(defaultLibPath);
                if (content === undefined) {
                    return undefined;
                }
                return ts.createSourceFile(
                    filename,
                    content,
                    ts.ScriptTarget.Latest
                );
            } else {
                return ts.createSourceFile(
                    filename,
                    ts.sys.readFile(filename) || "",
                    ts.ScriptTarget.Latest
                );
            }
        },
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        writeFile: () => {},
        getCurrentDirectory: () => "",
        getDirectories: () => [],
        getCanonicalFileName: (fileName) => fileName,
        getNewLine: () => "\n",
        useCaseSensitiveFileNames: () => true,
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
    };
}

