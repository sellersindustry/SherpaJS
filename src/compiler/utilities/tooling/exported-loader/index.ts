/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Apr 15 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Exported Loaders
 *
 */


import fs from "fs";
import { ExportSpecifier, parse } from "es-module-lexer";
import { Level, Message } from "../../logger/model.js";
import parseImports from "parse-imports";


export enum ExportLoaderType { package, file }
export type ExportLoaderModule = {
    type: ExportLoaderType;
    namespace: string;
    binding: string;
    filepath: string;
};


/**
 * Will verify there is a default export from a file and gather module
 * information. The default export must be a invoked function and inline with
 * the export. For example...
 * 
 * **Valid Example** - prototype = SherpaJS.module.load
 * renamed namespace will be auto-detected as SherpaJS = foo
 * ```typescript
 * import { foo as SherpaJS } from "sherpa-core"
 * export default foo.module.load()
 * ```
 * 
 * 
 * **Valid Example** - prototype = SherpaJS.module.load
 * ```typescript
 * export default SherpaJS.module.load()
 * ```
 * 
 * 
 * **Valid Example** - prototype = SherpaJS
 * ```typescript
 * export default SherpaJS()
 * ```
 * 
 * 
 * **Invalid Example** - Export must be inline.
 * ```typescript
 * const foo = SherpaJS.module.load();
 * export default foo;
 * ```
 * 
 * 
 * **Invalid Example** - Export must a function call.
 * ```typescript
 * export default SherpaJS.module.load;
 * ```
 * 
 * 
 * **Invalid Example** - Must have a default export.
 * ```typescript
 * export const foo = 2;
 * ```
 * 
 * @param filepath of the javascript or typescript file
 * @param fileTypeName error message descriptor
 * @param namespace optional, if not give assumes any namespace and auto-detect
 * @param prototype optional, the dot method calls on the namespace
 * @returns Promise<{ errors:Message[], module?:Module }>
 */
export async function getExportedLoader(filepath:string, fileTypeName:string, prototype?:string):Promise<{ errors:Message[], module?:ExportLoaderModule }> {
    let autoDetectNamespace = prototype == undefined;
    let namespace = prototype ? prototype.split(".")[0] : undefined;
    prototype = prototype && prototype.split(".").length > 1 ? prototype.split(".").slice(1).join(".") : undefined;

    let buffer = getBuffer(filepath);
    if (!buffer) {
        return {
            errors: [{
                level: Level.ERROR,
                text: `${fileTypeName} file not found.`,
                file: { filepath }
            }]
        };
    }

    let [, exports]    = await parse(buffer);
    let characterIndex = getCharacterIndex(exports);
    if (characterIndex == -1) {
        return {
            errors: [{
                level: Level.ERROR,
                text: `${fileTypeName} has no default export.`,
                content: `Ensure you are default exporting the required properties.`,
                file: { filepath }
            }]
        };
    }

    namespace = namespace ? namespace : getNamespaceByExport(buffer, characterIndex);
    if (!namespace) {
        return {
            errors: [{
                level: Level.ERROR,
                text: `${fileTypeName} has invalid default export module.`,
                content: `Namespace was not found.`,
                file: { filepath }
            }]
        };
    }

    let module = await getModule(buffer, namespace, autoDetectNamespace);
    if (!module) {
        return {
            errors: [{
                level: Level.ERROR,
                text: `${fileTypeName} has invalid default export module.`,
                content: `Namespace import was not found.`,
                file: { filepath }
            }]
        };
    }
    namespace = module.binding;

    if (!hasDefaultExportedNamespace(buffer, characterIndex, namespace)) {
        return {
            errors: [{
                level: Level.ERROR,
                text:  `${fileTypeName} has invalid default export module (namespace).`,
                content: `Ensure you are default exporting using "${namespace}${prototype ? "." : ""}${prototype}(...)".`,
                file: { filepath }
            }]
        };
    }


    if (!hasDefaultExportedPrototype(buffer, characterIndex, namespace, prototype)) {
        return {
            errors: [{
                level: Level.ERROR,
                text:  `${fileTypeName} has invalid default export module (prototype).`,
                content: `Ensure you are default exporting using "${namespace}${prototype ? "." : ""}${prototype}(...)".`,
                file: { filepath }
            }]
        };
    }


    if (!hasDefaultExportedInvoke(buffer, characterIndex, namespace, prototype)) {
        return {
            errors: [{
                level: Level.ERROR,
                text:  `${fileTypeName} has invalid default export module (invoke).`,
                content: `Ensure you are default exporting using "${namespace}${prototype ? "." : ""}${prototype}(...)".`,
                file: { filepath }
            }]
        };
    }

    return { errors: [], module };
}


function hasDefaultExportedInvoke(buffer:string, characterIndex:number, namespace:string, prototype?:string):boolean {
    let regex = new RegExp(`default\\s+${namespace}\\s?${prototype ? `\\.\\s*${prototype.split(".").join("\\s*\\.\\s*")}` : "(\\s*\\.\\s*[a-zA-Z0-9_]+)*"}\\s*\\(`);
    return buffer.slice(characterIndex).match(regex) != null;
}


function hasDefaultExportedPrototype(buffer:string, characterIndex:number, namespace:string, prototype?:string):boolean {
    let regex = new RegExp(`default\\s+${namespace}\\s?${prototype ? `\\.\\s*${prototype.split(".").join("\\s*\\.\\s*")}` : ""}`);
    return buffer.slice(characterIndex).match(regex) != null;
}


function hasDefaultExportedNamespace(buffer:string, characterIndex:number, namespace:string):boolean {
    let regex = new RegExp(`default\\s+${namespace}`);
    return buffer.slice(characterIndex).match(regex) != null;
}


async function getModule(buffer:string, namespace:string, useBinding:boolean):Promise<ExportLoaderModule|undefined> {
    for (let _import of await parseImports(buffer)) {
        if (!_import.moduleSpecifier.value) {
            return;
        }

        let isPackage = _import.moduleSpecifier.type == "package";
        let type      = isPackage ? ExportLoaderType.package : ExportLoaderType.file;
        
        if (_import.importClause?.default == namespace) {
            return {
                type: type,
                filepath: _import.moduleSpecifier.value,
                namespace: namespace,
                binding: namespace
            };
        }

        let namedImport = _import.importClause?.named.filter(o => useBinding ? o.binding == namespace : o.specifier == namespace);
        if (namedImport && namedImport.length > 0) {
            return {
                type: type,
                filepath: _import.moduleSpecifier.value,
                namespace: namedImport[0].specifier,
                binding: namedImport[0].binding,
            }
        }
    }
    return undefined;
}


function getNamespaceByExport(buffer:string, characterIndex:number):string|undefined {
    let match = buffer.slice(characterIndex).match(/default\s+(?<exported>[a-zA-Z0-9_]+)/);
    return match ? match.groups["exported"] : undefined;
}


function getCharacterIndex(exports:readonly ExportSpecifier[]):number {
    let _exports = exports.filter(o => o.n == "default");
    return _exports.length > 0 ? _exports[0].s : -1;
}


function getBuffer(filepath:string):string|undefined {
    if (!fs.existsSync(filepath)) {
        return undefined;
    }
    try {
        return fs.readFileSync(filepath, "utf8");
    } catch {
        return undefined;
    }
}


// The mind governed by the flesh is death, but the mind governed by the Spirit is life and peace.
// - Romans 8:6
