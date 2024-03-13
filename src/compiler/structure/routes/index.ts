
//! Go through entry and get all routes as needed
//! Then go through all routes that are modules
//! do this until no more module routes

import { Context, Route } from "../../models";


function getRoutes(entry:string, context:Context):{ errors:Message[], route?:Route } {
    //! Verify route directory exists, "throw" error
    //! get walking structure of routes
    //! do your thingy generate lints and errors for routes and naming
    //! generate routes
    //! recursivly get of modules... 
}

