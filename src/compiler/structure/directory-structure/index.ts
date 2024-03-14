import fs from "fs";
import path from "path";
import {
    DirectoryStructureFile as File,
    DirectoryStructureTree as Tree,
    DirectoryStructure as Structure
} from "./model.js";


export function getDirectoryStructure(directory:string):Structure {
    let tree = getTreeStructure(directory);
    return {
        tree: tree,
        list: flattenTreeStructure(tree)
    }
}


function getTreeStructure(directory:string, segments:string[]=[]):Tree {
    return {
        files: getFiles(directory, segments),
        directories: getDirectories(directory).reduce((directories, segment) => {
            let nextDirectory = path.join(directory, segment);
            let nextSegments  = [...segments, segment];
            return {
                ...directories,
                [segment]: getTreeStructure(nextDirectory, nextSegments)
            };
        }, {})
    }
}


function getFiles(directory:string, segments:string[]):File[] {
    return fs.readdirSync(directory).filter((segment:string) => {
        return fs.statSync(path.join(directory, segment)).isFile();
    }).map((filename) => {
        return {
            filename: filename,
            filepath: path.join(directory, filename),
            segments: segments
        }
    });
}


function getDirectories(directory:string):string[] {
    return fs.readdirSync(directory).filter((segment:string) => {
        return fs.statSync(path.join(directory, segment)).isDirectory();
    });
}


function flattenTreeStructure(structure:Tree):File[] {
    return [
        ...structure.files,
        ...Object.keys(structure.directories).map((dirName) => {
            return flattenTreeStructure(structure.directories[dirName])
        }).flat()
    ]
}

