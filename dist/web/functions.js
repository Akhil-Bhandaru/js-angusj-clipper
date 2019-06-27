"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
var nativeEnumConversion_1 = require("./native/nativeEnumConversion");
var PathsToNativePaths_1 = require("./native/PathsToNativePaths");
var PathToNativePath_1 = require("./native/PathToNativePath");
function tryDelete() {
    var e_1, _a;
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    try {
        for (var objs_1 = __values(objs), objs_1_1 = objs_1.next(); !objs_1_1.done; objs_1_1 = objs_1.next()) {
            var obj = objs_1_1.value;
            if (!obj.isDeleted()) {
                obj.delete();
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (objs_1_1 && !objs_1_1.done && (_a = objs_1.return)) _a.call(objs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function area(path) {
    // we use JS since copying structures is slower than actually doing it
    var cnt = path.length;
    if (cnt < 3) {
        return 0;
    }
    var a = 0;
    for (var i = 0, j = cnt - 1; i < cnt; ++i) {
        a += (path[j].x + path[i].x) * (path[j].y - path[i].y);
        j = i;
    }
    return -a * 0.5;
}
exports.area = area;
function cleanPolygon(nativeLib, path, distance) {
    if (distance === void 0) { distance = 1.1415; }
    var nativePath = PathToNativePath_1.pathToNativePath(nativeLib, path);
    try {
        nativeLib.cleanPolygon(nativePath, distance);
        return PathToNativePath_1.nativePathToPath(nativeLib, nativePath, true); // frees nativePath
    }
    finally {
        tryDelete(nativePath);
    }
}
exports.cleanPolygon = cleanPolygon;
function cleanPolygons(nativeLib, paths, distance) {
    if (distance === void 0) { distance = 1.1415; }
    var nativePaths = PathsToNativePaths_1.pathsToNativePaths(nativeLib, paths);
    try {
        nativeLib.cleanPolygons(nativePaths, distance);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, nativePaths, true); // frees nativePath
    }
    finally {
        tryDelete(nativePaths);
    }
}
exports.cleanPolygons = cleanPolygons;
function addPolyNodeToPaths(polynode, nt, paths) {
    var match = true;
    switch (nt) {
        case 1 /* Open */:
            return;
        case 2 /* Closed */:
            match = !polynode.isOpen;
            break;
        default:
            break;
    }
    if (polynode.contour.length > 0 && match) {
        paths.push(polynode.contour);
    }
    for (var ii = 0, max = polynode.childs.length; ii < max; ii++) {
        var pn = polynode.childs[ii];
        addPolyNodeToPaths(pn, nt, paths);
    }
}
function closedPathsFromPolyTree(polyTree) {
    // we do this in JS since copying path is more expensive than just doing it
    var result = [];
    // result.Capacity = polytree.Total;
    addPolyNodeToPaths(polyTree, 2 /* Closed */, result);
    return result;
}
exports.closedPathsFromPolyTree = closedPathsFromPolyTree;
function minkowskiDiff(nativeLib, poly1, poly2) {
    var nativePath1 = PathToNativePath_1.pathToNativePath(nativeLib, poly1);
    var nativePath2 = PathToNativePath_1.pathToNativePath(nativeLib, poly2);
    var outNativePaths = new nativeLib.Paths();
    try {
        nativeLib.minkowskiDiff(nativePath1, nativePath2, outNativePaths);
        tryDelete(nativePath1, nativePath2);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, outNativePaths, true); // frees outNativePaths
    }
    finally {
        tryDelete(nativePath1, nativePath2, outNativePaths);
    }
}
exports.minkowskiDiff = minkowskiDiff;
function minkowskiSumPath(nativeLib, pattern, path, pathIsClosed) {
    var patternNativePath = PathToNativePath_1.pathToNativePath(nativeLib, pattern);
    var nativePath = PathToNativePath_1.pathToNativePath(nativeLib, path);
    var outNativePaths = new nativeLib.Paths();
    try {
        nativeLib.minkowskiSumPath(patternNativePath, nativePath, outNativePaths, pathIsClosed);
        tryDelete(patternNativePath, nativePath);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, outNativePaths, true); // frees outNativePaths
    }
    finally {
        tryDelete(patternNativePath, nativePath, outNativePaths);
    }
}
exports.minkowskiSumPath = minkowskiSumPath;
function minkowskiSumPaths(nativeLib, pattern, paths, pathIsClosed) {
    // TODO: im not sure if for this method we can reuse the input/output path
    var patternNativePath = PathToNativePath_1.pathToNativePath(nativeLib, pattern);
    var nativePaths = PathsToNativePaths_1.pathsToNativePaths(nativeLib, paths);
    try {
        nativeLib.minkowskiSumPaths(patternNativePath, nativePaths, nativePaths, pathIsClosed);
        tryDelete(patternNativePath);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, nativePaths, true); // frees nativePaths
    }
    finally {
        tryDelete(patternNativePath, nativePaths);
    }
}
exports.minkowskiSumPaths = minkowskiSumPaths;
function openPathsFromPolyTree(polyTree) {
    // we do this in JS since copying path is more expensive than just doing it
    var result = [];
    var len = polyTree.childs.length;
    result.length = len;
    var resultLength = 0;
    for (var i = 0; i < len; i++) {
        if (polyTree.childs[i].isOpen) {
            result[resultLength++] = polyTree.childs[i].contour;
        }
    }
    result.length = resultLength;
    return result;
}
exports.openPathsFromPolyTree = openPathsFromPolyTree;
function orientation(path) {
    return area(path) >= 0;
}
exports.orientation = orientation;
function pointInPolygon(point, path) {
    // we do this in JS since copying path is more expensive than just doing it
    // returns 0 if false, +1 if true, -1 if pt ON polygon boundary
    // See "The Point in Polygon Problem for Arbitrary Polygons" by Hormann & Agathos
    // http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.5498&rep=rep1&type=pdf
    var result = 0;
    var cnt = path.length;
    if (cnt < 3) {
        return 0;
    }
    var ip = path[0];
    for (var i = 1; i <= cnt; ++i) {
        var ipNext = i === cnt ? path[0] : path[i];
        if (ipNext.y === point.y) {
            if (ipNext.x === point.x || (ip.y === point.y && ipNext.x > point.x === ip.x < point.x)) {
                return -1;
            }
        }
        if (ip.y < point.y !== ipNext.y < point.y) {
            if (ip.x >= point.x) {
                if (ipNext.x > point.x) {
                    result = 1 - result;
                }
                else {
                    var d = (ip.x - point.x) * (ipNext.y - point.y) - (ipNext.x - point.x) * (ip.y - point.y);
                    if (d === 0) {
                        return -1;
                    }
                    else if (d > 0 === ipNext.y > ip.y) {
                        result = 1 - result;
                    }
                }
            }
            else {
                if (ipNext.x > point.x) {
                    var d = (ip.x - point.x) * (ipNext.y - point.y) - (ipNext.x - point.x) * (ip.y - point.y);
                    if (d === 0) {
                        return -1;
                    }
                    else if (d > 0 === ipNext.y > ip.y) {
                        result = 1 - result;
                    }
                }
            }
        }
        ip = ipNext;
    }
    return result;
}
exports.pointInPolygon = pointInPolygon;
function polyTreeToPaths(polyTree) {
    // we do this in JS since copying path is more expensive than just doing it
    var result = [];
    // result.Capacity = polytree.total;
    addPolyNodeToPaths(polyTree, 0 /* Any */, result);
    return result;
}
exports.polyTreeToPaths = polyTreeToPaths;
function reversePath(path) {
    // we use JS since copying structures is slower than actually doing it
    path.reverse();
}
exports.reversePath = reversePath;
function reversePaths(paths) {
    // we use JS since copying structures is slower than actually doing it
    for (var i = 0, max = paths.length; i < max; i++) {
        reversePath(paths[i]);
    }
}
exports.reversePaths = reversePaths;
function simplifyPolygon(nativeLib, path, fillType) {
    if (fillType === void 0) { fillType = enums_1.PolyFillType.EvenOdd; }
    var nativePath = PathToNativePath_1.pathToNativePath(nativeLib, path);
    var outNativePaths = new nativeLib.Paths();
    try {
        nativeLib.simplifyPolygon(nativePath, outNativePaths, nativeEnumConversion_1.polyFillTypeToNative(nativeLib, fillType));
        tryDelete(nativePath);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, outNativePaths, true); // frees outNativePaths
    }
    finally {
        tryDelete(nativePath, outNativePaths);
    }
}
exports.simplifyPolygon = simplifyPolygon;
function simplifyPolygons(nativeLib, paths, fillType) {
    if (fillType === void 0) { fillType = enums_1.PolyFillType.EvenOdd; }
    var nativePaths = PathsToNativePaths_1.pathsToNativePaths(nativeLib, paths);
    try {
        nativeLib.simplifyPolygonsOverwrite(nativePaths, nativeEnumConversion_1.polyFillTypeToNative(nativeLib, fillType));
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, nativePaths, true); // frees nativePaths
    }
    finally {
        tryDelete(nativePaths);
    }
}
exports.simplifyPolygons = simplifyPolygons;
function scalePath(path, scale) {
    var sol = [];
    var i = path.length;
    while (i--) {
        var p = path[i];
        sol.push({
            x: Math.round(p.x * scale),
            y: Math.round(p.y * scale)
        });
    }
    return sol;
}
exports.scalePath = scalePath;
/**
 * Scales all inner paths by multiplying all its coordinates by a number and then rounding them.
 *
 * @param paths - Paths to scale
 * @param scale - Scale multiplier
 * @return {Paths} - The scaled paths
 */
