import { Files } from "../../files";
import { Message } from "../../logger/model";
import { FILENAME_CONFIG_SERVER, SUPPORTED_FILE_EXTENSIONS, ServerConfig, ServerStructure } from "../../models";
import { Tooling } from "../../tooling";


export async function getServerStructure(entry:string):Promise<{ errors:Message[], server?:ServerStructure }> {
    let { filepath, errors: errorsFilepath } = getFilepath(entry);
    if (!filepath) return { errors: errorsFilepath };

    let { instance, errors: errorsInstance } = await getInstance(filepath);
    if (!instance) return { errors: errorsInstance };

    //! FIXME - Verify types, rebuild type checker in tooling

    return {
        server: {
            filepath: filepath,
            instance: instance
        },
        errors: []
    }
}


function getFilepath(entry:string):{ errors:Message[], filepath?:string } {
    let filepath = Files.getFilepathVariableExtension(
        entry,
        FILENAME_CONFIG_SERVER,
        SUPPORTED_FILE_EXTENSIONS
    );
    if (filepath) {
        return { filepath, errors: [] };
    }
    return {
        errors: [{
            text: "Server config file could not be found.",
            content: `Must have server config, "${FILENAME_CONFIG_SERVER}" `
                + `of type "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
            file: { filepath: entry }
        }]
    };
}


async function getInstance(filepath:string):Promise<{ errors:Message[], instance?:ServerConfig }> {
    try {
        return {
            errors: [],
            instance: await Tooling.getDefaultExport(filepath) as ServerConfig
        }
    } catch (e) {
        return {
            errors: [{
                text: "Server config file could not be processed.",
                content: `Ensure server config has default export.`,
                file: { filepath: filepath }
            }]
        };
    }
}

