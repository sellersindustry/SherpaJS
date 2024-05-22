/*
 *   Copyright (C) 2024 Sellers Industries, Inc.
 *   distributed under the MIT License
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Fri May 3 2024
 *   file: index.ts
 *   project: SherpaJS - Module Microservice Platform
 *   purpose: Get Assets
 *
 */


import { Path } from "../../utilities/path/index.js";
import { Segment, AssetTree, Asset } from "../../models.js";
import { DirectoryStructureTree } from "../../utilities/path/directory-structure/model.js";
import { Message } from "../../utilities/logger/model.js";
import { getAssetFiles } from "./files.js";
import { RequestUtilities } from "../../../native/request/utilities.js";


export function getAssets(entry:string):{ assets:AssetTree, logs:Message[] } {
    let { files, logs } = getAssetFiles(entry);
    return {
        assets: getAssetTree(files.tree),
        logs
    };
}


export function flattenAssets(assetTree?:AssetTree):Asset[] {
    if (!assetTree) return [];
    if (assetTree["filepath"]) return [assetTree as unknown as Asset];

    let assetList:Asset[] = [];
    if (assetTree["."]) {
        assetList.push(...assetTree["."] as Asset[]);
    }

    let segments = Object.keys(assetTree).filter(segment => segment != ".");
    assetList.push(...segments.map(segment => flattenAssets(assetTree[segment] as AssetTree)).flat());
    return assetList.flat().sort(sortAssets);
}


function sortAssets(assetA:Asset, assetB:Asset):number {
    return RequestUtilities.compareURL(assetA.segments, assetB.segments);
}


function getAssetTree(assetTree:DirectoryStructureTree, segments:Segment[]=[]):AssetTree {
    let assets:AssetTree = {};
    if (assetTree.files.length > 0) {
        assets["."] = assetTree.files.map(file => {
            return {
                filepath: file.filepath.absolute,
                filename: Path.getFilename(file.filepath.absolute),
                segments: segments,
                path: RequestUtilities.getDynamicURL(segments) + "/" + Path.getFilename(file.filepath.absolute)
            }
        });
    }

    for (let segmentName of Object.keys(assetTree.directories)) {
        let segmentKey = `/${segmentName}`;
        if (assets[segmentKey]) {
            throw new Error(`Overlapping asset segment: "${segmentKey}".`);
        }
        assets[segmentKey] = getAssetTree(
            assetTree.directories[segmentName],
            [...segments, { name: segmentName, isDynamic: false }]
        );
    }

    return assets;
}


// When God raised up his servant, he sent him first to you to bless you by
// turning each of you from your wicked ways.
// - Acts 3:26
