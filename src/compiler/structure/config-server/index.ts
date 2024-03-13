import { Files } from "../../files";
import { Logger } from "../../logger";
import { SourceCode } from "../../sourcecode";
import { Message } from "../../logger/model";
import { FILENAME_CONFIG_SERVER, SUPPORTED_FILE_EXTENSIONS, ServerConfig } from "../../models";


export class ConfigServer {


    public static async preflight(entry:string):Promise<Message[]> {
        if (!ConfigServer.filepath(entry)) {
            return [{
                text: "Server config file could not be found.",
                content: `Must have server config, "${FILENAME_CONFIG_SERVER}" `
                    + `of type "${SUPPORTED_FILE_EXTENSIONS.join("\", \"")}".`,
                file: { filepath: entry }
            }];
        }
        //! rename source-code to something else
        //! Verify default export
        //! Verify types
        return [];
    }
    

    public static async get(entry:string):Promise<ServerConfig> {
        let filepath = ConfigServer.filepath(entry);
        if (!filepath) {
            throw Error("Preflight Crosscheck Error");
        }
        return await ConfigServer.load(filepath) as ServerConfig;
    }


    public static filepath(entry:string):string|undefined {
        return Files.getFilepathVariableExtension(
            entry,
            FILENAME_CONFIG_SERVER,
            SUPPORTED_FILE_EXTENSIONS
        );
    }


    private static async load(filepath:string):Promise<unknown> {  
        try {
            return SourceCode.getDefaultExport(filepath);
        } catch (e) {
            throw Logger.error({
                text: "Server config file could not be found.",
                content: e.message,
                file: { filepath: filepath }
            });
        }
    }


}

