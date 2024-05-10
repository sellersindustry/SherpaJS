import { Path } from "../../utilities/path/index.js";
import { Segment, AssetTree } from "../../models.js";
import { DirectoryStructureTree } from "../../utilities/path/directory-structure/model.js";


export function getAssets(assetTree:DirectoryStructureTree, segments:Segment[]=[]):AssetTree {
    let assets:AssetTree = {};
    if (assetTree.files.length > 0) {
        assets["."] = assetTree.files.map(file => {
            return {
                filepath: file.filepath.absolute,
                filename: Path.getFilename(file.filepath.absolute),
                segments: segments
            }
        });
    }

    for (let segmentName of Object.keys(assetTree.directories)) {
        let segmentKey = `/${segmentName}`;
        if (assets[segmentKey]) {
            throw new Error(`Overlapping asset segment: "${segmentKey}".`);
        }
        assets[segmentKey] = getAssets(
            assetTree.directories[segmentName],
            [...segments, { name: segmentName, isDynamic: false }]
        );
    }

    return assets;
}

