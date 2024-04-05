

// import fs from "fs";
// import parseImports from "parse-imports";


type hasDefaultExportResult = {
    hasDefaultExport:boolean;
    hasFunctionExport:boolean;
    hasPrototype:boolean;
    namespaceFilepath:string|undefined;
};


export function hasDefaultExport(filepath:string, namespace?:string, prototype?:string):hasDefaultExportResult {
    //! FIXME
    //! Should be used for both validating export
    //! Also use in router to get namespace filepath
    //! if no namespace provide will figure it out
    return {
        hasDefaultExport: true,
        hasFunctionExport: true,
        hasPrototype: true,
        namespaceFilepath: undefined
    };
}


// function getNamespaceByExport():string {
//     // let match  = buffer.match(/export\s+default\s+(?<exported>[a-zA-Z0-9]+)\s?\.\s?load\s?\(/);
//     // let importedName = match.groups["exported"];
// }


// function getNamespaceByWrapper(wrapper:string):string {
//     if (!wrapper.includes(".")) {
//         return wrapper;
//     }
//     return wrapper.split(".")[0];
// }


// function getBuffer(filepath:string):string|undefined {
//     if (fs.existsSync(filepath)) {
//         return undefined;
//     }
//     try {
//         return fs.readFileSync(filepath, "utf8");
//     } catch {
//         return undefined;
//     }
// }