function scalePaths(paths, scale) {
    if (scale === 0) {
        return [];
    }
    var sol = [];
    var i = paths.length;
    while (i--) {
        var p = paths[i];
        sol.push(scalePath(p, scale));
    }
    return sol;
}
exports.scalePaths = scalePaths;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Z1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBNkQ7QUFJN0Qsc0VBQXFFO0FBQ3JFLGtFQUFxRjtBQUNyRiw4REFBK0U7QUFNL0UsU0FBUyxTQUFTOztJQUFDLGNBQTBCO1NBQTFCLFVBQTBCLEVBQTFCLHFCQUEwQixFQUExQixJQUEwQjtRQUExQix5QkFBMEI7OztRQUMzQyxLQUFrQixJQUFBLFNBQUEsU0FBQSxJQUFJLENBQUEsMEJBQUEsNENBQUU7WUFBbkIsSUFBTSxHQUFHLGlCQUFBO1lBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDcEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2Q7U0FDRjs7Ozs7Ozs7O0FBQ0gsQ0FBQztBQUVELFNBQWdCLElBQUksQ0FBQyxJQUFrQjtJQUNyQyxzRUFBc0U7SUFDdEUsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7UUFDWCxPQUFPLENBQUMsQ0FBQztLQUNWO0lBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN6QyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsR0FBRyxDQUFDLENBQUM7S0FDUDtJQUNE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LEtBQWE7SUFDNUQsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1FBQ2YsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELElBQU0sR0FBRyxHQUFVLEVBQUUsQ0FBQztJQUN0QixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3JCLE9BQU8sQ0FBQyxFQUFFLEVBQUU7UUFDVixJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDL0I7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFaRCxnQ0FZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvaW50SW5Qb2x5Z29uUmVzdWx0LCBQb2x5RmlsbFR5cGUgfSBmcm9tIFwiLi9lbnVtc1wiO1xuaW1wb3J0IHsgSW50UG9pbnQgfSBmcm9tIFwiLi9JbnRQb2ludFwiO1xuaW1wb3J0IHsgTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZVwiO1xuaW1wb3J0IHsgTmF0aXZlRGVsZXRhYmxlIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZURlbGV0YWJsZVwiO1xuaW1wb3J0IHsgcG9seUZpbGxUeXBlVG9OYXRpdmUgfSBmcm9tIFwiLi9uYXRpdmUvbmF0aXZlRW51bUNvbnZlcnNpb25cIjtcbmltcG9ydCB7IG5hdGl2ZVBhdGhzVG9QYXRocywgcGF0aHNUb05hdGl2ZVBhdGhzIH0gZnJvbSBcIi4vbmF0aXZlL1BhdGhzVG9OYXRpdmVQYXRoc1wiO1xuaW1wb3J0IHsgbmF0aXZlUGF0aFRvUGF0aCwgcGF0aFRvTmF0aXZlUGF0aCB9IGZyb20gXCIuL25hdGl2ZS9QYXRoVG9OYXRpdmVQYXRoXCI7XG5pbXBvcnQgeyBQYXRoLCBSZWFkb25seVBhdGggfSBmcm9tIFwiLi9QYXRoXCI7XG5pbXBvcnQgeyBQYXRocywgUmVhZG9ubHlQYXRocyB9IGZyb20gXCIuL1BhdGhzXCI7XG5pbXBvcnQgeyBQb2x5Tm9kZSB9IGZyb20gXCIuL1BvbHlOb2RlXCI7XG5pbXBvcnQgeyBQb2x5VHJlZSB9IGZyb20gXCIuL1BvbHlUcmVlXCI7XG5cbmZ1bmN0aW9uIHRyeURlbGV0ZSguLi5vYmpzOiBOYXRpdmVEZWxldGFibGVbXSkge1xuICBmb3IgKGNvbnN0IG9iaiBvZiBvYmpzKSB7XG4gICAgaWYgKCFvYmouaXNEZWxldGVkKCkpIHtcbiAgICAgIG9iai5kZWxldGUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFyZWEocGF0aDogUmVhZG9ubHlQYXRoKTogbnVtYmVyIHtcbiAgLy8gd2UgdXNlIEpTIHNpbmNlIGNvcHlpbmcgc3RydWN0dXJlcyBpcyBzbG93ZXIgdGhhbiBhY3R1YWxseSBkb2luZyBpdFxuICBjb25zdCBjbnQgPSBwYXRoLmxlbmd0aDtcbiAgaWYgKGNudCA8IDMpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBsZXQgYSA9IDA7XG4gIGZvciAobGV0IGkgPSAwLCBqID0gY250IC0gMTsgaSA8IGNudDsgKytpKSB7XG4gICAgYSArPSAocGF0aFtqXS54ICsgcGF0aFtpXS54KSAqIChwYXRoW2pdLnkgLSBwYXRoW2ldLnkpO1xuICAgIGogPSBpO1xuICB9XG4gIHJldHVybiAtYSAqIDAuNTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuUG9seWdvbihcbiAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIHBhdGg6IFJlYWRvbmx5UGF0aCxcbiAgZGlzdGFuY2UgPSAxLjE0MTVcbik6IFBhdGgge1xuICBjb25zdCBuYXRpdmVQYXRoID0gcGF0aFRvTmF0aXZlUGF0aChuYXRpdmVMaWIsIHBhdGgpO1xuICB0cnkge1xuICAgIG5hdGl2ZUxpYi5jbGVhblBvbHlnb24obmF0aXZlUGF0aCwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuYXRpdmVQYXRoVG9QYXRoKG5hdGl2ZUxpYiwgbmF0aXZlUGF0aCwgdHJ1ZSk7IC8vIGZyZWVzIG5hdGl2ZVBhdGhcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnlEZWxldGUobmF0aXZlUGF0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuUG9seWdvbnMoXG4gIG5hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxuICBwYXRoczogUmVhZG9ubHlQYXRocyxcbiAgZGlzdGFuY2UgPSAxLjE0MTVcbik6IFBhdGhzIHtcbiAgY29uc3QgbmF0aXZlUGF0aHMgPSBwYXRoc1RvTmF0aXZlUGF0aHMobmF0aXZlTGliLCBwYXRocyk7XG4gIHRyeSB7XG4gICAgbmF0aXZlTGliLmNsZWFuUG9seWdvbnMobmF0aXZlUGF0aHMsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmF0aXZlUGF0aHNUb1BhdGhzKG5hdGl2ZUxpYiwgbmF0aXZlUGF0aHMsIHRydWUpOyAvLyBmcmVlcyBuYXRpdmVQYXRoXG4gIH0gZmluYWxseSB7XG4gICAgdHJ5RGVsZXRlKG5hdGl2ZVBhdGhzKTtcbiAgfVxufVxuXG5jb25zdCBlbnVtIE5vZGVUeXBlIHtcbiAgQW55LFxuICBPcGVuLFxuICBDbG9zZWRcbn1cblxuZnVuY3Rpb24gYWRkUG9seU5vZGVUb1BhdGhzKHBvbHlub2RlOiBQb2x5Tm9kZSwgbnQ6IE5vZGVUeXBlLCBwYXRoczogUmVhZG9ubHlQYXRoW10pOiB2b2lkIHtcbiAgbGV0IG1hdGNoID0gdHJ1ZTtcbiAgc3dpdGNoIChudCkge1xuICAgIGNhc2UgTm9kZVR5cGUuT3BlbjpcbiAgICAgIHJldHVybjtcbiAgICBjYXNlIE5vZGVUeXBlLkNsb3NlZDpcbiAgICAgIG1hdGNoID0gIXBvbHlub2RlLmlzT3BlbjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmIChwb2x5bm9kZS5jb250b3VyLmxlbmd0aCA+IDAgJiYgbWF0Y2gpIHtcbiAgICBwYXRocy5wdXNoKHBvbHlub2RlLmNvbnRvdXIpO1xuICB9XG4gIGZvciAobGV0IGlpID0gMCwgbWF4ID0gcG9seW5vZGUuY2hpbGRzLmxlbmd0aDsgaWkgPCBtYXg7IGlpKyspIHtcbiAgICBjb25zdCBwbiA9IHBvbHlub2RlLmNoaWxkc1tpaV07XG4gICAgYWRkUG9seU5vZGVUb1BhdGhzKHBuLCBudCwgcGF0aHMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZWRQYXRoc0Zyb21Qb2x5VHJlZShwb2x5VHJlZTogUG9seVRyZWUpOiBQYXRocyB7XG4gIC8vIHdlIGRvIHRoaXMgaW4gSlMgc2luY2UgY29weWluZyBwYXRoIGlzIG1vcmUgZXhwZW5zaXZlIHRoYW4ganVzdCBkb2luZyBpdFxuXG4gIGNvbnN0IHJlc3VsdDogUGF0aHMgPSBbXTtcbiAgLy8gcmVzdWx0LkNhcGFjaXR5ID0gcG9seXRyZWUuVG90YWw7XG4gIGFkZFBvbHlOb2RlVG9QYXRocyhwb2x5VHJlZSwgTm9kZVR5cGUuQ2xvc2VkLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWlua293c2tpRGlmZihcbiAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIHBvbHkxOiBSZWFkb25seVBhdGgsXG4gIHBvbHkyOiBSZWFkb25seVBhdGhcbik6IFBhdGhzIHtcbiAgY29uc3QgbmF0aXZlUGF0aDEgPSBwYXRoVG9OYXRpdmVQYXRoKG5hdGl2ZUxpYiwgcG9seTEpO1xuICBjb25zdCBuYXRpdmVQYXRoMiA9IHBhdGhUb05hdGl2ZVBhdGgobmF0aXZlTGliLCBwb2x5Mik7XG4gIGNvbnN0IG91dE5hdGl2ZVBhdGhzID0gbmV3IG5hdGl2ZUxpYi5QYXRocygpO1xuXG4gIHRyeSB7XG4gICAgbmF0aXZlTGliLm1pbmtvd3NraURpZmYobmF0aXZlUGF0aDEsIG5hdGl2ZVBhdGgyLCBvdXROYXRpdmVQYXRocyk7XG4gICAgdHJ5RGVsZXRlKG5hdGl2ZVBhdGgxLCBuYXRpdmVQYXRoMik7XG4gICAgcmV0dXJuIG5hdGl2ZVBhdGhzVG9QYXRocyhuYXRpdmVMaWIsIG91dE5hdGl2ZVBhdGhzLCB0cnVlKTsgLy8gZnJlZXMgb3V0TmF0aXZlUGF0aHNcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnlEZWxldGUobmF0aXZlUGF0aDEsIG5hdGl2ZVBhdGgyLCBvdXROYXRpdmVQYXRocyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pbmtvd3NraVN1bVBhdGgoXG4gIG5hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxuICBwYXR0ZXJuOiBSZWFkb25seVBhdGgsXG4gIHBhdGg6IFJlYWRvbmx5UGF0aCxcbiAgcGF0aElzQ2xvc2VkOiBib29sZWFuXG4pOiBQYXRocyB7XG4gIGNvbnN0IHBhdHRlcm5OYXRpdmVQYXRoID0gcGF0aFRvTmF0aXZlUGF0aChuYXRpdmVMaWIsIHBhdHRlcm4pO1xuICBjb25zdCBuYXRpdmVQYXRoID0gcGF0aFRvTmF0aXZlUGF0aChuYXRpdmVMaWIsIHBhdGgpO1xuICBjb25zdCBvdXROYXRpdmVQYXRocyA9IG5ldyBuYXRpdmVMaWIuUGF0aHMoKTtcblxuICB0cnkge1xuICAgIG5hdGl2ZUxpYi5taW5rb3dza2lTdW1QYXRoKHBhdHRlcm5OYXRpdmVQYXRoLCBuYXRpdmVQYXRoLCBvdXROYXRpdmVQYXRocywgcGF0aElzQ2xvc2VkKTtcbiAgICB0cnlEZWxldGUocGF0dGVybk5hdGl2ZVBhdGgsIG5hdGl2ZVBhdGgpO1xuICAgIHJldHVybiBuYXRpdmVQYXRoc1RvUGF0aHMobmF0aXZlTGliLCBvdXROYXRpdmVQYXRocywgdHJ1ZSk7IC8vIGZyZWVzIG91dE5hdGl2ZVBhdGhzXG4gIH0gZmluYWxseSB7XG4gICAgdHJ5RGVsZXRlKHBhdHRlcm5OYXRpdmVQYXRoLCBuYXRpdmVQYXRoLCBvdXROYXRpdmVQYXRocyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pbmtvd3NraVN1bVBhdGhzKFxuICBuYXRpdmVMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcbiAgcGF0dGVybjogUmVhZG9ubHlQYXRoLFxuICBwYXRoczogUmVhZG9ubHlQYXRocyxcbiAgcGF0aElzQ2xvc2VkOiBib29sZWFuXG4pOiBQYXRocyB7XG4gIC8vIFRPRE86IGltIG5vdCBzdXJlIGlmIGZvciB0aGlzIG1ldGhvZCB3ZSBjYW4gcmV1c2UgdGhlIGlucHV0L291dHB1dCBwYXRoXG5cbiAgY29uc3QgcGF0dGVybk5hdGl2ZVBhdGggPSBwYXRoVG9OYXRpdmVQYXRoKG5hdGl2ZUxpYiwgcGF0dGVybik7XG4gIGNvbnN0IG5hdGl2ZVBhdGhzID0gcGF0aHNUb05hdGl2ZVBhdGhzKG5hdGl2ZUxpYiwgcGF0aHMpO1xuXG4gIHRyeSB7XG4gICAgbmF0aXZlTGliLm1pbmtvd3NraVN1bVBhdGhzKHBhdHRlcm5OYXRpdmVQYXRoLCBuYXRpdmVQYXRocywgbmF0aXZlUGF0aHMsIHBhdGhJc0Nsb3NlZCk7XG4gICAgdHJ5RGVsZXRlKHBhdHRlcm5OYXRpdmVQYXRoKTtcbiAgICByZXR1cm4gbmF0aXZlUGF0aHNUb1BhdGhzKG5hdGl2ZUxpYiwgbmF0aXZlUGF0aHMsIHRydWUpOyAvLyBmcmVlcyBuYXRpdmVQYXRoc1xuICB9IGZpbmFsbHkge1xuICAgIHRyeURlbGV0ZShwYXR0ZXJuTmF0aXZlUGF0aCwgbmF0aXZlUGF0aHMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuUGF0aHNGcm9tUG9seVRyZWUocG9seVRyZWU6IFBvbHlUcmVlKTogUmVhZG9ubHlQYXRoW10ge1xuICAvLyB3ZSBkbyB0aGlzIGluIEpTIHNpbmNlIGNvcHlpbmcgcGF0aCBpcyBtb3JlIGV4cGVuc2l2ZSB0aGFuIGp1c3QgZG9pbmcgaXRcblxuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgY29uc3QgbGVuID0gcG9seVRyZWUuY2hpbGRzLmxlbmd0aDtcbiAgcmVzdWx0Lmxlbmd0aCA9IGxlbjtcbiAgbGV0IHJlc3VsdExlbmd0aCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAocG9seVRyZWUuY2hpbGRzW2ldLmlzT3Blbikge1xuICAgICAgcmVzdWx0W3Jlc3VsdExlbmd0aCsrXSA9IHBvbHlUcmVlLmNoaWxkc1tpXS5jb250b3VyO1xuICAgIH1cbiAgfVxuICByZXN1bHQubGVuZ3RoID0gcmVzdWx0TGVuZ3RoO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3JpZW50YXRpb24ocGF0aDogUmVhZG9ubHlQYXRoKTogYm9vbGVhbiB7XG4gIHJldHVybiBhcmVhKHBhdGgpID49IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludEluUG9seWdvbihcbiAgcG9pbnQ6IFJlYWRvbmx5PEludFBvaW50PixcbiAgcGF0aDogUmVhZG9ubHlQYXRoXG4pOiBQb2ludEluUG9seWdvblJlc3VsdCB7XG4gIC8vIHdlIGRvIHRoaXMgaW4gSlMgc2luY2UgY29weWluZyBwYXRoIGlzIG1vcmUgZXhwZW5zaXZlIHRoYW4ganVzdCBkb2luZyBpdFxuXG4gIC8vIHJldHVybnMgMCBpZiBmYWxzZSwgKzEgaWYgdHJ1ZSwgLTEgaWYgcHQgT04gcG9seWdvbiBib3VuZGFyeVxuICAvLyBTZWUgXCJUaGUgUG9pbnQgaW4gUG9seWdvbiBQcm9ibGVtIGZvciBBcmJpdHJhcnkgUG9seWdvbnNcIiBieSBIb3JtYW5uICYgQWdhdGhvc1xuICAvLyBodHRwOi8vY2l0ZXNlZXJ4LmlzdC5wc3UuZWR1L3ZpZXdkb2MvZG93bmxvYWQ/ZG9pPTEwLjEuMS44OC41NDk4JnJlcD1yZXAxJnR5cGU9cGRmXG4gIGxldCByZXN1bHQgPSAwO1xuICBjb25zdCBjbnQgPSBwYXRoLmxlbmd0aDtcbiAgaWYgKGNudCA8IDMpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBsZXQgaXAgPSBwYXRoWzBdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSBjbnQ7ICsraSkge1xuICAgIGNvbnN0IGlwTmV4dCA9IGkgPT09IGNudCA/IHBhdGhbMF0gOiBwYXRoW2ldO1xuICAgIGlmIChpcE5leHQueSA9PT0gcG9pbnQueSkge1xuICAgICAgaWYgKGlwTmV4dC54ID09PSBwb2ludC54IHx8IChpcC55ID09PSBwb2ludC55ICYmIGlwTmV4dC54ID4gcG9pbnQueCA9PT0gaXAueCA8IHBvaW50LngpKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlwLnkgPCBwb2ludC55ICE9PSBpcE5leHQueSA8IHBvaW50LnkpIHtcbiAgICAgIGlmIChpcC54ID49IHBvaW50LngpIHtcbiAgICAgICAgaWYgKGlwTmV4dC54ID4gcG9pbnQueCkge1xuICAgICAgICAgIHJlc3VsdCA9IDEgLSByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZCA9XG4gICAgICAgICAgICAoaXAueCAtIHBvaW50LngpICogKGlwTmV4dC55IC0gcG9pbnQueSkgLSAoaXBOZXh0LnggLSBwb2ludC54KSAqIChpcC55IC0gcG9pbnQueSk7XG4gICAgICAgICAgaWYgKGQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGQgPiAwID09PSBpcE5leHQueSA+IGlwLnkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IDEgLSByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXBOZXh0LnggPiBwb2ludC54KSB7XG4gICAgICAgICAgY29uc3QgZCA9XG4gICAgICAgICAgICAoaXAueCAtIHBvaW50LngpICogKGlwTmV4dC55IC0gcG9pbnQueSkgLSAoaXBOZXh0LnggLSBwb2ludC54KSAqIChpcC55IC0gcG9pbnQueSk7XG4gICAgICAgICAgaWYgKGQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGQgPiAwID09PSBpcE5leHQueSA+IGlwLnkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IDEgLSByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlwID0gaXBOZXh0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5VHJlZVRvUGF0aHMocG9seVRyZWU6IFBvbHlUcmVlKTogUGF0aHMge1xuICAvLyB3ZSBkbyB0aGlzIGluIEpTIHNpbmNlIGNvcHlpbmcgcGF0aCBpcyBtb3JlIGV4cGVuc2l2ZSB0aGFuIGp1c3QgZG9pbmcgaXRcblxuICBjb25zdCByZXN1bHQ6IFBhdGhzID0gW107XG4gIC8vIHJlc3VsdC5DYXBhY2l0eSA9IHBvbHl0cmVlLnRvdGFsO1xuICBhZGRQb2x5Tm9kZVRvUGF0aHMocG9seVRyZWUsIE5vZGVUeXBlLkFueSwgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2VQYXRoKHBhdGg6IFBhdGgpOiB2b2lkIHtcbiAgLy8gd2UgdXNlIEpTIHNpbmNlIGNvcHlpbmcgc3RydWN0dXJlcyBpcyBzbG93ZXIgdGhhbiBhY3R1YWxseSBkb2luZyBpdFxuICBwYXRoLnJldmVyc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2VQYXRocyhwYXRoczogUGF0aHMpOiB2b2lkIHtcbiAgLy8gd2UgdXNlIEpTIHNpbmNlIGNvcHlpbmcgc3RydWN0dXJlcyBpcyBzbG93ZXIgdGhhbiBhY3R1YWxseSBkb2luZyBpdFxuICBmb3IgKGxldCBpID0gMCwgbWF4ID0gcGF0aHMubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcbiAgICByZXZlcnNlUGF0aChwYXRoc1tpXSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpbXBsaWZ5UG9seWdvbihcbiAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIHBhdGg6IFJlYWRvbmx5UGF0aCxcbiAgZmlsbFR5cGU6IFBvbHlGaWxsVHlwZSA9IFBvbHlGaWxsVHlwZS5FdmVuT2RkXG4pOiBQYXRocyB7XG4gIGNvbnN0IG5hdGl2ZVBhdGggPSBwYXRoVG9OYXRpdmVQYXRoKG5hdGl2ZUxpYiwgcGF0aCk7XG4gIGNvbnN0IG91dE5hdGl2ZVBhdGhzID0gbmV3IG5hdGl2ZUxpYi5QYXRocygpO1xuICB0cnkge1xuICAgIG5hdGl2ZUxpYi5zaW1wbGlmeVBvbHlnb24oXG4gICAgICBuYXRpdmVQYXRoLFxuICAgICAgb3V0TmF0aXZlUGF0aHMsXG4gICAgICBwb2x5RmlsbFR5cGVUb05hdGl2ZShuYXRpdmVMaWIsIGZpbGxUeXBlKVxuICAgICk7XG4gICAgdHJ5RGVsZXRlKG5hdGl2ZVBhdGgpO1xuICAgIHJldHVybiBuYXRpdmVQYXRoc1RvUGF0aHMobmF0aXZlTGliLCBvdXROYXRpdmVQYXRocywgdHJ1ZSk7IC8vIGZyZWVzIG91dE5hdGl2ZVBhdGhzXG4gIH0gZmluYWxseSB7XG4gICAgdHJ5RGVsZXRlKG5hdGl2ZVBhdGgsIG91dE5hdGl2ZVBhdGhzKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnlQb2x5Z29ucyhcbiAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIHBhdGhzOiBSZWFkb25seVBhdGhzLFxuICBmaWxsVHlwZTogUG9seUZpbGxUeXBlID0gUG9seUZpbGxUeXBlLkV2ZW5PZGRcbik6IFBhdGhzIHtcbiAgY29uc3QgbmF0aXZlUGF0aHMgPSBwYXRoc1RvTmF0aXZlUGF0aHMobmF0aXZlTGliLCBwYXRocyk7XG4gIHRyeSB7XG4gICAgbmF0aXZlTGliLnNpbXBsaWZ5UG9seWdvbnNPdmVyd3JpdGUobmF0aXZlUGF0aHMsIHBvbHlGaWxsVHlwZVRvTmF0aXZlKG5hdGl2ZUxpYiwgZmlsbFR5cGUpKTtcbiAgICByZXR1cm4gbmF0aXZlUGF0aHNUb1BhdGhzKG5hdGl2ZUxpYiwgbmF0aXZlUGF0aHMsIHRydWUpOyAvLyBmcmVlcyBuYXRpdmVQYXRoc1xuICB9IGZpbmFsbHkge1xuICAgIHRyeURlbGV0ZShuYXRpdmVQYXRocyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlUGF0aChwYXRoOiBSZWFkb25seVBhdGgsIHNjYWxlOiBudW1iZXIpOiBQYXRoIHtcbiAgY29uc3Qgc29sOiBQYXRoID0gW107XG4gIGxldCBpID0gcGF0aC5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBjb25zdCBwID0gcGF0aFtpXTtcbiAgICBzb2wucHVzaCh7XG4gICAgICB4OiBNYXRoLnJvdW5kKHAueCAqIHNjYWxlKSxcbiAgICAgIHk6IE1hdGgucm91bmQocC55ICogc2NhbGUpXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHNvbDtcbn1cblxuLyoqXG4gKiBTY2FsZXMgYWxsIGlubmVyIHBhdGhzIGJ5IG11bHRpcGx5aW5nIGFsbCBpdHMgY29vcmRpbmF0ZXMgYnkgYSBudW1iZXIgYW5kIHRoZW4gcm91bmRpbmcgdGhlbS5cbiAqXG4gKiBAcGFyYW0gcGF0aHMgLSBQYXRocyB0byBzY2FsZVxuICogQHBhcmFtIHNjYWxlIC0gU2NhbGUgbXVsdGlwbGllclxuICogQHJldHVybiB7UGF0aHN9IC0gVGhlIHNjYWxlZCBwYXRoc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVQYXRocyhwYXRoczogUmVhZG9ubHlQYXRocywgc2NhbGU6IG51bWJlcik6IFBhdGhzIHtcbiAgaWYgKHNjYWxlID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3Qgc29sOiBQYXRocyA9IFtdO1xuICBsZXQgaSA9IHBhdGhzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIGNvbnN0IHAgPSBwYXRoc1tpXTtcbiAgICBzb2wucHVzaChzY2FsZVBhdGgocCwgc2NhbGUpKTtcbiAgfVxuICByZXR1cm4gc29sO1xufVxuIl19