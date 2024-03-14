
export type DirectoryStructureFile = {
    filename: string;
    filepath: string;
    segments: string[];
}


export type DirectoryStructureTree = {
    files: DirectoryStructureFile[];
    directories: { [key:string]:DirectoryStructureTree };
}

export type DirectoryStructure = {
    tree: DirectoryStructureTree;
    list: DirectoryStructureFile[];
}
