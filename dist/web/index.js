"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var clipFunctions_1 = require("./clipFunctions");
var ClipperError_1 = require("./ClipperError");
exports.ClipperError = ClipperError_1.ClipperError;
var constants_1 = require("./constants");
var enums_1 = require("./enums");
exports.ClipType = enums_1.ClipType;
exports.EndType = enums_1.EndType;
exports.JoinType = enums_1.JoinType;
exports.NativeClipperLibLoadedFormat = enums_1.NativeClipperLibLoadedFormat;
exports.NativeClipperLibRequestedFormat = enums_1.NativeClipperLibRequestedFormat;
exports.PointInPolygonResult = enums_1.PointInPolygonResult;
exports.PolyFillType = enums_1.PolyFillType;
var functions = require("./functions");
var offsetFunctions_1 = require("./offsetFunctions");
var PolyNode_1 = require("./PolyNode");
exports.PolyNode = PolyNode_1.PolyNode;
var PolyTree_1 = require("./PolyTree");
exports.PolyTree = PolyTree_1.PolyTree;
var wasmModule;
var asmJsModule;
/**
 * A wrapper for the Native Clipper Library instance with all the operations available.
 */
var ClipperLibWrapper = /** @class */ (function () {
    /**
     * Internal constructor. Use loadNativeClipperLibInstanceAsync instead.
     *
     * @param instance
     * @param format
     */
    function ClipperLibWrapper(instance, format) {
        this.format = format;
        this.instance = instance;
    }
    /**
     * Performs a polygon clipping (boolean) operation, returning the resulting Paths or throwing an error if failed.
     *
     * The solution parameter in this case is a Paths or PolyTree structure. The Paths structure is simpler than the PolyTree structure. Because of this it is
     * quicker to populate and hence clipping performance is a little better (it's roughly 10% faster). However, the PolyTree data structure provides more
     * information about the returned paths which may be important to users. Firstly, the PolyTree structure preserves nested parent-child polygon relationships
     * (ie outer polygons owning/containing holes and holes owning/containing other outer polygons etc). Also, only the PolyTree structure can differentiate
     * between open and closed paths since each PolyNode has an IsOpen property. (The Path structure has no member indicating whether it's open or closed.)
     * For this reason, when open paths are passed to a Clipper object, the user must use a PolyTree object as the solution parameter, otherwise an exception
     * will be raised.
     *
     * When a PolyTree object is used in a clipping operation on open paths, two ancilliary functions have been provided to quickly separate out open and
     * closed paths from the solution - OpenPathsFromPolyTree and ClosedPathsFromPolyTree. PolyTreeToPaths is also available to convert path data to a Paths
     * structure (irrespective of whether they're open or closed).
     *
     * There are several things to note about the solution paths returned:
     * - they aren't in any specific order
     * - they should never overlap or be self-intersecting (but see notes on rounding)
     * - holes will be oriented opposite outer polygons
     * - the solution fill type can be considered either EvenOdd or NonZero since it will comply with either filling rule
     * - polygons may rarely share a common edge (though this is now very rare as of version 6)
     *
     * @param params - clipping operation data
     * @return {Paths} - the resulting Paths.
     */
    ClipperLibWrapper.prototype.clipToPaths = function (params) {
        return clipFunctions_1.clipToPaths(this.instance, params);
    };
    /**
     * Performs a polygon clipping (boolean) operation, returning the resulting PolyTree or throwing an error if failed.
     *
     * The solution parameter in this case is a Paths or PolyTree structure. The Paths structure is simpler than the PolyTree structure. Because of this it is
     * quicker to populate and hence clipping performance is a little better (it's roughly 10% faster). However, the PolyTree data structure provides more
     * information about the returned paths which may be important to users. Firstly, the PolyTree structure preserves nested parent-child polygon relationships
     * (ie outer polygons owning/containing holes and holes owning/containing other outer polygons etc). Also, only the PolyTree structure can differentiate
     * between open and closed paths since each PolyNode has an IsOpen property. (The Path structure has no member indicating whether it's open or closed.)
     * For this reason, when open paths are passed to a Clipper object, the user must use a PolyTree object as the solution parameter, otherwise an exception
     * will be raised.
     *
     * When a PolyTree object is used in a clipping operation on open paths, two ancilliary functions have been provided to quickly separate out open and
     * closed paths from the solution - OpenPathsFromPolyTree and ClosedPathsFromPolyTree. PolyTreeToPaths is also available to convert path data to a Paths
     * structure (irrespective of whether they're open or closed).
     *
     * There are several things to note about the solution paths returned:
     * - they aren't in any specific order
     * - they should never overlap or be self-intersecting (but see notes on rounding)
     * - holes will be oriented opposite outer polygons
     * - the solution fill type can be considered either EvenOdd or NonZero since it will comply with either filling rule
     * - polygons may rarely share a common edge (though this is now very rare as of version 6)
     *
     * @param params - clipping operation data
     * @return {PolyTree} - the resulting PolyTree or undefined.
     */
    ClipperLibWrapper.prototype.clipToPolyTree = function (params) {
        return clipFunctions_1.clipToPolyTree(this.instance, params);
    };
    /**
     * Performs a polygon offset operation, returning the resulting Paths or undefined if failed.
     *
     * This method encapsulates the process of offsetting (inflating/deflating) both open and closed paths using a number of different join types
     * and end types.
     *
     * Preconditions for offsetting:
     * 1. The orientations of closed paths must be consistent such that outer polygons share the same orientation, and any holes have the opposite orientation
     * (ie non-zero filling). Open paths must be oriented with closed outer polygons.
     * 2. Polygons must not self-intersect.
     *
     * Limitations:
     * When offsetting, small artefacts may appear where polygons overlap. To avoid these artefacts, offset overlapping polygons separately.
     *
     * @param params - offset operation params
     * @return {Paths|undefined} - the resulting Paths or undefined if failed.
     */
    ClipperLibWrapper.prototype.offsetToPaths = function (params) {
        return offsetFunctions_1.offsetToPaths(this.instance, params);
    };
    /**
     * Performs a polygon offset operation, returning the resulting PolyTree or undefined if failed.
     *
     * This method encapsulates the process of offsetting (inflating/deflating) both open and closed paths using a number of different join types
     * and end types.
     *
     * Preconditions for offsetting:
     * 1. The orientations of closed paths must be consistent such that outer polygons share the same orientation, and any holes have the opposite orientation
     * (ie non-zero filling). Open paths must be oriented with closed outer polygons.
     * 2. Polygons must not self-intersect.
     *
     * Limitations:
     * When offsetting, small artefacts may appear where polygons overlap. To avoid these artefacts, offset overlapping polygons separately.
     *
     * @param params - offset operation params
     * @return {PolyTree|undefined} - the resulting PolyTree or undefined if failed.
     */
    ClipperLibWrapper.prototype.offsetToPolyTree = function (params) {
        return offsetFunctions_1.offsetToPolyTree(this.instance, params);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * This function returns the area of the supplied polygon. It's assumed that the path is closed and does not self-intersect. Depending on orientation,
     * this value may be positive or negative. If Orientation is true, then the area will be positive and conversely, if Orientation is false, then the
     * area will be negative.
     *
     * @param path - The path
     * @return {number} - Area
     */
    ClipperLibWrapper.prototype.area = function (path) {
        return functions.area(path);
    };
    /**
     * Removes vertices:
     * - that join co-linear edges, or join edges that are almost co-linear (such that if the vertex was moved no more than the specified distance the edges
     * would be co-linear)
     * - that are within the specified distance of an adjacent vertex
     * - that are within the specified distance of a semi-adjacent vertex together with their out-lying vertices
     *
     * Vertices are semi-adjacent when they are separated by a single (out-lying) vertex.
     *
     * The distance parameter's default value is approximately √2 so that a vertex will be removed when adjacent or semi-adjacent vertices having their
     * corresponding X and Y coordinates differing by no more than 1 unit. (If the egdes are semi-adjacent the out-lying vertex will be removed too.)
     *
     * @param path - The path to clean
     * @param distance - How close points need to be before they are cleaned
     * @return {Path} - The cleaned path
     */
    ClipperLibWrapper.prototype.cleanPolygon = function (path, distance) {
        if (distance === void 0) { distance = 1.1415; }
        return functions.cleanPolygon(this.instance, path, distance);
    };
    /**
     * Removes vertices:
     * - that join co-linear edges, or join edges that are almost co-linear (such that if the vertex was moved no more than the specified distance the edges
     * would be co-linear)
     * - that are within the specified distance of an adjacent vertex
     * - that are within the specified distance of a semi-adjacent vertex together with their out-lying vertices
     *
     * Vertices are semi-adjacent when they are separated by a single (out-lying) vertex.
     *
     * The distance parameter's default value is approximately √2 so that a vertex will be removed when adjacent or semi-adjacent vertices having their
     * corresponding X and Y coordinates differing by no more than 1 unit. (If the egdes are semi-adjacent the out-lying vertex will be removed too.)
     *
     * @param paths - The paths to clean
     * @param distance - How close points need to be before they are cleaned
     * @return {Paths} - The cleaned paths
     */
    ClipperLibWrapper.prototype.cleanPolygons = function (paths, distance) {
        if (distance === void 0) { distance = 1.1415; }
        return functions.cleanPolygons(this.instance, paths, distance);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * This function filters out open paths from the PolyTree structure and returns only closed paths in a Paths structure.
     *
     * @param polyTree
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.closedPathsFromPolyTree = function (polyTree) {
        return functions.closedPathsFromPolyTree(polyTree);
    };
    /**
     *  Minkowski Difference is performed by subtracting each point in a polygon from the set of points in an open or closed path. A key feature of Minkowski
     *  Difference is that when it's applied to two polygons, the resulting polygon will contain the coordinate space origin whenever the two polygons touch or
     *  overlap. (This function is often used to determine when polygons collide.)
     *
     * @param poly1
     * @param poly2
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.minkowskiDiff = function (poly1, poly2) {
        return functions.minkowskiDiff(this.instance, poly1, poly2);
    };
    /**
     * Minkowski Addition is performed by adding each point in a polygon 'pattern' to the set of points in an open or closed path. The resulting polygon
     * (or polygons) defines the region that the 'pattern' would pass over in moving from the beginning to the end of the 'path'.
     *
     * @param pattern
     * @param path
     * @param pathIsClosed
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.minkowskiSumPath = function (pattern, path, pathIsClosed) {
        return functions.minkowskiSumPath(this.instance, pattern, path, pathIsClosed);
    };
    /**
     * Minkowski Addition is performed by adding each point in a polygon 'pattern' to the set of points in an open or closed path. The resulting polygon
     * (or polygons) defines the region that the 'pattern' would pass over in moving from the beginning to the end of the 'path'.
     *
     * @param pattern
     * @param paths
     * @param pathIsClosed
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.minkowskiSumPaths = function (pattern, paths, pathIsClosed) {
        return functions.minkowskiSumPaths(this.instance, pattern, paths, pathIsClosed);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * This function filters out closed paths from the PolyTree structure and returns only open paths in a Paths structure.
     *
     * @param polyTree
     * @return {ReadonlyPath[]}
     */
    ClipperLibWrapper.prototype.openPathsFromPolyTree = function (polyTree) {
        return functions.openPathsFromPolyTree(polyTree);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Orientation is only important to closed paths. Given that vertices are declared in a specific order, orientation refers to the direction (clockwise or
     * counter-clockwise) that these vertices progress around a closed path.
     *
     * Orientation is also dependent on axis direction:
     * - On Y-axis positive upward displays, orientation will return true if the polygon's orientation is counter-clockwise.
     * - On Y-axis positive downward displays, orientation will return true if the polygon's orientation is clockwise.
     *
     * Notes:
     * - Self-intersecting polygons have indeterminate orientations in which case this function won't return a meaningful value.
     * - The majority of 2D graphic display libraries (eg GDI, GDI+, XLib, Cairo, AGG, Graphics32) and even the SVG file format have their coordinate origins
     * at the top-left corner of their respective viewports with their Y axes increasing downward. However, some display libraries (eg Quartz, OpenGL) have their
     * coordinate origins undefined or in the classic bottom-left position with their Y axes increasing upward.
     * - For Non-Zero filled polygons, the orientation of holes must be opposite that of outer polygons.
     * - For closed paths (polygons) in the solution returned by the clip method, their orientations will always be true for outer polygons and false
     * for hole polygons (unless the reverseSolution property has been enabled).
     *
     * @param path - Path
     * @return {boolean}
     */
    ClipperLibWrapper.prototype.orientation = function (path) {
        return functions.orientation(path);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Returns PointInPolygonResult.Outside when false, PointInPolygonResult.OnBoundary when point is on poly and PointInPolygonResult.Inside when point is in
     * poly.
     *
     * It's assumed that 'poly' is closed and does not self-intersect.
     *
     * @param point
     * @param path
     * @return {PointInPolygonResult}
     */
    ClipperLibWrapper.prototype.pointInPolygon = function (point, path) {
        return functions.pointInPolygon(point, path);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * This function converts a PolyTree structure into a Paths structure.
     *
     * @param polyTree
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.polyTreeToPaths = function (polyTree) {
        return functions.polyTreeToPaths(polyTree);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Reverses the vertex order (and hence orientation) in the specified path.
     *
     * @param path - Path to reverse, which gets overwritten rather than copied
     */
    ClipperLibWrapper.prototype.reversePath = function (path) {
        functions.reversePath(path);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Reverses the vertex order (and hence orientation) in each contained path.
     *
     * @param paths - Paths to reverse, which get overwritten rather than copied
     */
    ClipperLibWrapper.prototype.reversePaths = function (paths) {
        functions.reversePaths(paths);
    };
    /**
     * Removes self-intersections from the supplied polygon (by performing a boolean union operation using the nominated PolyFillType).
     * Polygons with non-contiguous duplicate vertices (ie 'touching') will be split into two polygons.
     *
     * Note: There's currently no guarantee that polygons will be strictly simple since 'simplifying' is still a work in progress.
     *
     * @param path
     * @param fillType
     * @return {Paths} - The solution
     */
    ClipperLibWrapper.prototype.simplifyPolygon = function (path, fillType) {
        if (fillType === void 0) { fillType = enums_1.PolyFillType.EvenOdd; }
        return functions.simplifyPolygon(this.instance, path, fillType);
    };
    /**
     * Removes self-intersections from the supplied polygons (by performing a boolean union operation using the nominated PolyFillType).
     * Polygons with non-contiguous duplicate vertices (ie 'vertices are touching') will be split into two polygons.
     *
     * Note: There's currently no guarantee that polygons will be strictly simple since 'simplifying' is still a work in progress.
     *
     * @param paths
     * @param fillType
     * @return {Paths} - The solution
     */
    ClipperLibWrapper.prototype.simplifyPolygons = function (paths, fillType) {
        if (fillType === void 0) { fillType = enums_1.PolyFillType.EvenOdd; }
        return functions.simplifyPolygons(this.instance, paths, fillType);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Scales a path by multiplying all its points by a number and then rounding them.
     *
     * @param path - Path to scale
     * @param scale - Scale multiplier
     * @return {Path} - The scaled path
     */
    ClipperLibWrapper.prototype.scalePath = function (path, scale) {
        return functions.scalePath(path, scale);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Scales all inner paths by multiplying all its points by a number and then rounding them.
     *
     * @param paths - Paths to scale
     * @param scale - Scale multiplier
     * @return {Paths} - The scaled paths
     */
    ClipperLibWrapper.prototype.scalePaths = function (paths, scale) {
        return functions.scalePaths(paths, scale);
    };
    /**
     * Max coordinate value (both positive and negative).
     */
    ClipperLibWrapper.hiRange = constants_1.hiRange;
    return ClipperLibWrapper;
}());
exports.ClipperLibWrapper = ClipperLibWrapper;
/**
 * Asynchronously tries to load a new native instance of the clipper library to be shared across all method invocations.
 *
 * @param format - Format to load, either WasmThenAsmJs, WasmOnly or AsmJsOnly.
 * @return {Promise<ClipperLibWrapper>} - Promise that resolves with the wrapper instance.
 */
exports.loadNativeClipperLibInstanceAsync = function (format) { return __awaiter(_this, void 0, void 0, function () {
    function getModuleAsync(initModule) {
        return new Promise(function (resolve, reject) {
            var finalModule;
            //noinspection JSUnusedLocalSymbols
            var moduleOverrides = {
                noExitRuntime: true,
                preRun: function () {
                    if (finalModule) {
                        resolve(finalModule);
                    }
                    else {
                        setTimeout(function () {
                            resolve(finalModule);
                        }, 1);
                    }
                },
                quit: function (code, err) {
                    reject(err);
                }
            };
            finalModule = initModule(moduleOverrides);
        });
    }
    var tryWasm, tryAsmJs, initModule, err_1, initModule, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                switch (format) {
                    case enums_1.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback:
                        tryWasm = true;
                        tryAsmJs = true;
                        break;
                    case enums_1.NativeClipperLibRequestedFormat.WasmOnly:
                        tryWasm = true;
                        tryAsmJs = false;
                        break;
                    case enums_1.NativeClipperLibRequestedFormat.AsmJsOnly:
                        tryWasm = false;
                        tryAsmJs = true;
                        break;
                    default:
                        throw new ClipperError_1.ClipperError("unknown native clipper format");
                }
                if (!tryWasm) return [3 /*break*/, 7];
                if (!(wasmModule instanceof Error)) return [3 /*break*/, 1];
                return [3 /*break*/, 7];
            case 1:
                if (!(wasmModule === undefined)) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                initModule = require("./wasm/clipper-wasm").init;
                return [4 /*yield*/, getModuleAsync(initModule)];
            case 3:
                wasmModule = _a.sent();
                return [2 /*return*/, new ClipperLibWrapper(wasmModule, enums_1.NativeClipperLibLoadedFormat.Wasm)];
            case 4:
                err_1 = _a.sent();
                wasmModule = err_1;
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, new ClipperLibWrapper(wasmModule, enums_1.NativeClipperLibLoadedFormat.Wasm)];
            case 7:
                if (!tryAsmJs) return [3 /*break*/, 14];
                if (!(asmJsModule instanceof Error)) return [3 /*break*/, 8];
                return [3 /*break*/, 14];
            case 8:
                if (!(asmJsModule === undefined)) return [3 /*break*/, 13];
                _a.label = 9;
            case 9:
                _a.trys.push([9, 11, , 12]);
                initModule = require("./wasm/clipper").init;
                return [4 /*yield*/, getModuleAsync(initModule)];
            case 10:
                asmJsModule = _a.sent();
                return [2 /*return*/, new ClipperLibWrapper(asmJsModule, enums_1.NativeClipperLibLoadedFormat.AsmJs)];
            case 11:
                err_2 = _a.sent();
                asmJsModule = err_2;
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13: return [2 /*return*/, new ClipperLibWrapper(asmJsModule, enums_1.NativeClipperLibLoadedFormat.AsmJs)];
            case 14: throw new ClipperError_1.ClipperError("could not load native clipper in the desired format");
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBOGZBOztBQTlmQSxpREFBcUY7QUFDckYsK0NBQThDO0FBMEM1Qyx1QkExQ08sMkJBQVksQ0EwQ1A7QUF6Q2QseUNBQXNDO0FBQ3RDLGlDQVFpQjtBQWFmLG1CQXBCQSxnQkFBUSxDQW9CQTtBQUNSLGtCQXBCQSxlQUFPLENBb0JBO0FBQ1AsbUJBcEJBLGdCQUFRLENBb0JBO0FBRVIsdUNBckJBLG9DQUE0QixDQXFCQTtBQUM1QiwwQ0FyQkEsdUNBQStCLENBcUJBO0FBQy9CLCtCQXJCQSw0QkFBb0IsQ0FxQkE7QUFIcEIsdUJBakJBLG9CQUFZLENBaUJBO0FBZmQsdUNBQXlDO0FBSXpDLHFEQUErRjtBQUcvRix1Q0FBc0M7QUFZcEMsbUJBWk8sbUJBQVEsQ0FZUDtBQVhWLHVDQUFzQztBQVlwQyxtQkFaTyxtQkFBUSxDQVlQO0FBY1YsSUFBSSxVQUF3RCxDQUFDO0FBQzdELElBQUksV0FBaUQsQ0FBQztBQUV0RDs7R0FFRztBQUNIO0lBZ0JFOzs7OztPQUtHO0lBQ0gsMkJBQVksUUFBa0MsRUFBRSxNQUFvQztRQUNsRixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNILHVDQUFXLEdBQVgsVUFBWSxNQUFrQjtRQUM1QixPQUFPLDJCQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNILDBDQUFjLEdBQWQsVUFBZSxNQUFrQjtRQUMvQixPQUFPLDhCQUFjLENBQUMsSUFBSSxD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QyxDQUFDOzs7S0FDL0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsaXBJbnB1dCwgQ2xpcFBhcmFtcywgY2xpcFRvUGF0aHMsIGNsaXBUb1BvbHlUcmVlIH0gZnJvbSBcIi4vY2xpcEZ1bmN0aW9uc1wiO1xuaW1wb3J0IHsgQ2xpcHBlckVycm9yIH0gZnJvbSBcIi4vQ2xpcHBlckVycm9yXCI7XG5pbXBvcnQgeyBoaVJhbmdlIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQge1xuICBDbGlwVHlwZSxcbiAgRW5kVHlwZSxcbiAgSm9pblR5cGUsXG4gIE5hdGl2ZUNsaXBwZXJMaWJMb2FkZWRGb3JtYXQsXG4gIE5hdGl2ZUNsaXBwZXJMaWJSZXF1ZXN0ZWRGb3JtYXQsXG4gIFBvaW50SW5Qb2x5Z29uUmVzdWx0LFxuICBQb2x5RmlsbFR5cGVcbn0gZnJvbSBcIi4vZW51bXNcIjtcbmltcG9ydCAqIGFzIGZ1bmN0aW9ucyBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IEludFBvaW50IH0gZnJvbSBcIi4vSW50UG9pbnRcIjtcbmltcG9ydCB7IEludFJlY3QgfSBmcm9tIFwiLi9JbnRSZWN0XCI7XG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlXCI7XG5pbXBvcnQgeyBPZmZzZXRJbnB1dCwgT2Zmc2V0UGFyYW1zLCBvZmZzZXRUb1BhdGhzLCBvZmZzZXRUb1BvbHlUcmVlIH0gZnJvbSBcIi4vb2Zmc2V0RnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBQYXRoLCBSZWFkb25seVBhdGggfSBmcm9tIFwiLi9QYXRoXCI7XG5pbXBvcnQgeyBQYXRocywgUmVhZG9ubHlQYXRocyB9IGZyb20gXCIuL1BhdGhzXCI7XG5pbXBvcnQgeyBQb2x5Tm9kZSB9IGZyb20gXCIuL1BvbHlOb2RlXCI7XG5pbXBvcnQgeyBQb2x5VHJlZSB9IGZyb20gXCIuL1BvbHlUcmVlXCI7XG5cbi8vIGV4cG9ydCB0eXBlc1xuZXhwb3J0IHtcbiAgQ2xpcFR5cGUsXG4gIEVuZFR5cGUsXG4gIEpvaW5UeXBlLFxuICBQb2x5RmlsbFR5cGUsXG4gIE5hdGl2ZUNsaXBwZXJMaWJMb2FkZWRGb3JtYXQsXG4gIE5hdGl2ZUNsaXBwZXJMaWJSZXF1ZXN0ZWRGb3JtYXQsXG4gIFBvaW50SW5Qb2x5Z29uUmVzdWx0LFxuICBQb2x5Tm9kZSxcbiAgUG9seVRyZWUsXG4gIEludFBvaW50LFxuICBJbnRSZWN0LFxuICBQYXRoLFxuICBSZWFkb25seVBhdGgsXG4gIFBhdGhzLFxuICBSZWFkb25seVBhdGhzLFxuICBDbGlwSW5wdXQsXG4gIENsaXBQYXJhbXMsXG4gIE9mZnNldElucHV0LFxuICBPZmZzZXRQYXJhbXMsXG4gIENsaXBwZXJFcnJvclxufTtcblxubGV0IHdhc21Nb2R1bGU6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSB8IHVuZGVmaW5lZCB8IEVycm9yO1xubGV0IGFzbUpzTW9kdWxlOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSB3cmFwcGVyIGZvciB0aGUgTmF0aXZlIENsaXBwZXIgTGlicmFyeSBpbnN0YW5jZSB3aXRoIGFsbCB0aGUgb3BlcmF0aW9ucyBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbGlwcGVyTGliV3JhcHBlciB7XG4gIC8qKlxuICAgKiBNYXggY29vcmRpbmF0ZSB2YWx1ZSAoYm90aCBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUpLlxuICAgKi9cbiAgc3RhdGljIHJlYWRvbmx5IGhpUmFuZ2UgPSBoaVJhbmdlO1xuXG4gIC8qKlxuICAgKiBOYXRpdmUgbGlicmFyeSBpbnN0YW5jZS5cbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2U7XG5cbiAgLyoqXG4gICAqIE5hdGl2ZSBsaWJyYXJ5IGZvcm1hdC5cbiAgICovXG4gIHJlYWRvbmx5IGZvcm1hdDogTmF0aXZlQ2xpcHBlckxpYkxvYWRlZEZvcm1hdDtcblxuICAvKipcbiAgICogSW50ZXJuYWwgY29uc3RydWN0b3IuIFVzZSBsb2FkTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlQXN5bmMgaW5zdGVhZC5cbiAgICpcbiAgICogQHBhcmFtIGluc3RhbmNlXG4gICAqIEBwYXJhbSBmb3JtYXRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsIGZvcm1hdDogTmF0aXZlQ2xpcHBlckxpYkxvYWRlZEZvcm1hdCkge1xuICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIHBvbHlnb24gY2xpcHBpbmcgKGJvb2xlYW4pIG9wZXJhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcgUGF0aHMgb3IgdGhyb3dpbmcgYW4gZXJyb3IgaWYgZmFpbGVkLlxuICAgKlxuICAgKiBUaGUgc29sdXRpb24gcGFyYW1ldGVyIGluIHRoaXMgY2FzZSBpcyBhIFBhdGhzIG9yIFBvbHlUcmVlIHN0cnVjdHVyZS4gVGhlIFBhdGhzIHN0cnVjdHVyZSBpcyBzaW1wbGVyIHRoYW4gdGhlIFBvbHlUcmVlIHN0cnVjdHVyZS4gQmVjYXVzZSBvZiB0aGlzIGl0IGlzXG4gICAqIHF1aWNrZXIgdG8gcG9wdWxhdGUgYW5kIGhlbmNlIGNsaXBwaW5nIHBlcmZvcm1hbmNlIGlzIGEgbGl0dGxlIGJldHRlciAoaXQncyByb3VnaGx5IDEwJSBmYXN0ZXIpLiBIb3dldmVyLCB0aGUgUG9seVRyZWUgZGF0YSBzdHJ1Y3R1cmUgcHJvdmlkZXMgbW9yZVxuICAgKiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcmV0dXJuZWQgcGF0aHMgd2hpY2ggbWF5IGJlIGltcG9ydGFudCB0byB1c2Vycy4gRmlyc3RseSwgdGhlIFBvbHlUcmVlIHN0cnVjdHVyZSBwcmVzZXJ2ZXMgbmVzdGVkIHBhcmVudC1jaGlsZCBwb2x5Z29uIHJlbGF0aW9uc2hpcHNcbiAgICogKGllIG91dGVyIHBvbHlnb25zIG93bmluZy9jb250YWluaW5nIGhvbGVzIGFuZCBob2xlcyBvd25pbmcvY29udGFpbmluZyBvdGhlciBvdXRlciBwb2x5Z29ucyBldGMpLiBBbHNvLCBvbmx5IHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgY2FuIGRpZmZlcmVudGlhdGVcbiAgICogYmV0d2VlbiBvcGVuIGFuZCBjbG9zZWQgcGF0aHMgc2luY2UgZWFjaCBQb2x5Tm9kZSBoYXMgYW4gSXNPcGVuIHByb3BlcnR5LiAoVGhlIFBhdGggc3RydWN0dXJlIGhhcyBubyBtZW1iZXIgaW5kaWNhdGluZyB3aGV0aGVyIGl0J3Mgb3BlbiBvciBjbG9zZWQuKVxuICAgKiBGb3IgdGhpcyByZWFzb24sIHdoZW4gb3BlbiBwYXRocyBhcmUgcGFzc2VkIHRvIGEgQ2xpcHBlciBvYmplY3QsIHRoZSB1c2VyIG11c3QgdXNlIGEgUG9seVRyZWUgb2JqZWN0IGFzIHRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIsIG90aGVyd2lzZSBhbiBleGNlcHRpb25cbiAgICogd2lsbCBiZSByYWlzZWQuXG4gICAqXG4gICAqIFdoZW4gYSBQb2x5VHJlZSBvYmplY3QgaXMgdXNlZCBpbiBhIGNsaXBwaW5nIG9wZXJhdGlvbiBvbiBvcGVuIHBhdGhzLCB0d28gYW5jaWxsaWFyeSBmdW5jdGlvbnMgaGF2ZSBiZWVuIHByb3ZpZGVkIHRvIHF1aWNrbHkgc2VwYXJhdGUgb3V0IG9wZW4gYW5kXG4gICAqIGNsb3NlZCBwYXRocyBmcm9tIHRoZSBzb2x1dGlvbiAtIE9wZW5QYXRoc0Zyb21Qb2x5VHJlZSBhbmQgQ2xvc2VkUGF0aHNGcm9tUG9seVRyZWUuIFBvbHlUcmVlVG9QYXRocyBpcyBhbHNvIGF2YWlsYWJsZSB0byBjb252ZXJ0IHBhdGggZGF0YSB0byBhIFBhdGhzXG4gICAqIHN0cnVjdHVyZSAoaXJyZXNwZWN0aXZlIG9mIHdoZXRoZXIgdGhleSdyZSBvcGVuIG9yIGNsb3NlZCkuXG4gICAqXG4gICAqIFRoZXJlIGFyZSBzZXZlcmFsIHRoaW5ncyB0byBub3RlIGFib3V0IHRoZSBzb2x1dGlvbiBwYXRocyByZXR1cm5lZDpcbiAgICogLSB0aGV5IGFyZW4ndCBpbiBhbnkgc3BlY2lmaWMgb3JkZXJcbiAgICogLSB0aGV5IHNob3VsZCBuZXZlciBvdmVybGFwIG9yIGJlIHNlbGYtaW50ZXJzZWN0aW5nIChidXQgc2VlIG5vdGVzIG9uIHJvdW5kaW5nKVxuICAgKiAtIGhvbGVzIHdpbGwgYmUgb3JpZW50ZWQgb3Bwb3NpdGUgb3V0ZXIgcG9seWdvbnNcbiAgICogLSB0aGUgc29sdXRpb24gZmlsbCB0eXBlIGNhbiBiZSBjb25zaWRlcmVkIGVpdGhlciBFdmVuT2RkIG9yIE5vblplcm8gc2luY2UgaXQgd2lsbCBjb21wbHkgd2l0aCBlaXRoZXIgZmlsbGluZyBydWxlXG4gICAqIC0gcG9seWdvbnMgbWF5IHJhcmVseSBzaGFyZSBhIGNvbW1vbiBlZGdlICh0aG91Z2ggdGhpcyBpcyBub3cgdmVyeSByYXJlIGFzIG9mIHZlcnNpb24gNilcbiAgICpcbiAgICogQHBhcmFtIHBhcmFtcyAtIGNsaXBwaW5nIG9wZXJhdGlvbiBkYXRhXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIHRoZSByZXN1bHRpbmcgUGF0aHMuXG4gICAqL1xuICBjbGlwVG9QYXRocyhwYXJhbXM6IENsaXBQYXJhbXMpOiBQYXRocyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIGNsaXBUb1BhdGhzKHRoaXMuaW5zdGFuY2UsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgYSBwb2x5Z29uIGNsaXBwaW5nIChib29sZWFuKSBvcGVyYXRpb24sIHJldHVybmluZyB0aGUgcmVzdWx0aW5nIFBvbHlUcmVlIG9yIHRocm93aW5nIGFuIGVycm9yIGlmIGZhaWxlZC5cbiAgICpcbiAgICogVGhlIHNvbHV0aW9uIHBhcmFtZXRlciBpbiB0aGlzIGNhc2UgaXMgYSBQYXRocyBvciBQb2x5VHJlZSBzdHJ1Y3R1cmUuIFRoZSBQYXRocyBzdHJ1Y3R1cmUgaXMgc2ltcGxlciB0aGFuIHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUuIEJlY2F1c2Ugb2YgdGhpcyBpdCBpc1xuICAgKiBxdWlja2VyIHRvIHBvcHVsYXRlIGFuZCBoZW5jZSBjbGlwcGluZyBwZXJmb3JtYW5jZSBpcyBhIGxpdHRsZSBiZXR0ZXIgKGl0J3Mgcm91Z2hseSAxMCUgZmFzdGVyKS4gSG93ZXZlciwgdGhlIFBvbHlUcmVlIGRhdGEgc3RydWN0dXJlIHByb3ZpZGVzIG1vcmVcbiAgICogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJldHVybmVkIHBhdGhzIHdoaWNoIG1heSBiZSBpbXBvcnRhbnQgdG8gdXNlcnMuIEZpcnN0bHksIHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgcHJlc2VydmVzIG5lc3RlZCBwYXJlbnQtY2hpbGQgcG9seWdvbiByZWxhdGlvbnNoaXBzXG4gICAqIChpZSBvdXRlciBwb2x5Z29ucyBvd25pbmcvY29udGFpbmluZyBob2xlcyBhbmQgaG9sZXMgb3duaW5nL2NvbnRhaW5pbmcgb3RoZXIgb3V0ZXIgcG9seWdvbnMgZXRjKS4gQWxzbywgb25seSB0aGUgUG9seVRyZWUgc3RydWN0dXJlIGNhbiBkaWZmZXJlbnRpYXRlXG4gICAqIGJldHdlZW4gb3BlbiBhbmQgY2xvc2VkIHBhdGhzIHNpbmNlIGVhY2ggUG9seU5vZGUgaGFzIGFuIElzT3BlbiBwcm9wZXJ0eS4gKFRoZSBQYXRoIHN0cnVjdHVyZSBoYXMgbm8gbWVtYmVyIGluZGljYXRpbmcgd2hldGhlciBpdCdzIG9wZW4gb3IgY2xvc2VkLilcbiAgICogRm9yIHRoaXMgcmVhc29uLCB3aGVuIG9wZW4gcGF0aHMgYXJlIHBhc3NlZCB0byBhIENsaXBwZXIgb2JqZWN0LCB0aGUgdXNlciBtdXN0IHVzZSBhIFBvbHlUcmVlIG9iamVjdCBhcyB0aGUgc29sdXRpb24gcGFyYW1ldGVyLCBvdGhlcndpc2UgYW4gZXhjZXB0aW9uXG4gICAqIHdpbGwgYmUgcmFpc2VkLlxuICAgKlxuICAgKiBXaGVuIGEgUG9seVRyZWUgb2JqZWN0IGlzIHVzZWQgaW4gYSBjbGlwcGluZyBvcGVyYXRpb24gb24gb3BlbiBwYXRocywgdHdvIGFuY2lsbGlhcnkgZnVuY3Rpb25zIGhhdmUgYmVlbiBwcm92aWRlZCB0byBxdWlja2x5IHNlcGFyYXRlIG91dCBvcGVuIGFuZFxuICAgKiBjbG9zZWQgcGF0aHMgZnJvbSB0aGUgc29sdXRpb24gLSBPcGVuUGF0aHNGcm9tUG9seVRyZWUgYW5kIENsb3NlZFBhdGhzRnJvbVBvbHlUcmVlLiBQb2x5VHJlZVRvUGF0aHMgaXMgYWxzbyBhdmFpbGFibGUgdG8gY29udmVydCBwYXRoIGRhdGEgdG8gYSBQYXRoc1xuICAgKiBzdHJ1Y3R1cmUgKGlycmVzcGVjdGl2ZSBvZiB3aGV0aGVyIHRoZXkncmUgb3BlbiBvciBjbG9zZWQpLlxuICAgKlxuICAgKiBUaGVyZSBhcmUgc2V2ZXJhbCB0aGluZ3MgdG8gbm90ZSBhYm91dCB0aGUgc29sdXRpb24gcGF0aHMgcmV0dXJuZWQ6XG4gICAqIC0gdGhleSBhcmVuJ3QgaW4gYW55IHNwZWNpZmljIG9yZGVyXG4gICAqIC0gdGhleSBzaG91bGQgbmV2ZXIgb3ZlcmxhcCBvciBiZSBzZWxmLWludGVyc2VjdGluZyAoYnV0IHNlZSBub3RlcyBvbiByb3VuZGluZylcbiAgICogLSBob2xlcyB3aWxsIGJlIG9yaWVudGVkIG9wcG9zaXRlIG91dGVyIHBvbHlnb25zXG4gICAqIC0gdGhlIHNvbHV0aW9uIGZpbGwgdHlwZSBjYW4gYmUgY29uc2lkZXJlZCBlaXRoZXIgRXZlbk9kZCBvciBOb25aZXJvIHNpbmNlIGl0IHdpbGwgY29tcGx5IHdpdGggZWl0aGVyIGZpbGxpbmcgcnVsZVxuICAgKiAtIHBvbHlnb25zIG1heSByYXJlbHkgc2hhcmUgYSBjb21tb24gZWRnZSAodGhvdWdoIHRoaXMgaXMgbm93IHZlcnkgcmFyZSBhcyBvZiB2ZXJzaW9uIDYpXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXMgLSBjbGlwcGluZyBvcGVyYXRpb24gZGF0YVxuICAgKiBAcmV0dXJuIHtQb2x5VHJlZX0gLSB0aGUgcmVzdWx0aW5nIFBvbHlUcmVlIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIGNsaXBUb1BvbHlUcmVlKHBhcmFtczogQ2xpcFBhcmFtcyk6IFBvbHlUcmVlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gY2xpcFRvUG9seVRyZWUodGhpcy5pbnN0YW5jZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIHBvbHlnb24gb2Zmc2V0IG9wZXJhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcgUGF0aHMgb3IgdW5kZWZpbmVkIGlmIGZhaWxlZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgZW5jYXBzdWxhdGVzIHRoZSBwcm9jZXNzIG9mIG9mZnNldHRpbmcgKGluZmxhdGluZy9kZWZsYXRpbmcpIGJvdGggb3BlbiBhbmQgY2xvc2VkIHBhdGhzIHVzaW5nIGEgbnVtYmVyIG9mIGRpZmZlcmVudCBqb2luIHR5cGVzXG4gICAqIGFuZCBlbmQgdHlwZXMuXG4gICAqXG4gICAqIFByZWNvbmRpdGlvbnMgZm9yIG9mZnNldHRpbmc6XG4gICAqIDEuIFRoZSBvcmllbnRhdGlvbnMgb2YgY2xvc2VkIHBhdGhzIG11c3QgYmUgY29uc2lzdGVudCBzdWNoIHRoYXQgb3V0ZXIgcG9seWdvbnMgc2hhcmUgdGhlIHNhbWUgb3JpZW50YXRpb24sIGFuZCBhbnkgaG9sZXMgaGF2ZSB0aGUgb3Bwb3NpdGUgb3JpZW50YXRpb25cbiAgICogKGllIG5vbi16ZXJvIGZpbGxpbmcpLiBPcGVuIHBhdGhzIG11c3QgYmUgb3JpZW50ZWQgd2l0aCBjbG9zZWQgb3V0ZXIgcG9seWdvbnMuXG4gICAqIDIuIFBvbHlnb25zIG11c3Qgbm90IHNlbGYtaW50ZXJzZWN0LlxuICAgKlxuICAgKiBMaW1pdGF0aW9uczpcbiAgICogV2hlbiBvZmZzZXR0aW5nLCBzbWFsbCBhcnRlZmFjdHMgbWF5IGFwcGVhciB3aGVyZSBwb2x5Z29ucyBvdmVybGFwLiBUbyBhdm9pZCB0aGVzZSBhcnRlZmFjdHMsIG9mZnNldCBvdmVybGFwcGluZyBwb2x5Z29ucyBzZXBhcmF0ZWx5LlxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1zIC0gb2Zmc2V0IG9wZXJhdGlvbiBwYXJhbXNcbiAgICogQHJldHVybiB7UGF0aHN8dW5kZWZpbmVkfSAtIHRoZSByZXN1bHRpbmcgUGF0aHMgb3IgdW5kZWZpbmVkIGlmIGZhaWxlZC5cbiAgICovXG4gIG9mZnNldFRvUGF0aHMocGFyYW1zOiBPZmZzZXRQYXJhbXMpOiBQYXRocyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIG9mZnNldFRvUGF0aHModGhpcy5pbnN0YW5jZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIHBvbHlnb24gb2Zmc2V0IG9wZXJhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcgUG9seVRyZWUgb3IgdW5kZWZpbmVkIGlmIGZhaWxlZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgZW5jYXBzdWxhdGVzIHRoZSBwcm9jZXNzIG9mIG9mZnNldHRpbmcgKGluZmxhdGluZy9kZWZsYXRpbmcpIGJvdGggb3BlbiBhbmQgY2xvc2VkIHBhdGhzIHVzaW5nIGEgbnVtYmVyIG9mIGRpZmZlcmVudCBqb2luIHR5cGVzXG4gICAqIGFuZCBlbmQgdHlwZXMuXG4gICAqXG4gICAqIFByZWNvbmRpdGlvbnMgZm9yIG9mZnNldHRpbmc6XG4gICAqIDEuIFRoZSBvcmllbnRhdGlvbnMgb2YgY2xvc2VkIHBhdGhzIG11c3QgYmUgY29uc2lzdGVudCBzdWNoIHRoYXQgb3V0ZXIgcG9seWdvbnMgc2hhcmUgdGhlIHNhbWUgb3JpZW50YXRpb24sIGFuZCBhbnkgaG9sZXMgaGF2ZSB0aGUgb3Bwb3NpdGUgb3JpZW50YXRpb25cbiAgICogKGllIG5vbi16ZXJvIGZpbGxpbmcpLiBPcGVuIHBhdGhzIG11c3QgYmUgb3JpZW50ZWQgd2l0aCBjbG9zZWQgb3V0ZXIgcG9seWdvbnMuXG4gICAqIDIuIFBvbHlnb25zIG11c3Qgbm90IHNlbGYtaW50ZXJzZWN0LlxuICAgKlxuICAgKiBMaW1pdGF0aW9uczpcbiAgICogV2hlbiBvZmZzZXR0aW5nLCBzbWFsbCBhcnRlZmFjdHMgbWF5IGFwcGVhciB3aGVyZSBwb2x5Z29ucyBvdmVybGFwLiBUbyBhdm9pZCB0aGVzZSBhcnRlZmFjdHMsIG9mZnNldCBvdmVybGFwcGluZyBwb2x5Z29ucyBzZXBhcmF0ZWx5LlxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1zIC0gb2Zmc2V0IG9wZXJhdGlvbiBwYXJhbXNcbiAgICogQHJldHVybiB7UG9seVRyZWV8dW5kZWZpbmVkfSAtIHRoZSByZXN1bHRpbmcgUG9seVRyZWUgb3IgdW5kZWZpbmVkIGlmIGZhaWxlZC5cbiAgICovXG4gIG9mZnNldFRvUG9seVRyZWUocGFyYW1zOiBPZmZzZXRQYXJhbXMpOiBQb2x5VHJlZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIG9mZnNldFRvUG9seVRyZWUodGhpcy5pbnN0YW5jZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgYXJlYSBvZiB0aGUgc3VwcGxpZWQgcG9seWdvbi4gSXQncyBhc3N1bWVkIHRoYXQgdGhlIHBhdGggaXMgY2xvc2VkIGFuZCBkb2VzIG5vdCBzZWxmLWludGVyc2VjdC4gRGVwZW5kaW5nIG9uIG9yaWVudGF0aW9uLFxuICAgKiB0aGlzIHZhbHVlIG1heSBiZSBwb3NpdGl2ZSBvciBuZWdhdGl2ZS4gSWYgT3JpZW50YXRpb24gaXMgdHJ1ZSwgdGhlbiB0aGUgYXJlYSB3aWxsIGJlIHBvc2l0aXZlIGFuZCBjb252ZXJzZWx5LCBpZiBPcmllbnRhdGlvbiBpcyBmYWxzZSwgdGhlbiB0aGVcbiAgICogYXJlYSB3aWxsIGJlIG5lZ2F0aXZlLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCAtIFRoZSBwYXRoXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSBBcmVhXG4gICAqL1xuICBhcmVhKHBhdGg6IFJlYWRvbmx5UGF0aCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5hcmVhKHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdmVydGljZXM6XG4gICAqIC0gdGhhdCBqb2luIGNvLWxpbmVhciBlZGdlcywgb3Igam9pbiBlZGdlcyB0aGF0IGFyZSBhbG1vc3QgY28tbGluZWFyIChzdWNoIHRoYXQgaWYgdGhlIHZlcnRleCB3YXMgbW92ZWQgbm8gbW9yZSB0aGFuIHRoZSBzcGVjaWZpZWQgZGlzdGFuY2UgdGhlIGVkZ2VzXG4gICAqIHdvdWxkIGJlIGNvLWxpbmVhcilcbiAgICogLSB0aGF0IGFyZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBkaXN0YW5jZSBvZiBhbiBhZGphY2VudCB2ZXJ0ZXhcbiAgICogLSB0aGF0IGFyZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBkaXN0YW5jZSBvZiBhIHNlbWktYWRqYWNlbnQgdmVydGV4IHRvZ2V0aGVyIHdpdGggdGhlaXIgb3V0LWx5aW5nIHZlcnRpY2VzXG4gICAqXG4gICAqIFZlcnRpY2VzIGFyZSBzZW1pLWFkamFjZW50IHdoZW4gdGhleSBhcmUgc2VwYXJhdGVkIGJ5IGEgc2luZ2xlIChvdXQtbHlpbmcpIHZlcnRleC5cbiAgICpcbiAgICogVGhlIGRpc3RhbmNlIHBhcmFtZXRlcidzIGRlZmF1bHQgdmFsdWUgaXMgYXBwcm94aW1hdGVseSDiiJoyIHNvIHRoYXQgYSB2ZXJ0ZXggd2lsbCBiZSByZW1vdmVkIHdoZW4gYWRqYWNlbnQgb3Igc2VtaS1hZGphY2VudCB2ZXJ0aWNlcyBoYXZpbmcgdGhlaXJcbiAgICogY29ycmVzcG9uZGluZyBYIGFuZCBZIGNvb3JkaW5hdGVzIGRpZmZlcmluZyBieSBubyBtb3JlIHRoYW4gMSB1bml0LiAoSWYgdGhlIGVnZGVzIGFyZSBzZW1pLWFkamFjZW50IHRoZSBvdXQtbHlpbmcgdmVydGV4IHdpbGwgYmUgcmVtb3ZlZCB0b28uKVxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCAtIFRoZSBwYXRoIHRvIGNsZWFuXG4gICAqIEBwYXJhbSBkaXN0YW5jZSAtIEhvdyBjbG9zZSBwb2ludHMgbmVlZCB0byBiZSBiZWZvcmUgdGhleSBhcmUgY2xlYW5lZFxuICAgKiBAcmV0dXJuIHtQYXRofSAtIFRoZSBjbGVhbmVkIHBhdGhcbiAgICovXG4gIGNsZWFuUG9seWdvbihwYXRoOiBSZWFkb25seVBhdGgsIGRpc3RhbmNlID0gMS4xNDE1KTogUGF0aCB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5jbGVhblBvbHlnb24odGhpcy5pbnN0YW5jZSwgcGF0aCwgZGlzdGFuY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdmVydGljZXM6XG4gICAqIC0gdGhhdCBqb2luIGNvLWxpbmVhciBlZGdlcywgb3Igam9pbiBlZGdlcyB0aGF0IGFyZSBhbG1vc3QgY28tbGluZWFyIChzdWNoIHRoYXQgaWYgdGhlIHZlcnRleCB3YXMgbW92ZWQgbm8gbW9yZSB0aGFuIHRoZSBzcGVjaWZpZWQgZGlzdGFuY2UgdGhlIGVkZ2VzXG4gICAqIHdvdWxkIGJlIGNvLWxpbmVhcilcbiAgICogLSB0aGF0IGFyZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBkaXN0YW5jZSBvZiBhbiBhZGphY2VudCB2ZXJ0ZXhcbiAgICogLSB0aGF0IGFyZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBkaXN0YW5jZSBvZiBhIHNlbWktYWRqYWNlbnQgdmVydGV4IHRvZ2V0aGVyIHdpdGggdGhlaXIgb3V0LWx5aW5nIHZlcnRpY2VzXG4gICAqXG4gICAqIFZlcnRpY2VzIGFyZSBzZW1pLWFkamFjZW50IHdoZW4gdGhleSBhcmUgc2VwYXJhdGVkIGJ5IGEgc2luZ2xlIChvdXQtbHlpbmcpIHZlcnRleC5cbiAgICpcbiAgICogVGhlIGRpc3RhbmNlIHBhcmFtZXRlcidzIGRlZmF1bHQgdmFsdWUgaXMgYXBwcm94aW1hdGVseSDiiJoyIHNvIHRoYXQgYSB2ZXJ0ZXggd2lsbCBiZSByZW1vdmVkIHdoZW4gYWRqYWNlbnQgb3Igc2VtaS1hZGphY2VudCB2ZXJ0aWNlcyBoYXZpbmcgdGhlaXJcbiAgICogY29ycmVzcG9uZGluZyBYIGFuZCBZIGNvb3JkaW5hdGVzIGRpZmZlcmluZyBieSBubyBtb3JlIHRoYW4gMSB1bml0LiAoSWYgdGhlIGVnZGVzIGFyZSBzZW1pLWFkamFjZW50IHRoZSBvdXQtbHlpbmcgdmVydGV4IHdpbGwgYmUgcmVtb3ZlZCB0b28uKVxuICAgKlxuICAgKiBAcGFyYW0gcGF0aHMgLSBUaGUgcGF0aHMgdG8gY2xlYW5cbiAgICogQHBhcmFtIGRpc3RhbmNlIC0gSG93IGNsb3NlIHBvaW50cyBuZWVkIHRvIGJlIGJlZm9yZSB0aGV5IGFyZSBjbGVhbmVkXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIFRoZSBjbGVhbmVkIHBhdGhzXG4gICAqL1xuICBjbGVhblBvbHlnb25zKHBhdGhzOiBSZWFkb25seVBhdGhzLCBkaXN0YW5jZSA9IDEuMTQxNSk6IFBhdGhzIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLmNsZWFuUG9seWdvbnModGhpcy5pbnN0YW5jZSwgcGF0aHMsIGRpc3RhbmNlKTtcbiAgfVxuXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gZmlsdGVycyBvdXQgb3BlbiBwYXRocyBmcm9tIHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgYW5kIHJldHVybnMgb25seSBjbG9zZWQgcGF0aHMgaW4gYSBQYXRocyBzdHJ1Y3R1cmUuXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5VHJlZVxuICAgKiBAcmV0dXJuIHtQYXRoc31cbiAgICovXG4gIGNsb3NlZFBhdGhzRnJvbVBvbHlUcmVlKHBvbHlUcmVlOiBQb2x5VHJlZSk6IFBhdGhzIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLmNsb3NlZFBhdGhzRnJvbVBvbHlUcmVlKHBvbHlUcmVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgTWlua293c2tpIERpZmZlcmVuY2UgaXMgcGVyZm9ybWVkIGJ5IHN1YnRyYWN0aW5nIGVhY2ggcG9pbnQgaW4gYSBwb2x5Z29uIGZyb20gdGhlIHNldCBvZiBwb2ludHMgaW4gYW4gb3BlbiBvciBjbG9zZWQgcGF0aC4gQSBrZXkgZmVhdHVyZSBvZiBNaW5rb3dza2lcbiAgICogIERpZmZlcmVuY2UgaXMgdGhhdCB3aGVuIGl0J3MgYXBwbGllZCB0byB0d28gcG9seWdvbnMsIHRoZSByZXN1bHRpbmcgcG9seWdvbiB3aWxsIGNvbnRhaW4gdGhlIGNvb3JkaW5hdGUgc3BhY2Ugb3JpZ2luIHdoZW5ldmVyIHRoZSB0d28gcG9seWdvbnMgdG91Y2ggb3JcbiAgICogIG92ZXJsYXAuIChUaGlzIGZ1bmN0aW9uIGlzIG9mdGVuIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZW4gcG9seWdvbnMgY29sbGlkZS4pXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5MVxuICAgKiBAcGFyYW0gcG9seTJcbiAgICogQHJldHVybiB7UGF0aHN9XG4gICAqL1xuICBtaW5rb3dza2lEaWZmKHBvbHkxOiBSZWFkb25seVBhdGgsIHBvbHkyOiBSZWFkb25seVBhdGgpOiBQYXRocyB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5taW5rb3dza2lEaWZmKHRoaXMuaW5zdGFuY2UsIHBvbHkxLCBwb2x5Mik7XG4gIH1cblxuICAvKipcbiAgICogTWlua293c2tpIEFkZGl0aW9uIGlzIHBlcmZvcm1lZCBieSBhZGRpbmcgZWFjaCBwb2ludCBpbiBhIHBvbHlnb24gJ3BhdHRlcm4nIHRvIHRoZSBzZXQgb2YgcG9pbnRzIGluIGFuIG9wZW4gb3IgY2xvc2VkIHBhdGguIFRoZSByZXN1bHRpbmcgcG9seWdvblxuICAgKiAob3IgcG9seWdvbnMpIGRlZmluZXMgdGhlIHJlZ2lvbiB0aGF0IHRoZSAncGF0dGVybicgd291bGQgcGFzcyBvdmVyIGluIG1vdmluZyBmcm9tIHRoZSBiZWdpbm5pbmcgdG8gdGhlIGVuZCBvZiB0aGUgJ3BhdGgnLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0dGVyblxuICAgKiBAcGFyYW0gcGF0aFxuICAgKiBAcGFyYW0gcGF0aElzQ2xvc2VkXG4gICAqIEByZXR1cm4ge1BhdGhzfVxuICAgKi9cbiAgbWlua293c2tpU3VtUGF0aChwYXR0ZXJuOiBSZWFkb25seVBhdGgsIHBhdGg6IFJlYWRvbmx5UGF0aCwgcGF0aElzQ2xvc2VkOiBib29sZWFuKTogUGF0aHMge1xuICAgIHJldHVybiBmdW5jdGlvbnMubWlua293c2tpU3VtUGF0aCh0aGlzLmluc3RhbmNlLCBwYXR0ZXJuLCBwYXRoLCBwYXRoSXNDbG9zZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1pbmtvd3NraSBBZGRpdGlvbiBpcyBwZXJmb3JtZWQgYnkgYWRkaW5nIGVhY2ggcG9pbnQgaW4gYSBwb2x5Z29uICdwYXR0ZXJuJyB0byB0aGUgc2V0IG9mIHBvaW50cyBpbiBhbiBvcGVuIG9yIGNsb3NlZCBwYXRoLiBUaGUgcmVzdWx0aW5nIHBvbHlnb25cbiAgICogKG9yIHBvbHlnb25zKSBkZWZpbmVzIHRoZSByZWdpb24gdGhhdCB0aGUgJ3BhdHRlcm4nIHdvdWxkIHBhc3Mgb3ZlciBpbiBtb3ZpbmcgZnJvbSB0aGUgYmVnaW5uaW5nIHRvIHRoZSBlbmQgb2YgdGhlICdwYXRoJy5cbiAgICpcbiAgICogQHBhcmFtIHBhdHRlcm5cbiAgICogQHBhcmFtIHBhdGhzXG4gICAqIEBwYXJhbSBwYXRoSXNDbG9zZWRcbiAgICogQHJldHVybiB7UGF0aHN9XG4gICAqL1xuICBtaW5rb3dza2lTdW1QYXRocyhwYXR0ZXJuOiBSZWFkb25seVBhdGgsIHBhdGhzOiBSZWFkb25seVBhdGhzLCBwYXRoSXNDbG9zZWQ6IGJvb2xlYW4pOiBQYXRocyB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5taW5rb3dza2lTdW1QYXRocyh0aGlzLmluc3RhbmNlLCBwYXR0ZXJuLCBwYXRocywgcGF0aElzQ2xvc2VkKTtcbiAgfVxuXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gZmlsdGVycyBvdXQgY2xvc2VkIHBhdGhzIGZyb20gdGhlIFBvbHlUcmVlIHN0cnVjdHVyZSBhbmQgcmV0dXJucyBvbmx5IG9wZW4gcGF0aHMgaW4gYSBQYXRocyBzdHJ1Y3R1cmUuXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5VHJlZVxuICAgKiBAcmV0dXJuIHtSZWFkb25seVBhdGhbXX1cbiAgICovXG4gIG9wZW5QYXRoc0Zyb21Qb2x5VHJlZShwb2x5VHJlZTogUG9seVRyZWUpOiBSZWFkb25seVBhdGhbXSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5vcGVuUGF0aHNGcm9tUG9seVRyZWUocG9seVRyZWUpO1xuICB9XG5cbiAgLy9ub2luc3BlY3Rpb24gSlNNZXRob2RDYW5CZVN0YXRpY1xuICAvKipcbiAgICogT3JpZW50YXRpb24gaXMgb25seSBpbXBvcnRhbnQgdG8gY2xvc2VkIHBhdGhzLiBHaXZlbiB0aGF0IHZlcnRpY2VzIGFyZSBkZWNsYXJlZCBpbiBhIHNwZWNpZmljIG9yZGVyLCBvcmllbnRhdGlvbiByZWZlcnMgdG8gdGhlIGRpcmVjdGlvbiAoY2xvY2t3aXNlIG9yXG4gICAqIGNvdW50ZXItY2xvY2t3aXNlKSB0aGF0IHRoZXNlIHZlcnRpY2VzIHByb2dyZXNzIGFyb3VuZCBhIGNsb3NlZCBwYXRoLlxuICAgKlxuICAgKiBPcmllbnRhdGlvbiBpcyBhbHNvIGRlcGVuZGVudCBvbiBheGlzIGRpcmVjdGlvbjpcbiAgICogLSBPbiBZLWF4aXMgcG9zaXRpdmUgdXB3YXJkIGRpc3BsYXlzLCBvcmllbnRhdGlvbiB3aWxsIHJldHVybiB0cnVlIGlmIHRoZSBwb2x5Z29uJ3Mgb3JpZW50YXRpb24gaXMgY291bnRlci1jbG9ja3dpc2UuXG4gICAqIC0gT24gWS1heGlzIHBvc2l0aXZlIGRvd253YXJkIGRpc3BsYXlzLCBvcmllbnRhdGlvbiB3aWxsIHJldHVybiB0cnVlIGlmIHRoZSBwb2x5Z29uJ3Mgb3JpZW50YXRpb24gaXMgY2xvY2t3aXNlLlxuICAgKlxuICAgKiBOb3RlczpcbiAgICogLSBTZWxmLWludGVyc2VjdGluZyBwb2x5Z29ucyBoYXZlIGluZGV0ZXJtaW5hdGUgb3JpZW50YXRpb25zIGluIHdoaWNoIGNhc2UgdGhpcyBmdW5jdGlvbiB3b24ndCByZXR1cm4gYSBtZWFuaW5nZnVsIHZhbHVlLlxuICAgKiAtIFRoZSBtYWpvcml0eSBvZiAyRCBncmFwaGljIGRpc3BsYXkgbGlicmFyaWVzIChlZyBHREksIEdESSssIFhMaWIsIENhaXJvLCBBR0csIEdyYXBoaWNzMzIpIGFuZCBldmVuIHRoZSBTVkcgZmlsZSBmb3JtYXQgaGF2ZSB0aGVpciBjb29yZGluYXRlIG9yaWdpbnNcbiAgICogYXQgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGVpciByZXNwZWN0aXZlIHZpZXdwb3J0cyB3aXRoIHRoZWlyIFkgYXhlcyBpbmNyZWFzaW5nIGRvd253YXJkLiBIb3dldmVyLCBzb21lIGRpc3BsYXkgbGlicmFyaWVzIChlZyBRdWFydHosIE9wZW5HTCkgaGF2ZSB0aGVpclxuICAgKiBjb29yZGluYXRlIG9yaWdpbnMgdW5kZWZpbmVkIG9yIGluIHRoZSBjbGFzc2ljIGJvdHRvbS1sZWZ0IHBvc2l0aW9uIHdpdGggdGhlaXIgWSBheGVzIGluY3JlYXNpbmcgdXB3YXJkLlxuICAgKiAtIEZvciBOb24tWmVybyBmaWxsZWQgcG9seWdvbnMsIHRoZSBvcmllbnRhdGlvbiBvZiBob2xlcyBtdXN0IGJlIG9wcG9zaXRlIHRoYXQgb2Ygb3V0ZXIgcG9seWdvbnMuXG4gICAqIC0gRm9yIGNsb3NlZCBwYXRocyAocG9seWdvbnMpIGluIHRoZSBzb2x1dGlvbiByZXR1cm5lZCBieSB0aGUgY2xpcCBtZXRob2QsIHRoZWlyIG9yaWVudGF0aW9ucyB3aWxsIGFsd2F5cyBiZSB0cnVlIGZvciBvdXRlciBwb2x5Z29ucyBhbmQgZmFsc2VcbiAgICogZm9yIGhvbGUgcG9seWdvbnMgKHVubGVzcyB0aGUgcmV2ZXJzZVNvbHV0aW9uIHByb3BlcnR5IGhhcyBiZWVuIGVuYWJsZWQpLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCAtIFBhdGhcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIG9yaWVudGF0aW9uKHBhdGg6IFJlYWRvbmx5UGF0aCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmdW5jdGlvbnMub3JpZW50YXRpb24ocGF0aCk7XG4gIH1cblxuICAvL25vaW5zcGVjdGlvbiBKU01ldGhvZENhbkJlU3RhdGljXG4gIC8qKlxuICAgKiBSZXR1cm5zIFBvaW50SW5Qb2x5Z29uUmVzdWx0Lk91dHNpZGUgd2hlbiBmYWxzZSwgUG9pbnRJblBvbHlnb25SZXN1bHQuT25Cb3VuZGFyeSB3aGVuIHBvaW50IGlzIG9uIHBvbHkgYW5kIFBvaW50SW5Qb2x5Z29uUmVzdWx0Lkluc2lkZSB3aGVuIHBvaW50IGlzIGluXG4gICAqIHBvbHkuXG4gICAqXG4gICAqIEl0J3MgYXNzdW1lZCB0aGF0ICdwb2x5JyBpcyBjbG9zZWQgYW5kIGRvZXMgbm90IHNlbGYtaW50ZXJzZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRcbiAgICogQHBhcmFtIHBhdGhcbiAgICogQHJldHVybiB7UG9pbnRJblBvbHlnb25SZXN1bHR9XG4gICAqL1xuICBwb2ludEluUG9seWdvbihwb2ludDogUmVhZG9ubHk8SW50UG9pbnQ+LCBwYXRoOiBSZWFkb25seVBhdGgpOiBQb2ludEluUG9seWdvblJlc3VsdCB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5wb2ludEluUG9seWdvbihwb2ludCwgcGF0aCk7XG4gIH1cblxuICAvL25vaW5zcGVjdGlvbiBKU01ldGhvZENhbkJlU3RhdGljXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNvbnZlcnRzIGEgUG9seVRyZWUgc3RydWN0dXJlIGludG8gYSBQYXRocyBzdHJ1Y3R1cmUuXG4gICAqXG4gICAqIEBwYXJhbSBwb2x5VHJlZVxuICAgKiBAcmV0dXJuIHtQYXRoc31cbiAgICovXG4gIHBvbHlUcmVlVG9QYXRocyhwb2x5VHJlZTogUG9seVRyZWUpOiBQYXRocyB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5wb2x5VHJlZVRvUGF0aHMocG9seVRyZWUpO1xuICB9XG5cbiAgLy9ub2luc3BlY3Rpb24gSlNNZXRob2RDYW5CZVN0YXRpY1xuICAvKipcbiAgICogUmV2ZXJzZXMgdGhlIHZlcnRleCBvcmRlciAoYW5kIGhlbmNlIG9yaWVudGF0aW9uKSBpbiB0aGUgc3BlY2lmaWVkIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIC0gUGF0aCB0byByZXZlcnNlLCB3aGljaCBnZXRzIG92ZXJ3cml0dGVuIHJhdGhlciB0aGFuIGNvcGllZFxuICAgKi9cbiAgcmV2ZXJzZVBhdGgocGF0aDogUGF0aCk6IHZvaWQge1xuICAgIGZ1bmN0aW9ucy5yZXZlcnNlUGF0aChwYXRoKTtcbiAgfVxuXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcbiAgLyoqXG4gICAqIFJldmVyc2VzIHRoZSB2ZXJ0ZXggb3JkZXIgKGFuZCBoZW5jZSBvcmllbnRhdGlvbikgaW4gZWFjaCBjb250YWluZWQgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHBhdGhzIC0gUGF0aHMgdG8gcmV2ZXJzZSwgd2hpY2ggZ2V0IG92ZXJ3cml0dGVuIHJhdGhlciB0aGFuIGNvcGllZFxuICAgKi9cbiAgcmV2ZXJzZVBhdGhzKHBhdGhzOiBQYXRocyk6IHZvaWQge1xuICAgIGZ1bmN0aW9ucy5yZXZlcnNlUGF0aHMocGF0aHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgc2VsZi1pbnRlcnNlY3Rpb25zIGZyb20gdGhlIHN1cHBsaWVkIHBvbHlnb24gKGJ5IHBlcmZvcm1pbmcgYSBib29sZWFuIHVuaW9uIG9wZXJhdGlvbiB1c2luZyB0aGUgbm9taW5hdGVkIFBvbHlGaWxsVHlwZSkuXG4gICAqIFBvbHlnb25zIHdpdGggbm9uLWNvbnRpZ3VvdXMgZHVwbGljYXRlIHZlcnRpY2VzIChpZSAndG91Y2hpbmcnKSB3aWxsIGJlIHNwbGl0IGludG8gdHdvIHBvbHlnb25zLlxuICAgKlxuICAgKiBOb3RlOiBUaGVyZSdzIGN1cnJlbnRseSBubyBndWFyYW50ZWUgdGhhdCBwb2x5Z29ucyB3aWxsIGJlIHN0cmljdGx5IHNpbXBsZSBzaW5jZSAnc2ltcGxpZnlpbmcnIGlzIHN0aWxsIGEgd29yayBpbiBwcm9ncmVzcy5cbiAgICpcbiAgICogQHBhcmFtIHBhdGhcbiAgICogQHBhcmFtIGZpbGxUeXBlXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIFRoZSBzb2x1dGlvblxuICAgKi9cbiAgc2ltcGxpZnlQb2x5Z29uKHBhdGg6IFJlYWRvbmx5UGF0aCwgZmlsbFR5cGU6IFBvbHlGaWxsVHlwZSA9IFBvbHlGaWxsVHlwZS5FdmVuT2RkKTogUGF0aHMge1xuICAgIHJldHVybiBmdW5jdGlvbnMuc2ltcGxpZnlQb2x5Z29uKHRoaXMuaW5zdGFuY2UsIHBhdGgsIGZpbGxUeXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHNlbGYtaW50ZXJzZWN0aW9ucyBmcm9tIHRoZSBzdXBwbGllZCBwb2x5Z29ucyAoYnkgcGVyZm9ybWluZyBhIGJvb2xlYW4gdW5pb24gb3BlcmF0aW9uIHVzaW5nIHRoZSBub21pbmF0ZWQgUG9seUZpbGxUeXBlKS5cbiAgICogUG9seWdvbnMgd2l0aCBub24tY29udGlndW91cyBkdXBsaWNhdGUgdmVydGljZXMgKGllICd2ZXJ0aWNlcyBhcmUgdG91Y2hpbmcnKSB3aWxsIGJlIHNwbGl0IGludG8gdHdvIHBvbHlnb25zLlxuICAgKlxuICAgKiBOb3RlOiBUaGVyZSdzIGN1cnJlbnRseSBubyBndWFyYW50ZWUgdGhhdCBwb2x5Z29ucyB3aWxsIGJlIHN0cmljdGx5IHNpbXBsZSBzaW5jZSAnc2ltcGxpZnlpbmcnIGlzIHN0aWxsIGEgd29yayBpbiBwcm9ncmVzcy5cbiAgICpcbiAgICogQHBhcmFtIHBhdGhzXG4gICAqIEBwYXJhbSBmaWxsVHlwZVxuICAgKiBAcmV0dXJuIHtQYXRoc30gLSBUaGUgc29sdXRpb25cbiAgICovXG4gIHNpbXBsaWZ5UG9seWdvbnMocGF0aHM6IFJlYWRvbmx5UGF0aHMsIGZpbGxUeXBlOiBQb2x5RmlsbFR5cGUgPSBQb2x5RmlsbFR5cGUuRXZlbk9kZCk6IFBhdGhzIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNpbXBsaWZ5UG9seWdvbnModGhpcy5pbnN0YW5jZSwgcGF0aHMsIGZpbGxUeXBlKTtcbiAgfVxuXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcbiAgLyoqXG4gICAqIFNjYWxlcyBhIHBhdGggYnkgbXVsdGlwbHlpbmcgYWxsIGl0cyBwb2ludHMgYnkgYSBudW1iZXIgYW5kIHRoZW4gcm91bmRpbmcgdGhlbS5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggLSBQYXRoIHRvIHNjYWxlXG4gICAqIEBwYXJhbSBzY2FsZSAtIFNjYWxlIG11bHRpcGxpZXJcbiAgICogQHJldHVybiB7UGF0aH0gLSBUaGUgc2NhbGVkIHBhdGhcbiAgICovXG4gIHNjYWxlUGF0aChwYXRoOiBSZWFkb25seVBhdGgsIHNjYWxlOiBudW1iZXIpOiBQYXRoIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNjYWxlUGF0aChwYXRoLCBzY2FsZSk7XG4gIH1cblxuICAvL25vaW5zcGVjdGlvbiBKU01ldGhvZENhbkJlU3RhdGljXG4gIC8qKlxuICAgKiBTY2FsZXMgYWxsIGlubmVyIHBhdGhzIGJ5IG11bHRpcGx5aW5nIGFsbCBpdHMgcG9pbnRzIGJ5IGEgbnVtYmVyIGFuZCB0aGVuIHJvdW5kaW5nIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSBwYXRocyAtIFBhdGhzIHRvIHNjYWxlXG4gICAqIEBwYXJhbSBzY2FsZSAtIFNjYWxlIG11bHRpcGxpZXJcbiAgICogQHJldHVybiB7UGF0aHN9IC0gVGhlIHNjYWxlZCBwYXRoc1xuICAgKi9cbiAgc2NhbGVQYXRocyhwYXRoczogUmVhZG9ubHlQYXRocywgc2NhbGU6IG51bWJlcik6IFBhdGhzIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNjYWxlUGF0aHMocGF0aHMsIHNjYWxlKTtcbiAgfVxufVxuXG4vKipcbiAqIEFzeW5jaHJvbm91c2x5IHRyaWVzIHRvIGxvYWQgYSBuZXcgbmF0aXZlIGluc3RhbmNlIG9mIHRoZSBjbGlwcGVyIGxpYnJhcnkgdG8gYmUgc2hhcmVkIGFjcm9zcyBhbGwgbWV0aG9kIGludm9jYXRpb25zLlxuICpcbiAqIEBwYXJhbSBmb3JtYXQgLSBGb3JtYXQgdG8gbG9hZCwgZWl0aGVyIFdhc21UaGVuQXNtSnMsIFdhc21Pbmx5IG9yIEFzbUpzT25seS5cbiAqIEByZXR1cm4ge1Byb21pc2U8Q2xpcHBlckxpYldyYXBwZXI+fSAtIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSB3cmFwcGVyIGluc3RhbmNlLlxuICovXG5leHBvcnQgY29uc3QgbG9hZE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZUFzeW5jID0gYXN5bmMgKFxuICBmb3JtYXQ6IE5hdGl2ZUNsaXBwZXJMaWJSZXF1ZXN0ZWRGb3JtYXRcbik6IFByb21pc2U8Q2xpcHBlckxpYldyYXBwZXI+ID0+IHtcbiAgLy8gVE9ETzogaW4gdGhlIGZ1dHVyZSB1c2UgdGhlc2UgbWV0aG9kcyBpbnN0ZWFkIGh0dHBzOi8vZ2l0aHViLmNvbS9qZWRpc2N0MS9saWJzb2RpdW0uanMvaXNzdWVzLzk0XG5cbiAgbGV0IHRyeVdhc207XG4gIGxldCB0cnlBc21KcztcbiAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICBjYXNlIE5hdGl2ZUNsaXBwZXJMaWJSZXF1ZXN0ZWRGb3JtYXQuV2FzbVdpdGhBc21Kc0ZhbGxiYWNrOlxuICAgICAgdHJ5V2FzbSA9IHRydWU7XG4gICAgICB0cnlBc21KcyA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIE5hdGl2ZUNsaXBwZXJMaWJSZXF1ZXN0ZWRGb3JtYXQuV2FzbU9ubHk6XG4gICAgICB0cnlXYXNtID0gdHJ1ZTtcbiAgICAgIHRyeUFzbUpzID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICBjYXNlIE5hdGl2ZUNsaXBwZXJMaWJSZXF1ZXN0ZWRGb3JtYXQuQXNtSnNPbmx5OlxuICAgICAgdHJ5V2FzbSA9IGZhbHNlO1xuICAgICAgdHJ5QXNtSnMgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBDbGlwcGVyRXJyb3IoXCJ1bmtub3duIG5hdGl2ZSBjbGlwcGVyIGZvcm1hdFwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1vZHVsZUFzeW5jKFxuICAgIGluaXRNb2R1bGU6IChvdmVycmlkZXM6IG9iamVjdCkgPT4gTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIHwgdW5kZWZpbmVkXG4gICk6IFByb21pc2U8TmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGZpbmFsTW9kdWxlOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfCB1bmRlZmluZWQ7XG5cbiAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW51c2VkTG9jYWxTeW1ib2xzXG4gICAgICBjb25zdCBtb2R1bGVPdmVycmlkZXMgPSB7XG4gICAgICAgIG5vRXhpdFJ1bnRpbWU6IHRydWUsXG4gICAgICAgIHByZVJ1bigpIHtcbiAgICAgICAgICBpZiAoZmluYWxNb2R1bGUpIHtcbiAgICAgICAgICAgIHJlc29sdmUoZmluYWxNb2R1bGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShmaW5hbE1vZHVsZSk7XG4gICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHF1aXQoY29kZTogbnVtYmVyLCBlcnI6IEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZpbmFsTW9kdWxlID0gaW5pdE1vZHVsZShtb2R1bGVPdmVycmlkZXMpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHRyeVdhc20pIHtcbiAgICBpZiAod2FzbU1vZHVsZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBza2lwXG4gICAgfSBlbHNlIGlmICh3YXNtTW9kdWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGluaXRNb2R1bGUgPSByZXF1aXJlKFwiLi93YXNtL2NsaXBwZXItd2FzbVwiKS5pbml0O1xuICAgICAgICB3YXNtTW9kdWxlID0gYXdhaXQgZ2V0TW9kdWxlQXN5bmMoaW5pdE1vZHVsZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBDbGlwcGVyTGliV3JhcHBlcih3YXNtTW9kdWxlLCBOYXRpdmVDbGlwcGVyTGliTG9hZGVkRm9ybWF0Lldhc20pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHdhc21Nb2R1bGUgPSBlcnI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgQ2xpcHBlckxpYldyYXBwZXIod2FzbU1vZHVsZSwgTmF0aXZlQ2xpcHBlckxpYkxvYWRlZEZvcm1hdC5XYXNtKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHJ5QXNtSnMpIHtcbiAgICBpZiAoYXNtSnNNb2R1bGUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgLy8gc2tpcFxuICAgIH0gZWxzZSBpZiAoYXNtSnNNb2R1bGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaW5pdE1vZHVsZSA9IHJlcXVpcmUoXCIuL3dhc20vY2xpcHBlclwiKS5pbml0O1xuICAgICAgICBhc21Kc01vZHVsZSA9IGF3YWl0IGdldE1vZHVsZUFzeW5jKGluaXRNb2R1bGUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQ2xpcHBlckxpYldyYXBwZXIoYXNtSnNNb2R1bGUsIE5hdGl2ZUNsaXBwZXJMaWJMb2FkZWRGb3JtYXQuQXNtSnMpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGFzbUpzTW9kdWxlID0gZXJyO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IENsaXBwZXJMaWJXcmFwcGVyKGFzbUpzTW9kdWxlLCBOYXRpdmVDbGlwcGVyTGliTG9hZGVkRm9ybWF0LkFzbUpzKTtcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgQ2xpcHBlckVycm9yKFwiY291bGQgbm90IGxvYWQgbmF0aXZlIGNsaXBwZXIgaW4gdGhlIGRlc2lyZWQgZm9ybWF0XCIpO1xufTtcbiJdfQ==