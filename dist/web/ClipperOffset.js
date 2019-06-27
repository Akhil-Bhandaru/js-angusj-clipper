"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativeEnumConversion_1 = require("./native/nativeEnumConversion");
var PathsToNativePaths_1 = require("./native/PathsToNativePaths");
var PathToNativePath_1 = require("./native/PathToNativePath");
var PolyTree_1 = require("./PolyTree");
/**
 * The ClipperOffset class encapsulates the process of offsetting (inflating/deflating) both open and closed paths using a number of different join types
 * and end types.
 *
 * Preconditions for offsetting:
 * 1. The orientations of closed paths must be consistent such that outer polygons share the same orientation, and any holes have the opposite orientation
 * (ie non-zero filling). Open paths must be oriented with closed outer polygons.
 * 2. Polygons must not self-intersect.
 *
 * Limitations:
 * When offsetting, small artefacts may appear where polygons overlap. To avoid these artefacts, offset overlapping polygons separately.
 */
var ClipperOffset = /** @class */ (function () {
    /**
     * The ClipperOffset constructor takes 2 optional parameters: MiterLimit and ArcTolerance. The two parameters corresponds to properties of the same name.
     * MiterLimit is only relevant when JoinType is Miter, and ArcTolerance is only relevant when JoinType is Round or when EndType is OpenRound.
     *
     * @param _nativeLib - Native clipper lib instance to use
     * @param miterLimit - Miter limit
     * @param arcTolerance - ArcTolerance (round precision)
     */
    function ClipperOffset(_nativeLib, miterLimit, arcTolerance) {
        if (miterLimit === void 0) { miterLimit = 2; }
        if (arcTolerance === void 0) { arcTolerance = 0.25; }
        this._nativeLib = _nativeLib;
        this._clipperOffset = new _nativeLib.ClipperOffset(miterLimit, arcTolerance);
    }
    Object.defineProperty(ClipperOffset.prototype, "arcTolerance", {
        /**
         * Firstly, this field/property is only relevant when JoinType = Round and/or EndType = Round.
         *
         * Since flattened paths can never perfectly represent arcs, this field/property specifies a maximum acceptable imprecision ('tolerance') when arcs are
         * approximated in an offsetting operation. Smaller values will increase 'smoothness' up to a point though at a cost of performance and in creating more
         * vertices to construct the arc.
         *
         * The default ArcTolerance is 0.25 units. This means that the maximum distance the flattened path will deviate from the 'true' arc will be no more
         * than 0.25 units (before rounding).
         *
         * Reducing tolerances below 0.25 will not improve smoothness since vertex coordinates will still be rounded to integer values. The only way to achieve
         * sub-integer precision is through coordinate scaling before and after offsetting (see example below).
         *
         * It's important to make ArcTolerance a sensible fraction of the offset delta (arc radius). Large tolerances relative to the offset delta will produce
         * poor arc approximations but, just as importantly, very small tolerances will substantially slow offsetting performance while providing unnecessary
         * degrees of precision. This is most likely to be an issue when offsetting polygons whose coordinates have been scaled to preserve floating point precision.
         *
         * Example: Imagine a set of polygons (defined in floating point coordinates) that is to be offset by 10 units using round joins, and the solution is to
         * retain floating point precision up to at least 6 decimal places.
         * To preserve this degree of floating point precision, and given that Clipper and ClipperOffset both operate on integer coordinates, the polygon
         * coordinates will be scaled up by 108 (and rounded to integers) prior to offsetting. Both offset delta and ArcTolerance will also need to be scaled
         * by this same factor. If ArcTolerance was left unscaled at the default 0.25 units, every arc in the solution would contain a fraction of 44 THOUSAND
         * vertices while the final arc imprecision would be 0.25 × 10-8 units (ie once scaling was reversed). However, if 0.1 units was an acceptable imprecision
         * in the final unscaled solution, then ArcTolerance should be set to 0.1 × scaling_factor (0.1 × 108 ). Now if scaling is applied equally to both
         * ArcTolerance and to Delta Offset, then in this example the number of vertices (steps) defining each arc would be a fraction of 23.
         *
         * The formula for the number of steps in a full circular arc is ... Pi / acos(1 - arc_tolerance / abs(delta))
         *
         * @return {number} - Current arc tolerance
         */
        get: function () {
            return this._clipperOffset.arcTolerance;
        },
        /**
         * Firstly, this field/property is only relevant when JoinType = Round and/or EndType = Round.
         *
         * Since flattened paths can never perfectly represent arcs, this field/property specifies a maximum acceptable imprecision ('tolerance') when arcs are
         * approximated in an offsetting operation. Smaller values will increase 'smoothness' up to a point though at a cost of performance and in creating more
         * vertices to construct the arc.
         *
         * The default ArcTolerance is 0.25 units. This means that the maximum distance the flattened path will deviate from the 'true' arc will be no more
         * than 0.25 units (before rounding).
         *
         * Reducing tolerances below 0.25 will not improve smoothness since vertex coordinates will still be rounded to integer values. The only way to achieve
         * sub-integer precision is through coordinate scaling before and after offsetting (see example below).
         *
         * It's important to make ArcTolerance a sensible fraction of the offset delta (arc radius). Large tolerances relative to the offset delta will produce
         * poor arc approximations but, just as importantly, very small tolerances will substantially slow offsetting performance while providing unnecessary
         * degrees of precision. This is most likely to be an issue when offsetting polygons whose coordinates have been scaled to preserve floating point precision.
         *
         * Example: Imagine a set of polygons (defined in floating point coordinates) that is to be offset by 10 units using round joins, and the solution is to
         * retain floating point precision up to at least 6 decimal places.
         * To preserve this degree of floating point precision, and given that Clipper and ClipperOffset both operate on integer coordinates, the polygon
         * coordinates will be scaled up by 108 (and rounded to integers) prior to offsetting. Both offset delta and ArcTolerance will also need to be scaled
         * by this same factor. If ArcTolerance was left unscaled at the default 0.25 units, every arc in the solution would contain a fraction of 44 THOUSAND
         * vertices while the final arc imprecision would be 0.25 × 10-8 units (ie once scaling was reversed). However, if 0.1 units was an acceptable imprecision
         * in the final unscaled solution, then ArcTolerance should be set to 0.1 × scaling_factor (0.1 × 108 ). Now if scaling is applied equally to both
         * ArcTolerance and to Delta Offset, then in this example the number of vertices (steps) defining each arc would be a fraction of 23.
         *
         * The formula for the number of steps in a full circular arc is ... Pi / acos(1 - arc_tolerance / abs(delta))
         *
         * @param value - Arc tolerance to set.
         */
        set: function (value) {
            this._clipperOffset.arcTolerance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClipperOffset.prototype, "miterLimit", {
        /**
         * This property sets the maximum distance in multiples of delta that vertices can be offset from their original positions before squaring is applied.
         * (Squaring truncates a miter by 'cutting it off' at 1 × delta distance from the original vertex.)
         *
         * The default value for MiterLimit is 2 (ie twice delta). This is also the smallest MiterLimit that's allowed. If mitering was unrestricted (ie without
         * any squaring), then offsets at very acute angles would generate unacceptably long 'spikes'.
         *
         * @return {number} - Current miter limit
         */
        get: function () {
            return this._clipperOffset.miterLimit;
        },
        /**
         * Sets the current miter limit (see getter docs for more info).
         *
         * @param value - Mit limit to set.
         */
        set: function (value) {
            this._clipperOffset.miterLimit = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a Path to a ClipperOffset object in preparation for offsetting.
     *
     * Any number of paths can be added, and each has its own JoinType and EndType. All 'outer' Paths must have the same orientation, and any 'hole' paths must
     * have reverse orientation. Closed paths must have at least 3 vertices. Open paths may have as few as one vertex. Open paths can only be offset
     * with positive deltas.
     *
     * @param path - Path to add
     * @param joinType - Join type
     * @param endType - End type
     */
    ClipperOffset.prototype.addPath = function (path, joinType, endType) {
        var nativePath = PathToNativePath_1.pathToNativePath(this._nativeLib, path);
        try {
            this._clipperOffset.addPath(nativePath, nativeEnumConversion_1.joinTypeToNative(this._nativeLib, joinType), nativeEnumConversion_1.endTypeToNative(this._nativeLib, endType));
        }
        finally {
            nativePath.delete();
        }
    };
    /**
     * Adds Paths to a ClipperOffset object in preparation for offsetting.
     *
     * Any number of paths can be added, and each path has its own JoinType and EndType. All 'outer' Paths must have the same orientation, and any 'hole'
     * paths must have reverse orientation. Closed paths must have at least 3 vertices. Open paths may have as few as one vertex. Open paths can only be
     * offset with positive deltas.
     *
     * @param paths - Paths to add
     * @param joinType - Join type
     * @param endType - End type
     */
    ClipperOffset.prototype.addPaths = function (paths, joinType, endType) {
        var nativePaths = PathsToNativePaths_1.pathsToNativePaths(this._nativeLib, paths);
        try {
            this._clipperOffset.addPaths(nativePaths, nativeEnumConversion_1.joinTypeToNative(this._nativeLib, joinType), nativeEnumConversion_1.endTypeToNative(this._nativeLib, endType));
        }
        finally {
            nativePaths.delete();
        }
    };
    /**
     * Negative delta values shrink polygons and positive delta expand them.
     *
     * This method can be called multiple times, offsetting the same paths by different amounts (ie using different deltas).
     *
     * @param delta - Delta
     * @param cleanDistance - Clean distance over the output, or undefined for no cleaning.
     * @return {Paths} - Solution paths
     */
    ClipperOffset.prototype.executeToPaths = function (delta, cleanDistance) {
        var outNativePaths = new this._nativeLib.Paths();
        try {
            this._clipperOffset.executePaths(outNativePaths, delta);
            if (cleanDistance !== undefined) {
                this._nativeLib.cleanPolygons(outNativePaths, cleanDistance);
            }
            return PathsToNativePaths_1.nativePathsToPaths(this._nativeLib, outNativePaths, true); // frees outNativePaths
        }
        finally {
            if (!outNativePaths.isDeleted()) {
                outNativePaths.delete();
            }
        }
    };
    /**
     * This method takes two parameters. The first is the structure that receives the result of the offset operation (a PolyTree structure). The second parameter
     * is the amount to which the supplied paths will be offset. Negative delta values shrink polygons and positive delta expand them.
     *
     * This method can be called multiple times, offsetting the same paths by different amounts (ie using different deltas).
     *
     * @param delta - Delta
     * @return {Paths} - Solution paths
     */
    ClipperOffset.prototype.executeToPolyTree = function (delta) {
        var outNativePolyTree = new this._nativeLib.PolyTree();
        try {
            this._clipperOffset.executePolyTree(outNativePolyTree, delta);
            return PolyTree_1.PolyTree.fromNativePolyTree(this._nativeLib, outNativePolyTree, true); // frees outNativePolyTree
        }
        finally {
            if (!outNativePolyTree.isDeleted()) {
                outNativePolyTree.delete();
            }
        }
    };
    /**
     * This method clears all paths from the ClipperOffset object, allowing new paths to be assigned.
     */
    ClipperOffset.prototype.clear = function () {
        this._clipperOffset.clear();
    };
    /**
     * Checks if the object has been disposed.
     *
     * @return {boolean} - true if disposed, false if not
     */
    ClipperOffset.prototype.isDisposed = function () {
        return this._clipperOffset === undefined || this._clipperOffset.isDeleted();
    };
    /**
     * Since this library uses WASM/ASM.JS internally for speed this means that you must dispose objects after you are done using them or mem leaks will occur.
     */
    ClipperOffset.prototype.dispose = function () {
        if (this._clipperOffset) {
            this._clipperOffset.delete();
            this._clipperOffset = undefined;
        }
    };
    return ClipperOffset;
}());
exports.ClipperOffset = ClipperOffset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpcHBlck9mZnNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9DbGlwcGVyT2Zmc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esc0VBQWtGO0FBQ2xGLGtFQUFxRjtBQUNyRiw4REFBNkQ7QUFHN0QsdUNBQXNDO0FBRXRDOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUE2RkU7Ozs7Ozs7T0FPRztJQUNILHVCQUNtQixVQUFvQyxFQUNyRCxVQUFjLEVBQ2QsWUFBbUI7UUFEbkIsMkJBQUEsRUFBQSxjQUFjO1FBQ2QsNkJBQUEsRUFBQSxtQkFBbUI7UUFGRixlQUFVLEdBQVYsVUFBVSxDQUEwQjtRQUlyRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQTFFRCxzQkFBSSx1Q0FBWTtRQTlCaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBNkJHO2FBQ0g7WUFDRSxPQUFPLElBQUksQ0FBQyxjQUFlLENBQUMsWUFBWSxDQUFDO1FBQzNDLENBQUM7UUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0E2Qkc7YUFDSCxVQUFpQixLQUFhO1lBQzVCLElBQUksQ0FBQyxjQUFlLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUM1QyxDQUFDOzs7T0FsQ0E7SUE2Q0Qsc0JBQUkscUNBQVU7UUFUZDs7Ozs7Ozs7V0FRRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsY0FBZSxDQUFDLFVBQVUsQ0FBQztRQUN6QyxDQUFDO1FBRUQ7Ozs7V0FJRzthQUNILFVBQWUsS0FBYTtZQUMxQixJQUFJLENBQUMsY0FBZSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDMUMsQ0FBQzs7O09BVEE7SUEyQkQ7Ozs7Ozs7Ozs7T0FVRztJQUNILCtCQUFPLEdBQVAsVUFBUSxJQUFrQixFQUFFLFFBQWtCLEVBQUUsT0FBZ0I7UUFD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QUFTLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBbk9ELElBbU9DO0FBbk9ZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW5kVHlwZSwgSm9pblR5cGUgfSBmcm9tIFwiLi9lbnVtc1wiO1xuaW1wb3J0IHsgTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZVwiO1xuaW1wb3J0IHsgTmF0aXZlQ2xpcHBlck9mZnNldCB9IGZyb20gXCIuL25hdGl2ZS9OYXRpdmVDbGlwcGVyT2Zmc2V0XCI7XG5pbXBvcnQgeyBlbmRUeXBlVG9OYXRpdmUsIGpvaW5UeXBlVG9OYXRpdmUgfSBmcm9tIFwiLi9uYXRpdmUvbmF0aXZlRW51bUNvbnZlcnNpb25cIjtcbmltcG9ydCB7IG5hdGl2ZVBhdGhzVG9QYXRocywgcGF0aHNUb05hdGl2ZVBhdGhzIH0gZnJvbSBcIi4vbmF0aXZlL1BhdGhzVG9OYXRpdmVQYXRoc1wiO1xuaW1wb3J0IHsgcGF0aFRvTmF0aXZlUGF0aCB9IGZyb20gXCIuL25hdGl2ZS9QYXRoVG9OYXRpdmVQYXRoXCI7XG5pbXBvcnQgeyBQYXRoLCBSZWFkb25seVBhdGggfSBmcm9tIFwiLi9QYXRoXCI7XG5pbXBvcnQgeyBQYXRocywgUmVhZG9ubHlQYXRocyB9IGZyb20gXCIuL1BhdGhzXCI7XG5pbXBvcnQgeyBQb2x5VHJlZSB9IGZyb20gXCIuL1BvbHlUcmVlXCI7XG5cbi8qKlxuICogVGhlIENsaXBwZXJPZmZzZXQgY2xhc3MgZW5jYXBzdWxhdGVzIHRoZSBwcm9jZXNzIG9mIG9mZnNldHRpbmcgKGluZmxhdGluZy9kZWZsYXRpbmcpIGJvdGggb3BlbiBhbmQgY2xvc2VkIHBhdGhzIHVzaW5nIGEgbnVtYmVyIG9mIGRpZmZlcmVudCBqb2luIHR5cGVzXG4gKiBhbmQgZW5kIHR5cGVzLlxuICpcbiAqIFByZWNvbmRpdGlvbnMgZm9yIG9mZnNldHRpbmc6XG4gKiAxLiBUaGUgb3JpZW50YXRpb25zIG9mIGNsb3NlZCBwYXRocyBtdXN0IGJlIGNvbnNpc3RlbnQgc3VjaCB0aGF0IG91dGVyIHBvbHlnb25zIHNoYXJlIHRoZSBzYW1lIG9yaWVudGF0aW9uLCBhbmQgYW55IGhvbGVzIGhhdmUgdGhlIG9wcG9zaXRlIG9yaWVudGF0aW9uXG4gKiAoaWUgbm9uLXplcm8gZmlsbGluZykuIE9wZW4gcGF0aHMgbXVzdCBiZSBvcmllbnRlZCB3aXRoIGNsb3NlZCBvdXRlciBwb2x5Z29ucy5cbiAqIDIuIFBvbHlnb25zIG11c3Qgbm90IHNlbGYtaW50ZXJzZWN0LlxuICpcbiAqIExpbWl0YXRpb25zOlxuICogV2hlbiBvZmZzZXR0aW5nLCBzbWFsbCBhcnRlZmFjdHMgbWF5IGFwcGVhciB3aGVyZSBwb2x5Z29ucyBvdmVybGFwLiBUbyBhdm9pZCB0aGVzZSBhcnRlZmFjdHMsIG9mZnNldCBvdmVybGFwcGluZyBwb2x5Z29ucyBzZXBhcmF0ZWx5LlxuICovXG5leHBvcnQgY2xhc3MgQ2xpcHBlck9mZnNldCB7XG4gIHByaXZhdGUgX2NsaXBwZXJPZmZzZXQ/OiBOYXRpdmVDbGlwcGVyT2Zmc2V0O1xuXG4gIC8qKlxuICAgKiBGaXJzdGx5LCB0aGlzIGZpZWxkL3Byb3BlcnR5IGlzIG9ubHkgcmVsZXZhbnQgd2hlbiBKb2luVHlwZSA9IFJvdW5kIGFuZC9vciBFbmRUeXBlID0gUm91bmQuXG4gICAqXG4gICAqIFNpbmNlIGZsYXR0ZW5lZCBwYXRocyBjYW4gbmV2ZXIgcGVyZmVjdGx5IHJlcHJlc2VudCBhcmNzLCB0aGlzIGZpZWxkL3Byb3BlcnR5IHNwZWNpZmllcyBhIG1heGltdW0gYWNjZXB0YWJsZSBpbXByZWNpc2lvbiAoJ3RvbGVyYW5jZScpIHdoZW4gYXJjcyBhcmVcbiAgICogYXBwcm94aW1hdGVkIGluIGFuIG9mZnNldHRpbmcgb3BlcmF0aW9uLiBTbWFsbGVyIHZhbHVlcyB3aWxsIGluY3JlYXNlICdzbW9vdGhuZXNzJyB1cCB0byBhIHBvaW50IHRob3VnaCBhdCBhIGNvc3Qgb2YgcGVyZm9ybWFuY2UgYW5kIGluIGNyZWF0aW5nIG1vcmVcbiAgICogdmVydGljZXMgdG8gY29uc3RydWN0IHRoZSBhcmMuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IEFyY1RvbGVyYW5jZSBpcyAwLjI1IHVuaXRzLiBUaGlzIG1lYW5zIHRoYXQgdGhlIG1heGltdW0gZGlzdGFuY2UgdGhlIGZsYXR0ZW5lZCBwYXRoIHdpbGwgZGV2aWF0ZSBmcm9tIHRoZSAndHJ1ZScgYXJjIHdpbGwgYmUgbm8gbW9yZVxuICAgKiB0aGFuIDAuMjUgdW5pdHMgKGJlZm9yZSByb3VuZGluZykuXG4gICAqXG4gICAqIFJlZHVjaW5nIHRvbGVyYW5jZXMgYmVsb3cgMC4yNSB3aWxsIG5vdCBpbXByb3ZlIHNtb290aG5lc3Mgc2luY2UgdmVydGV4IGNvb3JkaW5hdGVzIHdpbGwgc3RpbGwgYmUgcm91bmRlZCB0byBpbnRlZ2VyIHZhbHVlcy4gVGhlIG9ubHkgd2F5IHRvIGFjaGlldmVcbiAgICogc3ViLWludGVnZXIgcHJlY2lzaW9uIGlzIHRocm91Z2ggY29vcmRpbmF0ZSBzY2FsaW5nIGJlZm9yZSBhbmQgYWZ0ZXIgb2Zmc2V0dGluZyAoc2VlIGV4YW1wbGUgYmVsb3cpLlxuICAgKlxuICAgKiBJdCdzIGltcG9ydGFudCB0byBtYWtlIEFyY1RvbGVyYW5jZSBhIHNlbnNpYmxlIGZyYWN0aW9uIG9mIHRoZSBvZmZzZXQgZGVsdGEgKGFyYyByYWRpdXMpLiBMYXJnZSB0b2xlcmFuY2VzIHJlbGF0aXZlIHRvIHRoZSBvZmZzZXQgZGVsdGEgd2lsbCBwcm9kdWNlXG4gICAqIHBvb3IgYXJjIGFwcHJveGltYXRpb25zIGJ1dCwganVzdCBhcyBpbXBvcnRhbnRseSwgdmVyeSBzbWFsbCB0b2xlcmFuY2VzIHdpbGwgc3Vic3RhbnRpYWxseSBzbG93IG9mZnNldHRpbmcgcGVyZm9ybWFuY2Ugd2hpbGUgcHJvdmlkaW5nIHVubmVjZXNzYXJ5XG4gICAqIGRlZ3JlZXMgb2YgcHJlY2lzaW9uLiBUaGlzIGlzIG1vc3QgbGlrZWx5IHRvIGJlIGFuIGlzc3VlIHdoZW4gb2Zmc2V0dGluZyBwb2x5Z29ucyB3aG9zZSBjb29yZGluYXRlcyBoYXZlIGJlZW4gc2NhbGVkIHRvIHByZXNlcnZlIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbi5cbiAgICpcbiAgICogRXhhbXBsZTogSW1hZ2luZSBhIHNldCBvZiBwb2x5Z29ucyAoZGVmaW5lZCBpbiBmbG9hdGluZyBwb2ludCBjb29yZGluYXRlcykgdGhhdCBpcyB0byBiZSBvZmZzZXQgYnkgMTAgdW5pdHMgdXNpbmcgcm91bmQgam9pbnMsIGFuZCB0aGUgc29sdXRpb24gaXMgdG9cbiAgICogcmV0YWluIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbiB1cCB0byBhdCBsZWFzdCA2IGRlY2ltYWwgcGxhY2VzLlxuICAgKiBUbyBwcmVzZXJ2ZSB0aGlzIGRlZ3JlZSBvZiBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24sIGFuZCBnaXZlbiB0aGF0IENsaXBwZXIgYW5kIENsaXBwZXJPZmZzZXQgYm90aCBvcGVyYXRlIG9uIGludGVnZXIgY29vcmRpbmF0ZXMsIHRoZSBwb2x5Z29uXG4gICAqIGNvb3JkaW5hdGVzIHdpbGwgYmUgc2NhbGVkIHVwIGJ5IDEwOCAoYW5kIHJvdW5kZWQgdG8gaW50ZWdlcnMpIHByaW9yIHRvIG9mZnNldHRpbmcuIEJvdGggb2Zmc2V0IGRlbHRhIGFuZCBBcmNUb2xlcmFuY2Ugd2lsbCBhbHNvIG5lZWQgdG8gYmUgc2NhbGVkXG4gICAqIGJ5IHRoaXMgc2FtZSBmYWN0b3IuIElmIEFyY1RvbGVyYW5jZSB3YXMgbGVmdCB1bnNjYWxlZCBhdCB0aGUgZGVmYXVsdCAwLjI1IHVuaXRzLCBldmVyeSBhcmMgaW4gdGhlIHNvbHV0aW9uIHdvdWxkIGNvbnRhaW4gYSBmcmFjdGlvbiBvZiA0NCBUSE9VU0FORFxuICAgKiB2ZXJ0aWNlcyB3aGlsZSB0aGUgZmluYWwgYXJjIGltcHJlY2lzaW9uIHdvdWxkIGJlIDAuMjUgw5cgMTAtOCB1bml0cyAoaWUgb25jZSBzY2FsaW5nIHdhcyByZXZlcnNlZCkuIEhvd2V2ZXIsIGlmIDAuMSB1bml0cyB3YXMgYW4gYWNjZXB0YWJsZSBpbXByZWNpc2lvblxuICAgKiBpbiB0aGUgZmluYWwgdW5zY2FsZWQgc29sdXRpb24sIHRoZW4gQXJjVG9sZXJhbmNlIHNob3VsZCBiZSBzZXQgdG8gMC4xIMOXIHNjYWxpbmdfZmFjdG9yICgwLjEgw5cgMTA4ICkuIE5vdyBpZiBzY2FsaW5nIGlzIGFwcGxpZWQgZXF1YWxseSB0byBib3RoXG4gICAqIEFyY1RvbGVyYW5jZSBhbmQgdG8gRGVsdGEgT2Zmc2V0LCB0aGVuIGluIHRoaXMgZXhhbXBsZSB0aGUgbnVtYmVyIG9mIHZlcnRpY2VzIChzdGVwcykgZGVmaW5pbmcgZWFjaCBhcmMgd291bGQgYmUgYSBmcmFjdGlvbiBvZiAyMy5cbiAgICpcbiAgICogVGhlIGZvcm11bGEgZm9yIHRoZSBudW1iZXIgb2Ygc3RlcHMgaW4gYSBmdWxsIGNpcmN1bGFyIGFyYyBpcyAuLi4gUGkgLyBhY29zKDEgLSBhcmNfdG9sZXJhbmNlIC8gYWJzKGRlbHRhKSlcbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSAtIEN1cnJlbnQgYXJjIHRvbGVyYW5jZVxuICAgKi9cbiAgZ2V0IGFyY1RvbGVyYW5jZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jbGlwcGVyT2Zmc2V0IS5hcmNUb2xlcmFuY2U7XG4gIH1cblxuICAvKipcbiAgICogRmlyc3RseSwgdGhpcyBmaWVsZC9wcm9wZXJ0eSBpcyBvbmx5IHJlbGV2YW50IHdoZW4gSm9pblR5cGUgPSBSb3VuZCBhbmQvb3IgRW5kVHlwZSA9IFJvdW5kLlxuICAgKlxuICAgKiBTaW5jZSBmbGF0dGVuZWQgcGF0aHMgY2FuIG5ldmVyIHBlcmZlY3RseSByZXByZXNlbnQgYXJjcywgdGhpcyBmaWVsZC9wcm9wZXJ0eSBzcGVjaWZpZXMgYSBtYXhpbXVtIGFjY2VwdGFibGUgaW1wcmVjaXNpb24gKCd0b2xlcmFuY2UnKSB3aGVuIGFyY3MgYXJlXG4gICAqIGFwcHJveGltYXRlZCBpbiBhbiBvZmZzZXR0aW5nIG9wZXJhdGlvbi4gU21hbGxlciB2YWx1ZXMgd2lsbCBpbmNyZWFzZSAnc21vb3RobmVzcycgdXAgdG8gYSBwb2ludCB0aG91Z2ggYXQgYSBjb3N0IG9mIHBlcmZvcm1hbmNlIGFuZCBpbiBjcmVhdGluZyBtb3JlXG4gICAqIHZlcnRpY2VzIHRvIGNvbnN0cnVjdCB0aGUgYXJjLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBBcmNUb2xlcmFuY2UgaXMgMC4yNSB1bml0cy4gVGhpcyBtZWFucyB0aGF0IHRoZSBtYXhpbXVtIGRpc3RhbmNlIHRoZSBmbGF0dGVuZWQgcGF0aCB3aWxsIGRldmlhdGUgZnJvbSB0aGUgJ3RydWUnIGFyYyB3aWxsIGJlIG5vIG1vcmVcbiAgICogdGhhbiAwLjI1IHVuaXRzIChiZWZvcmUgcm91bmRpbmcpLlxuICAgKlxuICAgKiBSZWR1Y2luZyB0b2xlcmFuY2VzIGJlbG93IDAuMjUgd2lsbCBub3QgaW1wcm92ZSBzbW9vdGhuZXNzIHNpbmNlIHZlcnRleCBjb29yZGluYXRlcyB3aWxsIHN0aWxsIGJlIHJvdW5kZWQgdG8gaW50ZWdlciB2YWx1ZXMuIFRoZSBvbmx5IHdheSB0byBhY2hpZXZlXG4gICAqIHN1Yi1pbnRlZ2VyIHByZWNpc2lvbiBpcyB0aHJvdWdoIGNvb3JkaW5hdGUgc2NhbGluZyBiZWZvcmUgYW5kIGFmdGVyIG9mZnNldHRpbmcgKHNlZSBleGFtcGxlIGJlbG93KS5cbiAgICpcbiAgICogSXQncyBpbXBvcnRhbnQgdG8gbWFrZSBBcmNUb2xlcmFuY2UgYSBzZW5zaWJsZSBmcmFjdGlvbiBvZiB0aGUgb2Zmc2V0IGRlbHRhIChhcmMgcmFkaXVzKS4gTGFyZ2UgdG9sZXJhbmNlcyByZWxhdGl2ZSB0byB0aGUgb2Zmc2V0IGRlbHRhIHdpbGwgcHJvZHVjZVxuICAgKiBwb29yIGFyYyBhcHByb3hpbWF0aW9ucyBidXQsIGp1c3QgYXMgaW1wb3J0YW50bHksIHZlcnkgc21hbGwgdG9sZXJhbmNlcyB3aWxsIHN1YnN0YW50aWFsbHkgc2xvdyBvZmZzZXR0aW5nIHBlcmZvcm1hbmNlIHdoaWxlIHByb3ZpZGluZyB1bm5lY2Vzc2FyeVxuICAgKiBkZWdyZWVzIG9mIHByZWNpc2lvbi4gVGhpcyBpcyBtb3N0IGxpa2VseSB0byBiZSBhbiBpc3N1ZSB3aGVuIG9mZnNldHRpbmcgcG9seWdvbnMgd2hvc2UgY29vcmRpbmF0ZXMgaGF2ZSBiZWVuIHNjYWxlZCB0byBwcmVzZXJ2ZSBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24uXG4gICAqXG4gICAqIEV4YW1wbGU6IEltYWdpbmUgYSBzZXQgb2YgcG9seWdvbnMgKGRlZmluZWQgaW4gZmxvYXRpbmcgcG9pbnQgY29vcmRpbmF0ZXMpIHRoYXQgaXMgdG8gYmUgb2Zmc2V0IGJ5IDEwIHVuaXRzIHVzaW5nIHJvdW5kIGpvaW5zLCBhbmQgdGhlIHNvbHV0aW9uIGlzIHRvXG4gICAqIHJldGFpbiBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gdXAgdG8gYXQgbGVhc3QgNiBkZWNpbWFsIHBsYWNlcy5cbiAgICogVG8gcHJlc2VydmUgdGhpcyBkZWdyZWUgb2YgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uLCBhbmQgZ2l2ZW4gdGhhdCBDbGlwcGVyIGFuZCBDbGlwcGVyT2Zmc2V0IGJvdGggb3BlcmF0ZSBvbiBpbnRlZ2VyIGNvb3JkaW5hdGVzLCB0aGUgcG9seWdvblxuICAgKiBjb29yZGluYXRlcyB3aWxsIGJlIHNjYWxlZCB1cCBieSAxMDggKGFuZCByb3VuZGVkIHRvIGludGVnZXJzKSBwcmlvciB0byBvZmZzZXR0aW5nLiBCb3RoIG9mZnNldCBkZWx0YSBhbmQgQXJjVG9sZXJhbmNlIHdpbGwgYWxzbyBuZWVkIHRvIGJlIHNjYWxlZFxuICAgKiBieSB0aGlzIHNhbWUgZmFjdG9yLiBJZiBBcmNUb2xlcmFuY2Ugd2FzIGxlZnQgdW5zY2FsZWQgYXQgdGhlIGRlZmF1bHQgMC4yNSB1bml0cywgZXZlcnkgYXJjIGluIHRoZSBzb2x1dGlvbiB3b3VsZCBjb250YWluIGEgZnJhY3Rpb24gb2YgNDQgVEhPVVNBTkRcbiAgICogdmVydGljZXMgd2hpbGUgdGhlIGZpbmFsIGFyYyBpbXByZWNpc2lvbiB3b3VsZCBiZSAwLjI1IMOXIDEwLTggdW5pdHMgKGllIG9uY2Ugc2NhbGluZyB3YXMgcmV2ZXJzZWQpLiBIb3dldmVyLCBpZiAwLjEgdW5pdHMgd2FzIGFuIGFjY2VwdGFibGUgaW1wcmVjaXNpb25cbiAgICogaW4gdGhlIGZpbmFsIHVuc2NhbGVkIHNvbHV0aW9uLCB0aGVuIEFyY1RvbGVyYW5jZSBzaG91bGQgYmUgc2V0IHRvIDAuMSDDlyBzY2FsaW5nX2ZhY3RvciAoMC4xIMOXIDEwOCApLiBOb3cgaWYgc2NhbGluZyBpcyBhcHBsaWVkIGVxdWFsbHkgdG8gYm90aFxuICAgKiBBcmNUb2xlcmFuY2UgYW5kIHRvIERlbHRhIE9mZnNldCwgdGhlbiBpbiB0aGlzIGV4YW1wbGUgdGhlIG51bWJlciBvZiB2ZXJ0aWNlcyAoc3RlcHMpIGRlZmluaW5nIGVhY2ggYXJjIHdvdWxkIGJlIGEgZnJhY3Rpb24gb2YgMjMuXG4gICAqXG4gICAqIFRoZSBmb3JtdWxhIGZvciB0aGUgbnVtYmVyIG9mIHN0ZXBzIGluIGEgZnVsbCBjaXJjdWxhciBhcmMgaXMgLi4uIFBpIC8gYWNvcygxIC0gYXJjX3RvbGVyYW5jZSAvIGFicyhkZWx0YSkpXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIEFyYyB0b2xlcmFuY2UgdG8gc2V0LlxuICAgKi9cbiAgc2V0IGFyY1RvbGVyYW5jZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY2xpcHBlck9mZnNldCEuYXJjVG9sZXJhbmNlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBwcm9wZXJ0eSBzZXRzIHRoZSBtYXhpbXVtIGRpc3RhbmNlIGluIG11bHRpcGxlcyBvZiBkZWx0YSB0aGF0IHZlcnRpY2VzIGNhbiBiZSBvZmZzZXQgZnJvbSB0aGVpciBvcmlnaW5hbCBwb3NpdGlvbnMgYmVmb3JlIHNxdWFyaW5nIGlzIGFwcGxpZWQuXG4gICAqIChTcXVhcmluZyB0cnVuY2F0ZXMgYSBtaXRlciBieSAnY3V0dGluZyBpdCBvZmYnIGF0IDEgw5cgZGVsdGEgZGlzdGFuY2UgZnJvbSB0aGUgb3JpZ2luYWwgdmVydGV4LilcbiAgICpcbiAgICogVGhlIGRlZmF1bHQgdmFsdWUgZm9yIE1pdGVyTGltaXQgaXMgMiAoaWUgdHdpY2UgZGVsdGEpLiBUaGlzIGlzIGFsc28gdGhlIHNtYWxsZXN0IE1pdGVyTGltaXQgdGhhdCdzIGFsbG93ZWQuIElmIG1pdGVyaW5nIHdhcyB1bnJlc3RyaWN0ZWQgKGllIHdpdGhvdXRcbiAgICogYW55IHNxdWFyaW5nKSwgdGhlbiBvZmZzZXRzIGF0IHZlcnkgYWN1dGUgYW5nbGVzIHdvdWxkIGdlbmVyYXRlIHVuYWNjZXB0YWJseSBsb25nICdzcGlrZXMnLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gQ3VycmVudCBtaXRlciBsaW1pdFxuICAgKi9cbiAgZ2V0IG1pdGVyTGltaXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY2xpcHBlck9mZnNldCEubWl0ZXJMaW1pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjdXJyZW50IG1pdGVyIGxpbWl0IChzZWUgZ2V0dGVyIGRvY3MgZm9yIG1vcmUgaW5mbykuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIE1pdCBsaW1pdCB0byBzZXQuXG4gICAqL1xuICBzZXQgbWl0ZXJMaW1pdCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY2xpcHBlck9mZnNldCEubWl0ZXJMaW1pdCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBDbGlwcGVyT2Zmc2V0IGNvbnN0cnVjdG9yIHRha2VzIDIgb3B0aW9uYWwgcGFyYW1ldGVyczogTWl0ZXJMaW1pdCBhbmQgQXJjVG9sZXJhbmNlLiBUaGUgdHdvIHBhcmFtZXRlcnMgY29ycmVzcG9uZHMgdG8gcHJvcGVydGllcyBvZiB0aGUgc2FtZSBuYW1lLlxuICAgKiBNaXRlckxpbWl0IGlzIG9ubHkgcmVsZXZhbnQgd2hlbiBKb2luVHlwZSBpcyBNaXRlciwgYW5kIEFyY1RvbGVyYW5jZSBpcyBvbmx5IHJlbGV2YW50IHdoZW4gSm9pblR5cGUgaXMgUm91bmQgb3Igd2hlbiBFbmRUeXBlIGlzIE9wZW5Sb3VuZC5cbiAgICpcbiAgICogQHBhcmFtIF9uYXRpdmVMaWIgLSBOYXRpdmUgY2xpcHBlciBsaWIgaW5zdGFuY2UgdG8gdXNlXG4gICAqIEBwYXJhbSBtaXRlckxpbWl0IC0gTWl0ZXIgbGltaXRcbiAgICogQHBhcmFtIGFyY1RvbGVyYW5jZSAtIEFyY1RvbGVyYW5jZSAocm91bmQgcHJlY2lzaW9uKVxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gICAgbWl0ZXJMaW1pdCA9IDIsXG4gICAgYXJjVG9sZXJhbmNlID0gMC4yNVxuICApIHtcbiAgICB0aGlzLl9jbGlwcGVyT2Zmc2V0ID0gbmV3IF9uYXRpdmVMaWIuQ2xpcHBlck9mZnNldChtaXRlckxpbWl0LCBhcmNUb2xlcmFuY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBQYXRoIHRvIGEgQ2xpcHBlck9mZnNldCBvYmplY3QgaW4gcHJlcGFyYXRpb24gZm9yIG9mZnNldHRpbmcuXG4gICAqXG4gICAqIEFueSBudW1iZXIgb2YgcGF0aHMgY2FuIGJlIGFkZGVkLCBhbmQgZWFjaCBoYXMgaXRzIG93biBKb2luVHlwZSBhbmQgRW5kVHlwZS4gQWxsICdvdXRlcicgUGF0aHMgbXVzdCBoYXZlIHRoZSBzYW1lIG9yaWVudGF0aW9uLCBhbmQgYW55ICdob2xlJyBwYXRocyBtdXN0XG4gICAqIGhhdmUgcmV2ZXJzZSBvcmllbnRhdGlvbi4gQ2xvc2VkIHBhdGhzIG11c3QgaGF2ZSBhdCBsZWFzdCAzIHZlcnRpY2VzLiBPcGVuIHBhdGhzIG1heSBoYXZlIGFzIGZldyBhcyBvbmUgdmVydGV4LiBPcGVuIHBhdGhzIGNhbiBvbmx5IGJlIG9mZnNldFxuICAgKiB3aXRoIHBvc2l0aXZlIGRlbHRhcy5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggLSBQYXRoIHRvIGFkZFxuICAgKiBAcGFyYW0gam9pblR5cGUgLSBKb2luIHR5cGVcbiAgICogQHBhcmFtIGVuZFR5cGUgLSBFbmQgdHlwZVxuICAgKi9cbiAgYWRkUGF0aChwYXRoOiBSZWFkb25seVBhdGgsIGpvaW5UeXBlOiBKb2luVHlwZSwgZW5kVHlwZTogRW5kVHlwZSkge1xuICAgIGNvbnN0IG5hdGl2ZVBhdGggPSBwYXRoVG9OYXRpdmVQYXRoKHRoaXMuX25hdGl2ZUxpYiwgcGF0aCk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NsaXBwZXJPZmZzZXQhLmFkZFBhdGgoXG4gICAgICAgIG5hdGl2ZVBhdGgsXG4gICAgICAgIGpvaW5UeXBlVG9OYXRpdmUodGhpcy5fbmF0aXZlTGliLCBqb2luVHlwZSksXG4gICAgICAgIGVuZFR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIGVuZFR5cGUpXG4gICAgICApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBuYXRpdmVQYXRoLmRlbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIFBhdGhzIHRvIGEgQ2xpcHBlck9mZnNldCBvYmplY3QgaW4gcHJlcGFyYXRpb24gZm9yIG9mZnNldHRpbmcuXG4gICAqXG4gICAqIEFueSBudW1iZXIgb2YgcGF0aHMgY2FuIGJlIGFkZGVkLCBhbmQgZWFjaCBwYXRoIGhhcyBpdHMgb3duIEpvaW5UeXBlIGFuZCBFbmRUeXBlLiBBbGwgJ291dGVyJyBQYXRocyBtdXN0IGhhdmUgdGhlIHNhbWUgb3JpZW50YXRpb24sIGFuZCBhbnkgJ2hvbGUnXG4gICAqIHBhdGhzIG11c3QgaGF2ZSByZXZlcnNlIG9yaWVudGF0aW9uLiBDbG9zZWQgcGF0aHMgbXVzdCBoYXZlIGF0IGxlYXN0IDMgdmVydGljZXMuIE9wZW4gcGF0aHMgbWF5IGhhdmUgYXMgZmV3IGFzIG9uZSB2ZXJ0ZXguIE9wZW4gcGF0aHMgY2FuIG9ubHkgYmVcbiAgICogb2Zmc2V0IHdpdGggcG9zaXRpdmUgZGVsdGFzLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aHMgLSBQYXRocyB0byBhZGRcbiAgICogQHBhcmFtIGpvaW5UeXBlIC0gSm9pbiB0eXBlXG4gICAqIEBwYXJhbSBlbmRUeXBlIC0gRW5kIHR5cGVcbiAgICovXG4gIGFkZFBhdGhzKHBhdGhzOiBSZWFkb25seVBhdGhzLCBqb2luVHlwZTogSm9pblR5cGUsIGVuZFR5cGU6IEVuZFR5cGUpIHtcbiAgICBjb25zdCBuYXRpdmVQYXRocyA9IHBhdGhzVG9OYXRpdmVQYXRocyh0aGlzLl9uYXRpdmVMaWIsIHBhdGhzKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY2xpcHBlck9mZnNldCEuYWRkUGF0aHMoXG4gICAgICAgIG5hdGl2ZVBhdGhzLFxuICAgICAgICBqb2luVHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgam9pblR5cGUpLFxuICAgICAgICBlbmRUeXBlVG9OYXRpdmUodGhpcy5fbmF0aXZlTGliLCBlbmRUeXBlKVxuICAgICAgKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgbmF0aXZlUGF0aHMuZGVsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5lZ2F0aXZlIGRlbHRhIHZhbHVlcyBzaHJpbmsgcG9seWdvbnMgYW5kIHBvc2l0aXZlIGRlbHRhIGV4cGFuZCB0aGVtLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzLCBvZmZzZXR0aW5nIHRoZSBzYW1lIHBhdGhzIGJ5IGRpZmZlcmVudCBhbW91bnRzIChpZSB1c2luZyBkaWZmZXJlbnQgZGVsdGFzKS5cbiAgICpcbiAgICogQHBhcmFtIGRlbHRhIC0gRGVsdGFcbiAgICogQHBhcmFtIGNsZWFuRGlzdGFuY2UgLSBDbGVhbiBkaXN0YW5jZSBvdmVyIHRoZSBvdXRwdXQsIG9yIHVuZGVmaW5lZCBmb3Igbm8gY2xlYW5pbmcuXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIFNvbHV0aW9uIHBhdGhzXG4gICAqL1xuICBleGVjdXRlVG9QYXRocyhkZWx0YTogbnVtYmVyLCBjbGVhbkRpc3RhbmNlOiBudW1iZXIgfCB1bmRlZmluZWQpOiBQYXRocyB7XG4gICAgY29uc3Qgb3V0TmF0aXZlUGF0aHMgPSBuZXcgdGhpcy5fbmF0aXZlTGliLlBhdGhzKCk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NsaXBwZXJPZmZzZXQhLmV4ZWN1dGVQYXRocyhvdXROYXRpdmVQYXRocywgZGVsdGEpO1xuICAgICAgaWYgKGNsZWFuRGlzdGFuY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9uYXRpdmVMaWIuY2xlYW5Qb2x5Z29ucyhvdXROYXRpdmVQYXRocywgY2xlYW5EaXN0YW5jZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmF0aXZlUGF0aHNUb1BhdGhzKHRoaXMuX25hdGl2ZUxpYiwgb3V0TmF0aXZlUGF0aHMsIHRydWUpOyAvLyBmcmVlcyBvdXROYXRpdmVQYXRoc1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoIW91dE5hdGl2ZVBhdGhzLmlzRGVsZXRlZCgpKSB7XG4gICAgICAgIG91dE5hdGl2ZVBhdGhzLmRlbGV0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyB0d28gcGFyYW1ldGVycy4gVGhlIGZpcnN0IGlzIHRoZSBzdHJ1Y3R1cmUgdGhhdCByZWNlaXZlcyB0aGUgcmVzdWx0IG9mIHRoZSBvZmZzZXQgb3BlcmF0aW9uIChhIFBvbHlUcmVlIHN0cnVjdHVyZSkuIFRoZSBzZWNvbmQgcGFyYW1ldGVyXG4gICAqIGlzIHRoZSBhbW91bnQgdG8gd2hpY2ggdGhlIHN1cHBsaWVkIHBhdGhzIHdpbGwgYmUgb2Zmc2V0LiBOZWdhdGl2ZSBkZWx0YSB2YWx1ZXMgc2hyaW5rIHBvbHlnb25zIGFuZCBwb3NpdGl2ZSBkZWx0YSBleHBhbmQgdGhlbS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcywgb2Zmc2V0dGluZyB0aGUgc2FtZSBwYXRocyBieSBkaWZmZXJlbnQgYW1vdW50cyAoaWUgdXNpbmcgZGlmZmVyZW50IGRlbHRhcykuXG4gICAqXG4gICAqIEBwYXJhbSBkZWx0YSAtIERlbHRhXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIFNvbHV0aW9uIHBhdGhzXG4gICAqL1xuICBleGVjdXRlVG9Qb2x5VHJlZShkZWx0YTogbnVtYmVyKTogUG9seVRyZWUge1xuICAgIGNvbnN0IG91dE5hdGl2ZVBvbHlUcmVlID0gbmV3IHRoaXMuX25hdGl2ZUxpYi5Qb2x5VHJlZSgpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jbGlwcGVyT2Zmc2V0IS5leGVjdXRlUG9seVRyZWUob3V0TmF0aXZlUG9seVRyZWUsIGRlbHRhKTtcbiAgICAgIHJldHVybiBQb2x5VHJlZS5mcm9tTmF0aXZlUG9seVRyZWUodGhpcy5fbmF0aXZlTGliLCBvdXROYXRpdmVQb2x5VHJlZSwgdHJ1ZSk7IC8vIGZyZWVzIG91dE5hdGl2ZVBvbHlUcmVlXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICghb3V0TmF0aXZlUG9seVRyZWUuaXNEZWxldGVkKCkpIHtcbiAgICAgICAgb3V0TmF0aXZlUG9seVRyZWUuZGVsZXRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNsZWFycyBhbGwgcGF0aHMgZnJvbSB0aGUgQ2xpcHBlck9mZnNldCBvYmplY3QsIGFsbG93aW5nIG5ldyBwYXRocyB0byBiZSBhc3NpZ25lZC5cbiAgICovXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuX2NsaXBwZXJPZmZzZXQhLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBvYmplY3QgaGFzIGJlZW4gZGlzcG9zZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gdHJ1ZSBpZiBkaXNwb3NlZCwgZmFsc2UgaWYgbm90XG4gICAqL1xuICBpc0Rpc3Bvc2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jbGlwcGVyT2Zmc2V0ID09PSB1bmRlZmluZWQgfHwgdGhpcy5fY2xpcHBlck9mZnNldC5pc0RlbGV0ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaW5jZSB0aGlzIGxpYnJhcnkgdXNlcyBXQVNNL0FTTS5KUyBpbnRlcm5hbGx5IGZvciBzcGVlZCB0aGlzIG1lYW5zIHRoYXQgeW91IG11c3QgZGlzcG9zZSBvYmplY3RzIGFmdGVyIHlvdSBhcmUgZG9uZSB1c2luZyB0aGVtIG9yIG1lbSBsZWFrcyB3aWxsIG9jY3VyLlxuICAgKi9cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2xpcHBlck9mZnNldCkge1xuICAgICAgdGhpcy5fY2xpcHBlck9mZnNldC5kZWxldGUoKTtcbiAgICAgIHRoaXMuX2NsaXBwZXJPZmZzZXQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXX0=