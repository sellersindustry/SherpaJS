import { Path } from "../../utilities/path/index.js";
import { Segment, AssetTree, Asset } from "../../models.js";
import { Level, Message } from "../../utilities/logger/model.js";
import { DirectoryStructureTree } from "../../utilities/path/directory-structure/model.js";


export function getAssets(assetTree:DirectoryStructureTree, segments:Segment[]):AssetTree {
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


export function mergeAssets(assetsA:AssetTree, assetsB:AssetTree, segments:Segment[]):{ logs:Message[], assets:AssetTree } {
    let logs:Message[] = [];
    logs.push(...getDiagnosisOverlappingFiles(assetsA, assetsB, segments));
    logs.push(...getDiagnosisOverlappingDirectories(assetsA, assetsB, segments));
    
    let assets:AssetTree = {};
    if (assetsA["."] || assetsB["."]) {
        assets["."] = [];
        if (assetsA["."]) {
            assets["."].push(...(assetsA["."] as Asset[]));
        }
        if (assetsB["."]) {
            assets["."].push(...(assetsB["."] as Asset[]));
        }
    }

    Object.keys(assetsA).filter(segment => segment != ".").forEach(segment => {
        let _assetsA = (assetsA[segment] ? assetsA[segment] : {}) as AssetTree;
        let _assetsB = (assetsB[segment] ? assetsB[segment] : {}) as AssetTree;
        let { logs: _logs, assets: _assets } = mergeAssets(_assetsA, _assetsB, [...segments, { name: segment.replace("/", ""), isDynamic: false }]);
        logs.push(..._logs);
        assets[segment] = _assets;
    });

    Object.keys(assetsB).filter(segment => segment != ".").forEach(segment => {
        if (assets[segment]) {
            return;
        }
        let _assetsA = (assetsA[segment] ? assetsA[segment] : {}) as AssetTree;
        let _assetsB = (assetsB[segment] ? assetsB[segment] : {}) as AssetTree;
        let { logs: _logs, assets: _assets } = mergeAssets(_assetsA, _assetsB, [...segments, { name: segment.replace("/", ""), isDynamic: false }]);
        logs.push(..._logs);
        assets[segment] = _assets;
    });

    return { logs, assets: assets };
}


function getDiagnosisOverlappingFiles(assetsA:AssetTree, assetsB:AssetTree, segments:Segment[]):Message[] {
    let filesA       = assetsA["."] ? (assetsA["."] as Asset[]) : [];
    let filesB       = assetsB["."] ? (assetsB["."] as Asset[]) : [];
    let filesOverlap = filesA.filter(f => filesB.map(b => b.filename).includes(f.filename));
    return filesOverlap.map((file) => {
        let overlappingFile = filesB.filter(b => b.filename == file.filename)[0];
        return {
            level: Level.ERROR,
            text: `Asset file conflict: "${segments.map(segment => segment.name).join("/")}/${file.filename}"`,
            content: [
                `An asset file is being loaded in the same location as a module is attempting to load another file.`,
                `To avoid this ensure that asset directory names do not overlap with route directory names.`,
                `at (${overlappingFile.filepath})`
            ].join("\n   "),
            file: {
                filepath: file.filepath
            }
        }
    });
}


function getDiagnosisOverlappingDirectories(assetsA:AssetTree, assetsB:AssetTree, segments:Segment[]):Message[] {
    let dirsA       = Object.keys(assetsA).filter(segment => segment != ".");
    let dirsB       = Object.keys(assetsB).filter(segment => segment != ".");
    let dirsOverlap = dirsA.filter(d => dirsB.includes(d));
    return dirsOverlap.map((dirName) => {
        return {
            level: Level.WARN,
            text: `Potential asset file conflict, caused by the "${segments.map(segment => segment.name).join("/")}${dirName}" directory.`,
            content: "To avoid this ensure that asset directory names do not overlap with route directory names."
        }
    });
}

