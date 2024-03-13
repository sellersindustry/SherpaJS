import fs from "fs";
import path from "path";


export type TreeFileStructure = {
    files: string[];
    directories: { [key:string]:TreeFileStructure };
}


export type ListFileStructure = {
    filename: string;
    filepath: string;
    location: string[];
}


export type FileStructure = {
    tree: TreeFileStructure;
    list: ListFileStructure[];
}


export function fileStructure(directory:string):FileStructure {
    let tree = treeFileStructure(directory);
    return {
        tree: tree,
        list: listFileStructure(tree, directory)
    }
}


function treeFileStructure(directory:string):TreeFileStructure {
    return {
        files: getFiles(directory),
        directories: getDirectories(directory).reduce((dirs, segment) => {
            return { ...dirs, [segment]: treeFileStructure(path.join(directory, segment)) };
        }, {})
    }
}


function listFileStructure(structure:TreeFileStructure, directory:string):ListFileStructure[] {
    return recursiveListFileStructure(structure, directory, []);
}


function recursiveListFileStructure(structure:TreeFileStructure, relPath:string, segments:string[]):ListFileStructure[] {
    let files:ListFileStructure[] = [];
    for (let filename of structure.files) {
        files.push({
            filename: filename,
            filepath: path.join(relPath, [...segments, filename].join("/")),
            location: segments
        });
    }
    for (let [dirName, dirStructure] of Object.entries(structure.directories)) {
        files.push(...recursiveListFileStructure(dirStructure, relPath, [...segments, dirName]));
    }
    return files;
}


function getFiles(directory:string):string[] {
    return fs.readdirSync(directory).filter((segment:string) => {
        return fs.statSync(segment).isFile();
    });
}


function getDirectories(directory:string):string[] {
    return fs.readdirSync(directory).filter((segment:string) => {
        return fs.statSync(segment).isDirectory();
    });
}

