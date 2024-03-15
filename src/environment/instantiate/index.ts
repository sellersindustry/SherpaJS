import { LoadModule, ModuleConfig, ServerConfig } from "../../compiler/models.js";


export class New {

    static server(config:ServerConfig):ServerConfig {
        return config;
    }

    static module(config:ModuleConfig):ModuleConfig {
        return config;
    }

}


export class Load {

    //! FIXME - Load.module<boolean>("", true);
    //! Consider this when writing docs and making context checker
    static module<T>(entry:string, context?:T):LoadModule {
        return { entry, context };
    }

}

