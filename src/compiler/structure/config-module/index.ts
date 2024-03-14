import { Files } from "../../files/index.js";
import { Level, Message } from "../../logger/model.js";
import {
    CONTEXT_SCHEMA_TYPE_NAME, FILENAME_CONFIG_MODULE,
    ModuleStructure, SUPPORTED_FILE_EXTENSIONS,
    ModuleConfig, Context
} from "../../models/index.js";
import { Tooling } from "../../tooling/index.js";


export async function getModuleStructure(entry:string, context:Context|undefined):Promise<{ errors:Message[], module?:ModuleStructure }> {
    let { filepath, errors: errorsFilepath } = getFilepath(entry);
    if (!filepath) return { errors: errorsFilepath };

    let { instance, errors: errorsInstance } = await getInstance(filepath);
    if (!instance) return { errors: errorsInstance };

    //! FIXME - verify context types

    return {
        module: {
            filepath: filepath,
            context: context,
            config: instance,
            hasContextSchema: hasContextSchema(filepath)
        },
        errors: []
    }
}


function getFilepath(entry:string):{ errors:Message[], filepath?:string } {
    let filepath = Files.getFilepathVariableExtension(
        entry,
        FILENAME_CONFIG_MODULE,
        SUPPORTED_FILE_EXTENSIONS
    );
    if (filepath) {
        return { filepath, errors: [] };
    }
    return {
        errors: [{
            level: Level.ERROR,
            text: "Module config file could not be found.",
            content: `Must have module config, "${FILENAME_CONFIG_MODULE}" `
                + `of type "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
            file: { filepath: entry }
        }]
    };
}


async function getInstance(filepath:string):Promise<{ errors:Message[], instance?:ModuleConfig }> {
    try {
        return {
            errors: [],
            instance: await Tooling.getDefaultExport(filepath) as ModuleConfig
        }
    } catch (e) {
        return {
            errors: [{
                level: Level.ERROR,
                text: "Module config file could not be processed.",
                content: `Ensure module config has default export.`,
                file: { filepath: filepath }
            }]
        };
    }
}


function hasContextSchema(filepath:string):boolean {
    let exportedVariables = Tooling.getExportedVariableNames(filepath);
    let exportedSchema    = exportedVariables.includes(CONTEXT_SCHEMA_TYPE_NAME);
    let isTypescript      = Files.getExtension(filepath) == "TS";
    return exportedSchema && isTypescript;
}

