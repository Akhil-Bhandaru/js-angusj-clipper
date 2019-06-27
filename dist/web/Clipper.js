"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var nativeEnumConversion_1 = require("./native/nativeEnumConversion");
var PathsToNativePaths_1 = require("./native/PathsToNativePaths");
var PathToNativePath_1 = require("./native/PathToNativePath");
var PolyTree_1 = require("./PolyTree");
var Clipper = /** @class */ (function () {
    /**
     * The Clipper constructor creates an instance of the Clipper class. One or more InitOptions may be passed as a parameter to set the corresponding properties.
     * (These properties can still be set or reset after construction.)
     *
     * @param _nativeLib
     * @param initOptions
     */
    function Clipper(_nativeLib, initOptions) {
        if (initOptions === void 0) { initOptions = {}; }
        this._nativeLib = _nativeLib;
        var realInitOptions = __assign({ reverseSolutions: false, strictlySimple: false, preserveCollinear: false }, initOptions);
        var nativeInitOptions = 0;
        if (realInitOptions.reverseSolutions) {
            nativeInitOptions += _nativeLib.InitOptions.ReverseSolution;
        }
        if (realInitOptions.strictlySimple) {
            nativeInitOptions += _nativeLib.InitOptions.StrictlySimple;
        }
        if (realInitOptions.preserveCollinear) {
            nativeInitOptions += _nativeLib.InitOptions.PreserveCollinear;
        }
        this._clipper = new _nativeLib.Clipper(nativeInitOptions);
    }
    Object.defineProperty(Clipper.prototype, "preserveCollinear", {
        /**
         * By default, when three or more vertices are collinear in input polygons (subject or clip), the Clipper object removes the 'inner' vertices before
         * clipping. When enabled the preserveCollinear property prevents this default behavior to allow these inner vertices to appear in the solution.
         *
         * @return {boolean} - true if set, false otherwise
         */
        get: function () {
            return this._clipper.preserveCollinear;
        },
        /**
         * By default, when three or more vertices are collinear in input polygons (subject or clip), the Clipper object removes the 'inner' vertices before
         * clipping. When enabled the preserveCollinear property prevents this default behavior to allow these inner vertices to appear in the solution.
         *
         * @param value - value to set
         */
        set: function (value) {
            this._clipper.preserveCollinear = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Clipper.prototype, "reverseSolution", {
        /**
         * When this property is set to true, polygons returned in the solution parameter of the execute() method will have orientations opposite to their normal
         * orientations.
         *
         * @return {boolean} - true if set, false otherwise
         */
        get: function () {
            return this._clipper.reverseSolution;
        },
        /**
         * When this property is set to true, polygons returned in the solution parameter of the execute() method will have orientations opposite to their normal
         * orientations.
         *
         * @param value - value to set
         */
        set: function (value) {
            this._clipper.reverseSolution = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Clipper.prototype, "strictlySimple", {
        /**
         * Terminology:
         * - A simple polygon is one that does not self-intersect.
         * - A weakly simple polygon is a simple polygon that contains 'touching' vertices, or 'touching' edges.
         * - A strictly simple polygon is a simple polygon that does not contain 'touching' vertices, or 'touching' edges.
         *
         * Vertices 'touch' if they share the same coordinates (and are not adjacent). An edge touches another if one of its end vertices touches another edge
         * excluding its adjacent edges, or if they are co-linear and overlapping (including adjacent edges).
         *
         * Polygons returned by clipping operations (see Clipper.execute()) should always be simple polygons. When the StrictlySimply property is enabled,
         * polygons returned will be strictly simple, otherwise they may be weakly simple. It's computationally expensive ensuring polygons are strictly simple
         * and so this property is disabled by default.
         *
         * Note: There's currently no guarantee that polygons will be strictly simple since 'simplifying' is still a work in progress.
         *
         * @return {boolean} - true if set, false otherwise
         */
        get: function () {
            return this._clipper.strictlySimple;
        },
        /**
         * Terminology:
         * - A simple polygon is one that does not self-intersect.
         * - A weakly simple polygon is a simple polygon that contains 'touching' vertices, or 'touching' edges.
         * - A strictly simple polygon is a simple polygon that does not contain 'touching' vertices, or 'touching' edges.
         *
         * Vertices 'touch' if they share the same coordinates (and are not adjacent). An edge touches another if one of its end vertices touches another edge
         * excluding its adjacent edges, or if they are co-linear and overlapping (including adjacent edges).
         *
         * Polygons returned by clipping operations (see Clipper.execute()) should always be simple polygons. When the StrictlySimply property is enabled,
         * polygons returned will be strictly simple, otherwise they may be weakly simple. It's computationally expensive ensuring polygons are strictly simple
         * and so this property is disabled by default.
         *
         * Note: There's currently no guarantee that polygons will be strictly simple since 'simplifying' is still a work in progress.
         *
         * @param value - value to set
         */
        set: function (value) {
            this._clipper.strictlySimple = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Any number of subject and clip paths can be added to a clipping task, either individually via the addPath() method, or as groups via the addPaths()
     * method, or even using both methods.
     *
     * 'Subject' paths may be either open (lines) or closed (polygons) or even a mixture of both, but 'clipping' paths must always be closed. Clipper allows
     * polygons to clip both lines and other polygons, but doesn't allow lines to clip either lines or polygons.
     *
     * With closed paths, orientation should conform with the filling rule that will be passed via Clipper's execute method.
     *
     * Path Coordinate range:
     * Path coordinates must be between ± 9007199254740991, otherwise a range error will be thrown when attempting to add the path to the Clipper object.
     * If coordinates can be kept between ± 0x3FFFFFFF (± 1.0e+9), a modest increase in performance (approx. 15-20%) over the larger range can be achieved by
     * avoiding large integer math.
     *
     * Return Value:
     * The function will return false if the path is invalid for clipping. A path is invalid for clipping when:
     * - it has less than 2 vertices
     * - it has 2 vertices but is not an open path
     * - the vertices are all co-linear and it is not an open path
     *
     * @param path - Path to add
     * @param polyType - Polygon type
     * @param closed - If the path is closed
     */
    Clipper.prototype.addPath = function (path, polyType, closed) {
        var nativePath = PathToNativePath_1.pathToNativePath(this._nativeLib, path);
        try {
            return this._clipper.addPath(nativePath, nativeEnumConversion_1.polyTypeToNative(this._nativeLib, polyType), closed);
        }
        finally {
            nativePath.delete();
        }
    };
    /**
     * Any number of subject and clip paths can be added to a clipping task, either individually via the addPath() method, or as groups via the addPaths()
     * method, or even using both methods.
     *
     * 'Subject' paths may be either open (lines) or closed (polygons) or even a mixture of both, but 'clipping' paths must always be closed. Clipper allows
     * polygons to clip both lines and other polygons, but doesn't allow lines to clip either lines or polygons.
     *
     * With closed paths, orientation should conform with the filling rule that will be passed via Clipper's execute method.
     *
     * Path Coordinate range:
     * Path coordinates must be between ± 9007199254740991, otherwise a range error will be thrown when attempting to add the path to the Clipper object.
     * If coordinates can be kept between ± 0x3FFFFFFF (± 1.0e+9), a modest increase in performance (approx. 15-20%) over the larger range can be achieved
     * by avoiding large integer math.
     *
     * Return Value:
     * The function will return false if the path is invalid for clipping. A path is invalid for clipping when:
     * - it has less than 2 vertices
     * - it has 2 vertices but is not an open path
     * - the vertices are all co-linear and it is not an open path
     *
     * @param paths - Paths to add
     * @param polyType - Paths polygon type
     * @param closed - If all the inner paths are closed
     */
    Clipper.prototype.addPaths = function (paths, polyType, closed) {
        var nativePaths = PathsToNativePaths_1.pathsToNativePaths(this._nativeLib, paths);
        try {
            return this._clipper.addPaths(nativePaths, nativeEnumConversion_1.polyTypeToNative(this._nativeLib, polyType), closed);
        }
        finally {
            nativePaths.delete();
        }
    };
    /**
     * The Clear method removes any existing subject and clip polygons allowing the Clipper object to be reused for clipping operations on different polygon sets.
     */
    Clipper.prototype.clear = function () {
        this._clipper.clear();
    };
    /**
     * This method returns the axis-aligned bounding rectangle of all polygons that have been added to the Clipper object.
     *
     * @return {{left: number, right: number, top: number, bottom: number}} - Bounds
     */
    Clipper.prototype.getBounds = function () {
        var nativeBounds = this._clipper.getBounds();
        var rect = {
            left: nativeBounds.left,
            right: nativeBounds.right,
            top: nativeBounds.top,
            bottom: nativeBounds.bottom
        };
        nativeBounds.delete();
        return rect;
    };
    /**
     * Once subject and clip paths have been assigned (via addPath and/or addPaths), execute can then perform the clipping operation (intersection, union,
     * difference or XOR) specified by the clipType parameter.
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
     * The subjFillType and clipFillType parameters define the polygon fill rule to be applied to the polygons (ie closed paths) in the subject and clip
     * paths respectively. (It's usual though obviously not essential that both sets of polygons use the same fill rule.)
     *
     * execute can be called multiple times without reassigning subject and clip polygons (ie when different clipping operations are required on the
     * same polygon sets).
     *
     * @param clipType - Clip operation type
     * @param subjFillType - Fill type of the subject polygons
     * @param clipFillType - Fill type of the clip polygons
     * @param cleanDistance - Clean distance over the output, or undefined for no cleaning.
     * @return {Paths | undefined} - The solution or undefined if there was an error
     */
    Clipper.prototype.executeToPaths = function (clipType, subjFillType, clipFillType, cleanDistance) {
        var outNativePaths = new this._nativeLib.Paths();
        try {
            var success = this._clipper.executePathsWithFillTypes(nativeEnumConversion_1.clipTypeToNative(this._nativeLib, clipType), outNativePaths, nativeEnumConversion_1.polyFillTypeToNative(this._nativeLib, subjFillType), nativeEnumConversion_1.polyFillTypeToNative(this._nativeLib, clipFillType));
            if (!success) {
                return undefined;
            }
            else {
                if (cleanDistance !== undefined) {
                    this._nativeLib.cleanPolygons(outNativePaths, cleanDistance);
                }
                return PathsToNativePaths_1.nativePathsToPaths(this._nativeLib, outNativePaths, true); // frees outNativePaths
            }
        }
        finally {
            if (!outNativePaths.isDeleted()) {
                outNativePaths.delete();
            }
        }
    };
    /**
     * Once subject and clip paths have been assigned (via addPath and/or addPaths), execute can then perform the clipping operation (intersection, union,
     * difference or XOR) specified by the clipType parameter.
     *
     * The solution parameter can be either a Paths or PolyTree structure. The Paths structure is simpler than the PolyTree structure. Because of this it is
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
     * The subjFillType and clipFillType parameters define the polygon fill rule to be applied to the polygons (ie closed paths) in the subject and clip
     * paths respectively. (It's usual though obviously not essential that both sets of polygons use the same fill rule.)
     *
     * execute can be called multiple times without reassigning subject and clip polygons (ie when different clipping operations are required on the
     * same polygon sets).
     *
     * @param clipType - Clip operation type
     * @param subjFillType - Fill type of the subject polygons
     * @param clipFillType - Fill type of the clip polygons
     * @return {PolyTree | undefined} - The solution or undefined if there was an error
     */
    Clipper.prototype.executeToPolyTee = function (clipType, subjFillType, clipFillType) {
        var outNativePolyTree = new this._nativeLib.PolyTree();
        try {
            var success = this._clipper.executePolyTreeWithFillTypes(nativeEnumConversion_1.clipTypeToNative(this._nativeLib, clipType), outNativePolyTree, nativeEnumConversion_1.polyFillTypeToNative(this._nativeLib, subjFillType), nativeEnumConversion_1.polyFillTypeToNative(this._nativeLib, clipFillType));
            if (!success) {
                return undefined;
            }
            else {
                return PolyTree_1.PolyTree.fromNativePolyTree(this._nativeLib, outNativePolyTree, true); // frees outNativePolyTree
            }
        }
        finally {
            if (!outNativePolyTree.isDeleted()) {
                outNativePolyTree.delete();
            }
        }
    };
    /**
     * Checks if the object has been disposed.
     *
     * @return {boolean} - true if disposed, false if not
     */
    Clipper.prototype.isDisposed = function () {
        return this._clipper === undefined || this._clipper.isDeleted();
    };
    /**
     * Since this library uses WASM/ASM.JS internally for speed this means that you must dispose objects after you are done using them or mem leaks will occur.
     */
    Clipper.prototype.dispose = function () {
        if (this._clipper) {
            this._clipper.delete();
            this._clipper = undefined;
        }
    };
    return Clipper;
}());
exports.Clipper = Clipper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9DbGlwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFJQSxzRUFJdUM7QUFDdkMsa0VBQXFGO0FBQ3JGLDhEQUE2RDtBQUc3RCx1Q0FBc0M7QUFzQnRDO0lBcUZFOzs7Ozs7T0FNRztJQUNILGlCQUNtQixVQUFvQyxFQUNyRCxXQUFvQztRQUFwQyw0QkFBQSxFQUFBLGdCQUFvQztRQURuQixlQUFVLEdBQVYsVUFBVSxDQUEwQjtRQUdyRCxJQUFNLGVBQWUsY0FDbkIsZ0JBQWdCLEVBQUUsS0FBSyxFQUN2QixjQUFjLEVBQUUsS0FBSyxFQUNyQixpQkFBaUIsRUFBRSxLQUFLLElBQ3JCLFdBQVcsQ0FDZixDQUFDO1FBRUYsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7WUFDcEMsaUJBQWlCLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUF5QixDQUFDO1NBQ3ZFO1FBQ0QsSUFBSSxlQUFlLENBQUMsY0FBYyxFQUFFO1lBQ2xDLGlCQUFpQixJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsY0FBd0IsQ0FBQztTQUN0RTtRQUNELElBQUksZUFBZSxDQUFDLGlCQUFpQixFQUFFO1lBQ3JDLGlCQUFpQixJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsaUJBQTJCLENBQUM7U0FDekU7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUExR0Qsc0JBQUksc0NBQWlCO1FBTnJCOzs7OztXQUtHO2FBQ0g7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFTLENBQUMsaUJBQWlCLENBQUM7UUFDMUMsQ0FBQztRQUVEOzs7OztXQUtHO2FBQ0gsVUFBc0IsS0FBYztZQUNsQyxJQUFJLENBQUMsUUFBUyxDQUFDLGlCQUFp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QUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsMEJBQTBCO2FBQ3pHO1NBQ0Y7Z0JBQVM7WUFDUixJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQ2xDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzVCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDRCQUFVLEdBQVY7UUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEUsQ0FBQztJQUVEOztPQUVHO0lBQ0gseUJBQU8sR0FBUDtRQUNFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBcFdELElBb1dDO0FBcFdZLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xpcFR5cGUsIFBvbHlGaWxsVHlwZSwgUG9seVR5cGUgfSBmcm9tIFwiLi9lbnVtc1wiO1xuaW1wb3J0IHsgSW50UmVjdCB9IGZyb20gXCIuL0ludFJlY3RcIjtcbmltcG9ydCB7IE5hdGl2ZUNsaXBwZXIgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlclwiO1xuaW1wb3J0IHsgTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZVwiO1xuaW1wb3J0IHtcbiAgY2xpcFR5cGVUb05hdGl2ZSxcbiAgcG9seUZpbGxUeXBlVG9OYXRpdmUsXG4gIHBvbHlUeXBlVG9OYXRpdmVcbn0gZnJvbSBcIi4vbmF0aXZlL25hdGl2ZUVudW1Db252ZXJzaW9uXCI7XG5pbXBvcnQgeyBuYXRpdmVQYXRoc1RvUGF0aHMsIHBhdGhzVG9OYXRpdmVQYXRocyB9IGZyb20gXCIuL25hdGl2ZS9QYXRoc1RvTmF0aXZlUGF0aHNcIjtcbmltcG9ydCB7IHBhdGhUb05hdGl2ZVBhdGggfSBmcm9tIFwiLi9uYXRpdmUvUGF0aFRvTmF0aXZlUGF0aFwiO1xuaW1wb3J0IHsgUGF0aCwgUmVhZG9ubHlQYXRoIH0gZnJvbSBcIi4vUGF0aFwiO1xuaW1wb3J0IHsgUGF0aHMsIFJlYWRvbmx5UGF0aHMgfSBmcm9tIFwiLi9QYXRoc1wiO1xuaW1wb3J0IHsgUG9seVRyZWUgfSBmcm9tIFwiLi9Qb2x5VHJlZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsaXBwZXJJbml0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGVuIHRoaXMgcHJvcGVydHkgaXMgc2V0IHRvIHRydWUsIHBvbHlnb25zIHJldHVybmVkIGluIHRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIgb2YgdGhlIGV4ZWN1dGUoKSBtZXRob2Qgd2lsbCBoYXZlIG9yaWVudGF0aW9ucyBvcHBvc2l0ZSB0byB0aGVpciBub3JtYWxcbiAgICogb3JpZW50YXRpb25zLlxuICAgKi9cbiAgcmV2ZXJzZVNvbHV0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hlbiB0aGlzIHByb3BlcnR5IGlzIHNldCB0byB0cnVlLCBwb2x5Z29ucyByZXR1cm5lZCBpbiB0aGUgc29sdXRpb24gcGFyYW1ldGVyIG9mIHRoZSBleGVjdXRlKCkgbWV0aG9kIHdpbGwgaGF2ZSBvcmllbnRhdGlvbnMgb3Bwb3NpdGUgdG8gdGhlaXIgbm9ybWFsXG4gICAqIG9yaWVudGF0aW9ucy5cbiAgICovXG4gIHN0cmljdGx5U2ltcGxlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQnkgZGVmYXVsdCwgd2hlbiB0aHJlZSBvciBtb3JlIHZlcnRpY2VzIGFyZSBjb2xsaW5lYXIgaW4gaW5wdXQgcG9seWdvbnMgKHN1YmplY3Qgb3IgY2xpcCksIHRoZSBDbGlwcGVyIG9iamVjdCByZW1vdmVzIHRoZSAnaW5uZXInIHZlcnRpY2VzIGJlZm9yZVxuICAgKiBjbGlwcGluZy4gV2hlbiBlbmFibGVkIHRoZSBwcmVzZXJ2ZUNvbGxpbmVhciBwcm9wZXJ0eSBwcmV2ZW50cyB0aGlzIGRlZmF1bHQgYmVoYXZpb3IgdG8gYWxsb3cgdGhlc2UgaW5uZXIgdmVydGljZXMgdG8gYXBwZWFyIGluIHRoZSBzb2x1dGlvbi5cbiAgICovXG4gIHByZXNlcnZlQ29sbGluZWFyPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIENsaXBwZXIge1xuICBwcml2YXRlIF9jbGlwcGVyPzogTmF0aXZlQ2xpcHBlcjtcblxuICAvKipcbiAgICogQnkgZGVmYXVsdCwgd2hlbiB0aHJlZSBvciBtb3JlIHZlcnRpY2VzIGFyZSBjb2xsaW5lYXIgaW4gaW5wdXQgcG9seWdvbnMgKHN1YmplY3Qgb3IgY2xpcCksIHRoZSBDbGlwcGVyIG9iamVjdCByZW1vdmVzIHRoZSAnaW5uZXInIHZlcnRpY2VzIGJlZm9yZVxuICAgKiBjbGlwcGluZy4gV2hlbiBlbmFibGVkIHRoZSBwcmVzZXJ2ZUNvbGxpbmVhciBwcm9wZXJ0eSBwcmV2ZW50cyB0aGlzIGRlZmF1bHQgYmVoYXZpb3IgdG8gYWxsb3cgdGhlc2UgaW5uZXIgdmVydGljZXMgdG8gYXBwZWFyIGluIHRoZSBzb2x1dGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gLSB0cnVlIGlmIHNldCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBnZXQgcHJlc2VydmVDb2xsaW5lYXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NsaXBwZXIhLnByZXNlcnZlQ29sbGluZWFyO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIHdoZW4gdGhyZWUgb3IgbW9yZSB2ZXJ0aWNlcyBhcmUgY29sbGluZWFyIGluIGlucHV0IHBvbHlnb25zIChzdWJqZWN0IG9yIGNsaXApLCB0aGUgQ2xpcHBlciBvYmplY3QgcmVtb3ZlcyB0aGUgJ2lubmVyJyB2ZXJ0aWNlcyBiZWZvcmVcbiAgICogY2xpcHBpbmcuIFdoZW4gZW5hYmxlZCB0aGUgcHJlc2VydmVDb2xsaW5lYXIgcHJvcGVydHkgcHJldmVudHMgdGhpcyBkZWZhdWx0IGJlaGF2aW9yIHRvIGFsbG93IHRoZXNlIGlubmVyIHZlcnRpY2VzIHRvIGFwcGVhciBpbiB0aGUgc29sdXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIHZhbHVlIHRvIHNldFxuICAgKi9cbiAgc2V0IHByZXNlcnZlQ29sbGluZWFyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2xpcHBlciEucHJlc2VydmVDb2xsaW5lYXIgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoaXMgcHJvcGVydHkgaXMgc2V0IHRvIHRydWUsIHBvbHlnb25zIHJldHVybmVkIGluIHRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIgb2YgdGhlIGV4ZWN1dGUoKSBtZXRob2Qgd2lsbCBoYXZlIG9yaWVudGF0aW9ucyBvcHBvc2l0ZSB0byB0aGVpciBub3JtYWxcbiAgICogb3JpZW50YXRpb25zLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSAtIHRydWUgaWYgc2V0LCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIGdldCByZXZlcnNlU29sdXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NsaXBwZXIhLnJldmVyc2VTb2x1dGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoaXMgcHJvcGVydHkgaXMgc2V0IHRvIHRydWUsIHBvbHlnb25zIHJldHVybmVkIGluIHRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIgb2YgdGhlIGV4ZWN1dGUoKSBtZXRob2Qgd2lsbCBoYXZlIG9yaWVudGF0aW9ucyBvcHBvc2l0ZSB0byB0aGVpciBub3JtYWxcbiAgICogb3JpZW50YXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgLSB2YWx1ZSB0byBzZXRcbiAgICovXG4gIHNldCByZXZlcnNlU29sdXRpb24odmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jbGlwcGVyIS5yZXZlcnNlU29sdXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXJtaW5vbG9neTpcbiAgICogLSBBIHNpbXBsZSBwb2x5Z29uIGlzIG9uZSB0aGF0IGRvZXMgbm90IHNlbGYtaW50ZXJzZWN0LlxuICAgKiAtIEEgd2Vha2x5IHNpbXBsZSBwb2x5Z29uIGlzIGEgc2ltcGxlIHBvbHlnb24gdGhhdCBjb250YWlucyAndG91Y2hpbmcnIHZlcnRpY2VzLCBvciAndG91Y2hpbmcnIGVkZ2VzLlxuICAgKiAtIEEgc3RyaWN0bHkgc2ltcGxlIHBvbHlnb24gaXMgYSBzaW1wbGUgcG9seWdvbiB0aGF0IGRvZXMgbm90IGNvbnRhaW4gJ3RvdWNoaW5nJyB2ZXJ0aWNlcywgb3IgJ3RvdWNoaW5nJyBlZGdlcy5cbiAgICpcbiAgICogVmVydGljZXMgJ3RvdWNoJyBpZiB0aGV5IHNoYXJlIHRoZSBzYW1lIGNvb3JkaW5hdGVzIChhbmQgYXJlIG5vdCBhZGphY2VudCkuIEFuIGVkZ2UgdG91Y2hlcyBhbm90aGVyIGlmIG9uZSBvZiBpdHMgZW5kIHZlcnRpY2VzIHRvdWNoZXMgYW5vdGhlciBlZGdlXG4gICAqIGV4Y2x1ZGluZyBpdHMgYWRqYWNlbnQgZWRnZXMsIG9yIGlmIHRoZXkgYXJlIGNvLWxpbmVhciBhbmQgb3ZlcmxhcHBpbmcgKGluY2x1ZGluZyBhZGphY2VudCBlZGdlcykuXG4gICAqXG4gICAqIFBvbHlnb25zIHJldHVybmVkIGJ5IGNsaXBwaW5nIG9wZXJhdGlvbnMgKHNlZSBDbGlwcGVyLmV4ZWN1dGUoKSkgc2hvdWxkIGFsd2F5cyBiZSBzaW1wbGUgcG9seWdvbnMuIFdoZW4gdGhlIFN0cmljdGx5U2ltcGx5IHByb3BlcnR5IGlzIGVuYWJsZWQsXG4gICAqIHBvbHlnb25zIHJldHVybmVkIHdpbGwgYmUgc3RyaWN0bHkgc2ltcGxlLCBvdGhlcndpc2UgdGhleSBtYXkgYmUgd2Vha2x5IHNpbXBsZS4gSXQncyBjb21wdXRhdGlvbmFsbHkgZXhwZW5zaXZlIGVuc3VyaW5nIHBvbHlnb25zIGFyZSBzdHJpY3RseSBzaW1wbGVcbiAgICogYW5kIHNvIHRoaXMgcHJvcGVydHkgaXMgZGlzYWJsZWQgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogTm90ZTogVGhlcmUncyBjdXJyZW50bHkgbm8gZ3VhcmFudGVlIHRoYXQgcG9seWdvbnMgd2lsbCBiZSBzdHJpY3RseSBzaW1wbGUgc2luY2UgJ3NpbXBsaWZ5aW5nJyBpcyBzdGlsbCBhIHdvcmsgaW4gcHJvZ3Jlc3MuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gdHJ1ZSBpZiBzZXQsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgZ2V0IHN0cmljdGx5U2ltcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jbGlwcGVyIS5zdHJpY3RseVNpbXBsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXJtaW5vbG9neTpcbiAgICogLSBBIHNpbXBsZSBwb2x5Z29uIGlzIG9uZSB0aGF0IGRvZXMgbm90IHNlbGYtaW50ZXJzZWN0LlxuICAgKiAtIEEgd2Vha2x5IHNpbXBsZSBwb2x5Z29uIGlzIGEgc2ltcGxlIHBvbHlnb24gdGhhdCBjb250YWlucyAndG91Y2hpbmcnIHZlcnRpY2VzLCBvciAndG91Y2hpbmcnIGVkZ2VzLlxuICAgKiAtIEEgc3RyaWN0bHkgc2ltcGxlIHBvbHlnb24gaXMgYSBzaW1wbGUgcG9seWdvbiB0aGF0IGRvZXMgbm90IGNvbnRhaW4gJ3RvdWNoaW5nJyB2ZXJ0aWNlcywgb3IgJ3RvdWNoaW5nJyBlZGdlcy5cbiAgICpcbiAgICogVmVydGljZXMgJ3RvdWNoJyBpZiB0aGV5IHNoYXJlIHRoZSBzYW1lIGNvb3JkaW5hdGVzIChhbmQgYXJlIG5vdCBhZGphY2VudCkuIEFuIGVkZ2UgdG91Y2hlcyBhbm90aGVyIGlmIG9uZSBvZiBpdHMgZW5kIHZlcnRpY2VzIHRvdWNoZXMgYW5vdGhlciBlZGdlXG4gICAqIGV4Y2x1ZGluZyBpdHMgYWRqYWNlbnQgZWRnZXMsIG9yIGlmIHRoZXkgYXJlIGNvLWxpbmVhciBhbmQgb3ZlcmxhcHBpbmcgKGluY2x1ZGluZyBhZGphY2VudCBlZGdlcykuXG4gICAqXG4gICAqIFBvbHlnb25zIHJldHVybmVkIGJ5IGNsaXBwaW5nIG9wZXJhdGlvbnMgKHNlZSBDbGlwcGVyLmV4ZWN1dGUoKSkgc2hvdWxkIGFsd2F5cyBiZSBzaW1wbGUgcG9seWdvbnMuIFdoZW4gdGhlIFN0cmljdGx5U2ltcGx5IHByb3BlcnR5IGlzIGVuYWJsZWQsXG4gICAqIHBvbHlnb25zIHJldHVybmVkIHdpbGwgYmUgc3RyaWN0bHkgc2ltcGxlLCBvdGhlcndpc2UgdGhleSBtYXkgYmUgd2Vha2x5IHNpbXBsZS4gSXQncyBjb21wdXRhdGlvbmFsbHkgZXhwZW5zaXZlIGVuc3VyaW5nIHBvbHlnb25zIGFyZSBzdHJpY3RseSBzaW1wbGVcbiAgICogYW5kIHNvIHRoaXMgcHJvcGVydHkgaXMgZGlzYWJsZWQgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogTm90ZTogVGhlcmUncyBjdXJyZW50bHkgbm8gZ3VhcmFudGVlIHRoYXQgcG9seWdvbnMgd2lsbCBiZSBzdHJpY3RseSBzaW1wbGUgc2luY2UgJ3NpbXBsaWZ5aW5nJyBpcyBzdGlsbCBhIHdvcmsgaW4gcHJvZ3Jlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIHZhbHVlIHRvIHNldFxuICAgKi9cbiAgc2V0IHN0cmljdGx5U2ltcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2xpcHBlciEuc3RyaWN0bHlTaW1wbGUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQ2xpcHBlciBjb25zdHJ1Y3RvciBjcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBDbGlwcGVyIGNsYXNzLiBPbmUgb3IgbW9yZSBJbml0T3B0aW9ucyBtYXkgYmUgcGFzc2VkIGFzIGEgcGFyYW1ldGVyIHRvIHNldCB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0aWVzLlxuICAgKiAoVGhlc2UgcHJvcGVydGllcyBjYW4gc3RpbGwgYmUgc2V0IG9yIHJlc2V0IGFmdGVyIGNvbnN0cnVjdGlvbi4pXG4gICAqXG4gICAqIEBwYXJhbSBfbmF0aXZlTGliXG4gICAqIEBwYXJhbSBpbml0T3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gICAgaW5pdE9wdGlvbnM6IENsaXBwZXJJbml0T3B0aW9ucyA9IHt9XG4gICkge1xuICAgIGNvbnN0IHJlYWxJbml0T3B0aW9ucyA9IHtcbiAgICAgIHJldmVyc2VTb2x1dGlvbnM6IGZhbHNlLFxuICAgICAgc3RyaWN0bHlTaW1wbGU6IGZhbHNlLFxuICAgICAgcHJlc2VydmVDb2xsaW5lYXI6IGZhbHNlLFxuICAgICAgLi4uaW5pdE9wdGlvbnNcbiAgICB9O1xuXG4gICAgbGV0IG5hdGl2ZUluaXRPcHRpb25zID0gMDtcbiAgICBpZiAocmVhbEluaXRPcHRpb25zLnJldmVyc2VTb2x1dGlvbnMpIHtcbiAgICAgIG5hdGl2ZUluaXRPcHRpb25zICs9IF9uYXRpdmVMaWIuSW5pdE9wdGlvbnMuUmV2ZXJzZVNvbHV0aW9uIGFzIG51bWJlcjtcbiAgICB9XG4gICAgaWYgKHJlYWxJbml0T3B0aW9ucy5zdHJpY3RseVNpbXBsZSkge1xuICAgICAgbmF0aXZlSW5pdE9wdGlvbnMgKz0gX25hdGl2ZUxpYi5Jbml0T3B0aW9ucy5TdHJpY3RseVNpbXBsZSBhcyBudW1iZXI7XG4gICAgfVxuICAgIGlmIChyZWFsSW5pdE9wdGlvbnMucHJlc2VydmVDb2xsaW5lYXIpIHtcbiAgICAgIG5hdGl2ZUluaXRPcHRpb25zICs9IF9uYXRpdmVMaWIuSW5pdE9wdGlvbnMuUHJlc2VydmVDb2xsaW5lYXIgYXMgbnVtYmVyO1xuICAgIH1cblxuICAgIHRoaXMuX2NsaXBwZXIgPSBuZXcgX25hdGl2ZUxpYi5DbGlwcGVyKG5hdGl2ZUluaXRPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbnkgbnVtYmVyIG9mIHN1YmplY3QgYW5kIGNsaXAgcGF0aHMgY2FuIGJlIGFkZGVkIHRvIGEgY2xpcHBpbmcgdGFzaywgZWl0aGVyIGluZGl2aWR1YWxseSB2aWEgdGhlIGFkZFBhdGgoKSBtZXRob2QsIG9yIGFzIGdyb3VwcyB2aWEgdGhlIGFkZFBhdGhzKClcbiAgICogbWV0aG9kLCBvciBldmVuIHVzaW5nIGJvdGggbWV0aG9kcy5cbiAgICpcbiAgICogJ1N1YmplY3QnIHBhdGhzIG1heSBiZSBlaXRoZXIgb3BlbiAobGluZXMpIG9yIGNsb3NlZCAocG9seWdvbnMpIG9yIGV2ZW4gYSBtaXh0dXJlIG9mIGJvdGgsIGJ1dCAnY2xpcHBpbmcnIHBhdGhzIG11c3QgYWx3YXlzIGJlIGNsb3NlZC4gQ2xpcHBlciBhbGxvd3NcbiAgICogcG9seWdvbnMgdG8gY2xpcCBib3RoIGxpbmVzIGFuZCBvdGhlciBwb2x5Z29ucywgYnV0IGRvZXNuJ3QgYWxsb3cgbGluZXMgdG8gY2xpcCBlaXRoZXIgbGluZXMgb3IgcG9seWdvbnMuXG4gICAqXG4gICAqIFdpdGggY2xvc2VkIHBhdGhzLCBvcmllbnRhdGlvbiBzaG91bGQgY29uZm9ybSB3aXRoIHRoZSBmaWxsaW5nIHJ1bGUgdGhhdCB3aWxsIGJlIHBhc3NlZCB2aWEgQ2xpcHBlcidzIGV4ZWN1dGUgbWV0aG9kLlxuICAgKlxuICAgKiBQYXRoIENvb3JkaW5hdGUgcmFuZ2U6XG4gICAqIFBhdGggY29vcmRpbmF0ZXMgbXVzdCBiZSBiZXR3ZWVuIMKxIDkwMDcxOTkyNTQ3NDA5OTEsIG90aGVyd2lzZSBhIHJhbmdlIGVycm9yIHdpbGwgYmUgdGhyb3duIHdoZW4gYXR0ZW1wdGluZyB0byBhZGQgdGhlIHBhdGggdG8gdGhlIENsaXBwZXIgb2JqZWN0LlxuICAgKiBJZiBjb29yZGluYXRlcyBjYW4gYmUga2VwdCBiZXR3ZWVuIMKxIDB4M0ZGRkZGRkYgKMKxIDEuMGUrOSksIGEgbW9kZXN0IGluY3JlYXNlIGluIHBlcmZvcm1hbmNlIChhcHByb3guIDE1LTIwJSkgb3ZlciB0aGUgbGFyZ2VyIHJhbmdlIGNhbiBiZSBhY2hpZXZlZCBieVxuICAgKiBhdm9pZGluZyBsYXJnZSBpbnRlZ2VyIG1hdGguXG4gICAqXG4gICAqIFJldHVybiBWYWx1ZTpcbiAgICogVGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGZhbHNlIGlmIHRoZSBwYXRoIGlzIGludmFsaWQgZm9yIGNsaXBwaW5nLiBBIHBhdGggaXMgaW52YWxpZCBmb3IgY2xpcHBpbmcgd2hlbjpcbiAgICogLSBpdCBoYXMgbGVzcyB0aGFuIDIgdmVydGljZXNcbiAgICogLSBpdCBoYXMgMiB2ZXJ0aWNlcyBidXQgaXMgbm90IGFuIG9wZW4gcGF0aFxuICAgKiAtIHRoZSB2ZXJ0aWNlcyBhcmUgYWxsIGNvLWxpbmVhciBhbmQgaXQgaXMgbm90IGFuIG9wZW4gcGF0aFxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCAtIFBhdGggdG8gYWRkXG4gICAqIEBwYXJhbSBwb2x5VHlwZSAtIFBvbHlnb24gdHlwZVxuICAgKiBAcGFyYW0gY2xvc2VkIC0gSWYgdGhlIHBhdGggaXMgY2xvc2VkXG4gICAqL1xuICBhZGRQYXRoKHBhdGg6IFJlYWRvbmx5UGF0aCwgcG9seVR5cGU6IFBvbHlUeXBlLCBjbG9zZWQ6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBjb25zdCBuYXRpdmVQYXRoID0gcGF0aFRvTmF0aXZlUGF0aCh0aGlzLl9uYXRpdmVMaWIsIHBhdGgpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2xpcHBlciEuYWRkUGF0aChcbiAgICAgICAgbmF0aXZlUGF0aCxcbiAgICAgICAgcG9seVR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIHBvbHlUeXBlKSxcbiAgICAgICAgY2xvc2VkXG4gICAgICApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBuYXRpdmVQYXRoLmRlbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbnkgbnVtYmVyIG9mIHN1YmplY3QgYW5kIGNsaXAgcGF0aHMgY2FuIGJlIGFkZGVkIHRvIGEgY2xpcHBpbmcgdGFzaywgZWl0aGVyIGluZGl2aWR1YWxseSB2aWEgdGhlIGFkZFBhdGgoKSBtZXRob2QsIG9yIGFzIGdyb3VwcyB2aWEgdGhlIGFkZFBhdGhzKClcbiAgICogbWV0aG9kLCBvciBldmVuIHVzaW5nIGJvdGggbWV0aG9kcy5cbiAgICpcbiAgICogJ1N1YmplY3QnIHBhdGhzIG1heSBiZSBlaXRoZXIgb3BlbiAobGluZXMpIG9yIGNsb3NlZCAocG9seWdvbnMpIG9yIGV2ZW4gYSBtaXh0dXJlIG9mIGJvdGgsIGJ1dCAnY2xpcHBpbmcnIHBhdGhzIG11c3QgYWx3YXlzIGJlIGNsb3NlZC4gQ2xpcHBlciBhbGxvd3NcbiAgICogcG9seWdvbnMgdG8gY2xpcCBib3RoIGxpbmVzIGFuZCBvdGhlciBwb2x5Z29ucywgYnV0IGRvZXNuJ3QgYWxsb3cgbGluZXMgdG8gY2xpcCBlaXRoZXIgbGluZXMgb3IgcG9seWdvbnMuXG4gICAqXG4gICAqIFdpdGggY2xvc2VkIHBhdGhzLCBvcmllbnRhdGlvbiBzaG91bGQgY29uZm9ybSB3aXRoIHRoZSBmaWxsaW5nIHJ1bGUgdGhhdCB3aWxsIGJlIHBhc3NlZCB2aWEgQ2xpcHBlcidzIGV4ZWN1dGUgbWV0aG9kLlxuICAgKlxuICAgKiBQYXRoIENvb3JkaW5hdGUgcmFuZ2U6XG4gICAqIFBhdGggY29vcmRpbmF0ZXMgbXVzdCBiZSBiZXR3ZWVuIMKxIDkwMDcxOTkyNTQ3NDA5OTEsIG90aGVyd2lzZSBhIHJhbmdlIGVycm9yIHdpbGwgYmUgdGhyb3duIHdoZW4gYXR0ZW1wdGluZyB0byBhZGQgdGhlIHBhdGggdG8gdGhlIENsaXBwZXIgb2JqZWN0LlxuICAgKiBJZiBjb29yZGluYXRlcyBjYW4gYmUga2VwdCBiZXR3ZWVuIMKxIDB4M0ZGRkZGRkYgKMKxIDEuMGUrOSksIGEgbW9kZXN0IGluY3JlYXNlIGluIHBlcmZvcm1hbmNlIChhcHByb3guIDE1LTIwJSkgb3ZlciB0aGUgbGFyZ2VyIHJhbmdlIGNhbiBiZSBhY2hpZXZlZFxuICAgKiBieSBhdm9pZGluZyBsYXJnZSBpbnRlZ2VyIG1hdGguXG4gICAqXG4gICAqIFJldHVybiBWYWx1ZTpcbiAgICogVGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGZhbHNlIGlmIHRoZSBwYXRoIGlzIGludmFsaWQgZm9yIGNsaXBwaW5nLiBBIHBhdGggaXMgaW52YWxpZCBmb3IgY2xpcHBpbmcgd2hlbjpcbiAgICogLSBpdCBoYXMgbGVzcyB0aGFuIDIgdmVydGljZXNcbiAgICogLSBpdCBoYXMgMiB2ZXJ0aWNlcyBidXQgaXMgbm90IGFuIG9wZW4gcGF0aFxuICAgKiAtIHRoZSB2ZXJ0aWNlcyBhcmUgYWxsIGNvLWxpbmVhciBhbmQgaXQgaXMgbm90IGFuIG9wZW4gcGF0aFxuICAgKlxuICAgKiBAcGFyYW0gcGF0aHMgLSBQYXRocyB0byBhZGRcbiAgICogQHBhcmFtIHBvbHlUeXBlIC0gUGF0aHMgcG9seWdvbiB0eXBlXG4gICAqIEBwYXJhbSBjbG9zZWQgLSBJZiBhbGwgdGhlIGlubmVyIHBhdGhzIGFyZSBjbG9zZWRcbiAgICovXG4gIGFkZFBhdGhzKHBhdGhzOiBSZWFkb25seVBhdGhzLCBwb2x5VHlwZTogUG9seVR5cGUsIGNsb3NlZDogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5hdGl2ZVBhdGhzID0gcGF0aHNUb05hdGl2ZVBhdGhzKHRoaXMuX25hdGl2ZUxpYiwgcGF0aHMpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2xpcHBlciEuYWRkUGF0aHMoXG4gICAgICAgIG5hdGl2ZVBhdGhzLFxuICAgICAgICBwb2x5VHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgcG9seVR5cGUpLFxuICAgICAgICBjbG9zZWRcbiAgICAgICk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIG5hdGl2ZVBhdGhzLmRlbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQ2xlYXIgbWV0aG9kIHJlbW92ZXMgYW55IGV4aXN0aW5nIHN1YmplY3QgYW5kIGNsaXAgcG9seWdvbnMgYWxsb3dpbmcgdGhlIENsaXBwZXIgb2JqZWN0IHRvIGJlIHJldXNlZCBmb3IgY2xpcHBpbmcgb3BlcmF0aW9ucyBvbiBkaWZmZXJlbnQgcG9seWdvbiBzZXRzLlxuICAgKi9cbiAgY2xlYXIoKTogdm9pZCB7XG4gICAgdGhpcy5fY2xpcHBlciEuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBheGlzLWFsaWduZWQgYm91bmRpbmcgcmVjdGFuZ2xlIG9mIGFsbCBwb2x5Z29ucyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgQ2xpcHBlciBvYmplY3QuXG4gICAqXG4gICAqIEByZXR1cm4ge3tsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIHRvcDogbnVtYmVyLCBib3R0b206IG51bWJlcn19IC0gQm91bmRzXG4gICAqL1xuICBnZXRCb3VuZHMoKTogSW50UmVjdCB7XG4gICAgY29uc3QgbmF0aXZlQm91bmRzID0gdGhpcy5fY2xpcHBlciEuZ2V0Qm91bmRzKCk7XG4gICAgY29uc3QgcmVjdCA9IHtcbiAgICAgIGxlZnQ6IG5hdGl2ZUJvdW5kcy5sZWZ0LFxuICAgICAgcmlnaHQ6IG5hdGl2ZUJvdW5kcy5yaWdodCxcbiAgICAgIHRvcDogbmF0aXZlQm91bmRzLnRvcCxcbiAgICAgIGJvdHRvbTogbmF0aXZlQm91bmRzLmJvdHRvbVxuICAgIH07XG4gICAgbmF0aXZlQm91bmRzLmRlbGV0ZSgpO1xuICAgIHJldHVybiByZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIE9uY2Ugc3ViamVjdCBhbmQgY2xpcCBwYXRocyBoYXZlIGJlZW4gYXNzaWduZWQgKHZpYSBhZGRQYXRoIGFuZC9vciBhZGRQYXRocyksIGV4ZWN1dGUgY2FuIHRoZW4gcGVyZm9ybSB0aGUgY2xpcHBpbmcgb3BlcmF0aW9uIChpbnRlcnNlY3Rpb24sIHVuaW9uLFxuICAgKiBkaWZmZXJlbmNlIG9yIFhPUikgc3BlY2lmaWVkIGJ5IHRoZSBjbGlwVHlwZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIgaW4gdGhpcyBjYXNlIGlzIGEgUGF0aHMgb3IgUG9seVRyZWUgc3RydWN0dXJlLiBUaGUgUGF0aHMgc3RydWN0dXJlIGlzIHNpbXBsZXIgdGhhbiB0aGUgUG9seVRyZWUgc3RydWN0dXJlLiBCZWNhdXNlIG9mIHRoaXMgaXQgaXNcbiAgICogcXVpY2tlciB0byBwb3B1bGF0ZSBhbmQgaGVuY2UgY2xpcHBpbmcgcGVyZm9ybWFuY2UgaXMgYSBsaXR0bGUgYmV0dGVyIChpdCdzIHJvdWdobHkgMTAlIGZhc3RlcikuIEhvd2V2ZXIsIHRoZSBQb2x5VHJlZSBkYXRhIHN0cnVjdHVyZSBwcm92aWRlcyBtb3JlXG4gICAqIGluZm9ybWF0aW9uIGFib3V0IHRoZSByZXR1cm5lZCBwYXRocyB3aGljaCBtYXkgYmUgaW1wb3J0YW50IHRvIHVzZXJzLiBGaXJzdGx5LCB0aGUgUG9seVRyZWUgc3RydWN0dXJlIHByZXNlcnZlcyBuZXN0ZWQgcGFyZW50LWNoaWxkIHBvbHlnb24gcmVsYXRpb25zaGlwc1xuICAgKiAoaWUgb3V0ZXIgcG9seWdvbnMgb3duaW5nL2NvbnRhaW5pbmcgaG9sZXMgYW5kIGhvbGVzIG93bmluZy9jb250YWluaW5nIG90aGVyIG91dGVyIHBvbHlnb25zIGV0YykuIEFsc28sIG9ubHkgdGhlIFBvbHlUcmVlIHN0cnVjdHVyZSBjYW4gZGlmZmVyZW50aWF0ZVxuICAgKiBiZXR3ZWVuIG9wZW4gYW5kIGNsb3NlZCBwYXRocyBzaW5jZSBlYWNoIFBvbHlOb2RlIGhhcyBhbiBJc09wZW4gcHJvcGVydHkuIChUaGUgUGF0aCBzdHJ1Y3R1cmUgaGFzIG5vIG1lbWJlciBpbmRpY2F0aW5nIHdoZXRoZXIgaXQncyBvcGVuIG9yIGNsb3NlZC4pXG4gICAqIEZvciB0aGlzIHJlYXNvbiwgd2hlbiBvcGVuIHBhdGhzIGFyZSBwYXNzZWQgdG8gYSBDbGlwcGVyIG9iamVjdCwgdGhlIHVzZXIgbXVzdCB1c2UgYSBQb2x5VHJlZSBvYmplY3QgYXMgdGhlIHNvbHV0aW9uIHBhcmFtZXRlciwgb3RoZXJ3aXNlIGFuIGV4Y2VwdGlvblxuICAgKiB3aWxsIGJlIHJhaXNlZC5cbiAgICpcbiAgICogV2hlbiBhIFBvbHlUcmVlIG9iamVjdCBpcyB1c2VkIGluIGEgY2xpcHBpbmcgb3BlcmF0aW9uIG9uIG9wZW4gcGF0aHMsIHR3byBhbmNpbGxpYXJ5IGZ1bmN0aW9ucyBoYXZlIGJlZW4gcHJvdmlkZWQgdG8gcXVpY2tseSBzZXBhcmF0ZSBvdXQgb3BlbiBhbmRcbiAgICogY2xvc2VkIHBhdGhzIGZyb20gdGhlIHNvbHV0aW9uIC0gT3BlblBhdGhzRnJvbVBvbHlUcmVlIGFuZCBDbG9zZWRQYXRoc0Zyb21Qb2x5VHJlZS4gUG9seVRyZWVUb1BhdGhzIGlzIGFsc28gYXZhaWxhYmxlIHRvIGNvbnZlcnQgcGF0aCBkYXRhIHRvIGEgUGF0aHNcbiAgICogc3RydWN0dXJlIChpcnJlc3BlY3RpdmUgb2Ygd2hldGhlciB0aGV5J3JlIG9wZW4gb3IgY2xvc2VkKS5cbiAgICpcbiAgICogVGhlcmUgYXJlIHNldmVyYWwgdGhpbmdzIHRvIG5vdGUgYWJvdXQgdGhlIHNvbHV0aW9uIHBhdGhzIHJldHVybmVkOlxuICAgKiAtIHRoZXkgYXJlbid0IGluIGFueSBzcGVjaWZpYyBvcmRlclxuICAgKiAtIHRoZXkgc2hvdWxkIG5ldmVyIG92ZXJsYXAgb3IgYmUgc2VsZi1pbnRlcnNlY3RpbmcgKGJ1dCBzZWUgbm90ZXMgb24gcm91bmRpbmcpXG4gICAqIC0gaG9sZXMgd2lsbCBiZSBvcmllbnRlZCBvcHBvc2l0ZSBvdXRlciBwb2x5Z29uc1xuICAgKiAtIHRoZSBzb2x1dGlvbiBmaWxsIHR5cGUgY2FuIGJlIGNvbnNpZGVyZWQgZWl0aGVyIEV2ZW5PZGQgb3IgTm9uWmVybyBzaW5jZSBpdCB3aWxsIGNvbXBseSB3aXRoIGVpdGhlciBmaWxsaW5nIHJ1bGVcbiAgICogLSBwb2x5Z29ucyBtYXkgcmFyZWx5IHNoYXJlIGEgY29tbW9uIGVkZ2UgKHRob3VnaCB0aGlzIGlzIG5vdyB2ZXJ5IHJhcmUgYXMgb2YgdmVyc2lvbiA2KVxuICAgKlxuICAgKiBUaGUgc3ViakZpbGxUeXBlIGFuZCBjbGlwRmlsbFR5cGUgcGFyYW1ldGVycyBkZWZpbmUgdGhlIHBvbHlnb24gZmlsbCBydWxlIHRvIGJlIGFwcGxpZWQgdG8gdGhlIHBvbHlnb25zIChpZSBjbG9zZWQgcGF0aHMpIGluIHRoZSBzdWJqZWN0IGFuZCBjbGlwXG4gICAqIHBhdGhzIHJlc3BlY3RpdmVseS4gKEl0J3MgdXN1YWwgdGhvdWdoIG9idmlvdXNseSBub3QgZXNzZW50aWFsIHRoYXQgYm90aCBzZXRzIG9mIHBvbHlnb25zIHVzZSB0aGUgc2FtZSBmaWxsIHJ1bGUuKVxuICAgKlxuICAgKiBleGVjdXRlIGNhbiBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMgd2l0aG91dCByZWFzc2lnbmluZyBzdWJqZWN0IGFuZCBjbGlwIHBvbHlnb25zIChpZSB3aGVuIGRpZmZlcmVudCBjbGlwcGluZyBvcGVyYXRpb25zIGFyZSByZXF1aXJlZCBvbiB0aGVcbiAgICogc2FtZSBwb2x5Z29uIHNldHMpLlxuICAgKlxuICAgKiBAcGFyYW0gY2xpcFR5cGUgLSBDbGlwIG9wZXJhdGlvbiB0eXBlXG4gICAqIEBwYXJhbSBzdWJqRmlsbFR5cGUgLSBGaWxsIHR5cGUgb2YgdGhlIHN1YmplY3QgcG9seWdvbnNcbiAgICogQHBhcmFtIGNsaXBGaWxsVHlwZSAtIEZpbGwgdHlwZSBvZiB0aGUgY2xpcCBwb2x5Z29uc1xuICAgKiBAcGFyYW0gY2xlYW5EaXN0YW5jZSAtIENsZWFuIGRpc3RhbmNlIG92ZXIgdGhlIG91dHB1dCwgb3IgdW5kZWZpbmVkIGZvciBubyBjbGVhbmluZy5cbiAgICogQHJldHVybiB7UGF0aHMgfCB1bmRlZmluZWR9IC0gVGhlIHNvbHV0aW9uIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSB3YXMgYW4gZXJyb3JcbiAgICovXG4gIGV4ZWN1dGVUb1BhdGhzKFxuICAgIGNsaXBUeXBlOiBDbGlwVHlwZSxcbiAgICBzdWJqRmlsbFR5cGU6IFBvbHlGaWxsVHlwZSxcbiAgICBjbGlwRmlsbFR5cGU6IFBvbHlGaWxsVHlwZSxcbiAgICBjbGVhbkRpc3RhbmNlOiBudW1iZXIgfCB1bmRlZmluZWRcbiAgKTogUGF0aHMgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IG91dE5hdGl2ZVBhdGhzID0gbmV3IHRoaXMuX25hdGl2ZUxpYi5QYXRocygpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdWNjZXNzID0gdGhpcy5fY2xpcHBlciEuZXhlY3V0ZVBhdGhzV2l0aEZpbGxUeXBlcyhcbiAgICAgICAgY2xpcFR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIGNsaXBUeXBlKSxcbiAgICAgICAgb3V0TmF0aXZlUGF0aHMsXG4gICAgICAgIHBvbHlGaWxsVHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgc3ViakZpbGxUeXBlKSxcbiAgICAgICAgcG9seUZpbGxUeXBlVG9OYXRpdmUodGhpcy5fbmF0aXZlTGliLCBjbGlwRmlsbFR5cGUpXG4gICAgICApO1xuICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY2xlYW5EaXN0YW5jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5fbmF0aXZlTGliLmNsZWFuUG9seWdvbnMob3V0TmF0aXZlUGF0aHMsIGNsZWFuRGlzdGFuY2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYXRpdmVQYXRoc1RvUGF0aHModGhpcy5fbmF0aXZlTGliLCBvdXROYXRpdmVQYXRocywgdHJ1ZSk7IC8vIGZyZWVzIG91dE5hdGl2ZVBhdGhzXG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICghb3V0TmF0aXZlUGF0aHMuaXNEZWxldGVkKCkpIHtcbiAgICAgICAgb3V0TmF0aXZlUGF0aHMuZGVsZXRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uY2Ugc3ViamVjdCBhbmQgY2xpcCBwYXRocyBoYXZlIGJlZW4gYXNzaWduZWQgKHZpYSBhZGRQYXRoIGFuZC9vciBhZGRQYXRocyksIGV4ZWN1dGUgY2FuIHRoZW4gcGVyZm9ybSB0aGUgY2xpcHBpbmcgb3BlcmF0aW9uIChpbnRlcnNlY3Rpb24sIHVuaW9uLFxuICAgKiBkaWZmZXJlbmNlIG9yIFhPUikgc3BlY2lmaWVkIGJ5IHRoZSBjbGlwVHlwZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIgY2FuIGJlIGVpdGhlciBhIFBhdGhzIG9yIFBvbHlUcmVlIHN0cnVjdHVyZS4gVGhlIFBhdGhzIHN0cnVjdHVyZSBpcyBzaW1wbGVyIHRoYW4gdGhlIFBvbHlUcmVlIHN0cnVjdHVyZS4gQmVjYXVzZSBvZiB0aGlzIGl0IGlzXG4gICAqIHF1aWNrZXIgdG8gcG9wdWxhdGUgYW5kIGhlbmNlIGNsaXBwaW5nIHBlcmZvcm1hbmNlIGlzIGEgbGl0dGxlIGJldHRlciAoaXQncyByb3VnaGx5IDEwJSBmYXN0ZXIpLiBIb3dldmVyLCB0aGUgUG9seVRyZWUgZGF0YSBzdHJ1Y3R1cmUgcHJvdmlkZXMgbW9yZVxuICAgKiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcmV0dXJuZWQgcGF0aHMgd2hpY2ggbWF5IGJlIGltcG9ydGFudCB0byB1c2Vycy4gRmlyc3RseSwgdGhlIFBvbHlUcmVlIHN0cnVjdHVyZSBwcmVzZXJ2ZXMgbmVzdGVkIHBhcmVudC1jaGlsZCBwb2x5Z29uIHJlbGF0aW9uc2hpcHNcbiAgICogKGllIG91dGVyIHBvbHlnb25zIG93bmluZy9jb250YWluaW5nIGhvbGVzIGFuZCBob2xlcyBvd25pbmcvY29udGFpbmluZyBvdGhlciBvdXRlciBwb2x5Z29ucyBldGMpLiBBbHNvLCBvbmx5IHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgY2FuIGRpZmZlcmVudGlhdGVcbiAgICogYmV0d2VlbiBvcGVuIGFuZCBjbG9zZWQgcGF0aHMgc2luY2UgZWFjaCBQb2x5Tm9kZSBoYXMgYW4gSXNPcGVuIHByb3BlcnR5LiAoVGhlIFBhdGggc3RydWN0dXJlIGhhcyBubyBtZW1iZXIgaW5kaWNhdGluZyB3aGV0aGVyIGl0J3Mgb3BlbiBvciBjbG9zZWQuKVxuICAgKiBGb3IgdGhpcyByZWFzb24sIHdoZW4gb3BlbiBwYXRocyBhcmUgcGFzc2VkIHRvIGEgQ2xpcHBlciBvYmplY3QsIHRoZSB1c2VyIG11c3QgdXNlIGEgUG9seVRyZWUgb2JqZWN0IGFzIHRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIsIG90aGVyd2lzZSBhbiBleGNlcHRpb25cbiAgICogd2lsbCBiZSByYWlzZWQuXG4gICAqXG4gICAqIFdoZW4gYSBQb2x5VHJlZSBvYmplY3QgaXMgdXNlZCBpbiBhIGNsaXBwaW5nIG9wZXJhdGlvbiBvbiBvcGVuIHBhdGhzLCB0d28gYW5jaWxsaWFyeSBmdW5jdGlvbnMgaGF2ZSBiZWVuIHByb3ZpZGVkIHRvIHF1aWNrbHkgc2VwYXJhdGUgb3V0IG9wZW4gYW5kXG4gICAqIGNsb3NlZCBwYXRocyBmcm9tIHRoZSBzb2x1dGlvbiAtIE9wZW5QYXRoc0Zyb21Qb2x5VHJlZSBhbmQgQ2xvc2VkUGF0aHNGcm9tUG9seVRyZWUuIFBvbHlUcmVlVG9QYXRocyBpcyBhbHNvIGF2YWlsYWJsZSB0byBjb252ZXJ0IHBhdGggZGF0YSB0byBhIFBhdGhzXG4gICAqIHN0cnVjdHVyZSAoaXJyZXNwZWN0aXZlIG9mIHdoZXRoZXIgdGhleSdyZSBvcGVuIG9yIGNsb3NlZCkuXG4gICAqXG4gICAqIFRoZXJlIGFyZSBzZXZlcmFsIHRoaW5ncyB0byBub3RlIGFib3V0IHRoZSBzb2x1dGlvbiBwYXRocyByZXR1cm5lZDpcbiAgICogLSB0aGV5IGFyZW4ndCBpbiBhbnkgc3BlY2lmaWMgb3JkZXJcbiAgICogLSB0aGV5IHNob3VsZCBuZXZlciBvdmVybGFwIG9yIGJlIHNlbGYtaW50ZXJzZWN0aW5nIChidXQgc2VlIG5vdGVzIG9uIHJvdW5kaW5nKVxuICAgKiAtIGhvbGVzIHdpbGwgYmUgb3JpZW50ZWQgb3Bwb3NpdGUgb3V0ZXIgcG9seWdvbnNcbiAgICogLSB0aGUgc29sdXRpb24gZmlsbCB0eXBlIGNhbiBiZSBjb25zaWRlcmVkIGVpdGhlciBFdmVuT2RkIG9yIE5vblplcm8gc2luY2UgaXQgd2lsbCBjb21wbHkgd2l0aCBlaXRoZXIgZmlsbGluZyBydWxlXG4gICAqIC0gcG9seWdvbnMgbWF5IHJhcmVseSBzaGFyZSBhIGNvbW1vbiBlZGdlICh0aG91Z2ggdGhpcyBpcyBub3cgdmVyeSByYXJlIGFzIG9mIHZlcnNpb24gNilcbiAgICpcbiAgICogVGhlIHN1YmpGaWxsVHlwZSBhbmQgY2xpcEZpbGxUeXBlIHBhcmFtZXRlcnMgZGVmaW5lIHRoZSBwb2x5Z29uIGZpbGwgcnVsZSB0byBiZSBhcHBsaWVkIHRvIHRoZSBwb2x5Z29ucyAoaWUgY2xvc2VkIHBhdGhzKSBpbiB0aGUgc3ViamVjdCBhbmQgY2xpcFxuICAgKiBwYXRocyByZXNwZWN0aXZlbHkuIChJdCdzIHVzdWFsIHRob3VnaCBvYnZpb3VzbHkgbm90IGVzc2VudGlhbCB0aGF0IGJvdGggc2V0cyBvZiBwb2x5Z29ucyB1c2UgdGhlIHNhbWUgZmlsbCBydWxlLilcbiAgICpcbiAgICogZXhlY3V0ZSBjYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzIHdpdGhvdXQgcmVhc3NpZ25pbmcgc3ViamVjdCBhbmQgY2xpcCBwb2x5Z29ucyAoaWUgd2hlbiBkaWZmZXJlbnQgY2xpcHBpbmcgb3BlcmF0aW9ucyBhcmUgcmVxdWlyZWQgb24gdGhlXG4gICAqIHNhbWUgcG9seWdvbiBzZXRzKS5cbiAgICpcbiAgICogQHBhcmFtIGNsaXBUeXBlIC0gQ2xpcCBvcGVyYXRpb24gdHlwZVxuICAgKiBAcGFyYW0gc3ViakZpbGxUeXBlIC0gRmlsbCB0eXBlIG9mIHRoZSBzdWJqZWN0IHBvbHlnb25zXG4gICAqIEBwYXJhbSBjbGlwRmlsbFR5cGUgLSBGaWxsIHR5cGUgb2YgdGhlIGNsaXAgcG9seWdvbnNcbiAgICogQHJldHVybiB7UG9seVRyZWUgfCB1bmRlZmluZWR9IC0gVGhlIHNvbHV0aW9uIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSB3YXMgYW4gZXJyb3JcbiAgICovXG4gIGV4ZWN1dGVUb1BvbHlUZWUoXG4gICAgY2xpcFR5cGU6IENsaXBUeXBlLFxuICAgIHN1YmpGaWxsVHlwZTogUG9seUZpbGxUeXBlLFxuICAgIGNsaXBGaWxsVHlwZTogUG9seUZpbGxUeXBlXG4gICk6IFBvbHlUcmVlIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBvdXROYXRpdmVQb2x5VHJlZSA9IG5ldyB0aGlzLl9uYXRpdmVMaWIuUG9seVRyZWUoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3VjY2VzcyA9IHRoaXMuX2NsaXBwZXIhLmV4ZWN1dGVQb2x5VHJlZVdpdGhGaWxsVHlwZXMoXG4gICAgICAgIGNsaXBUeXBlVG9OYXRpdmUodGhpcy5fbmF0aXZlTGliLCBjbGlwVHlwZSksXG4gICAgICAgIG91dE5hdGl2ZVBvbHlUcmVlLFxuICAgICAgICBwb2x5RmlsbFR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIHN1YmpGaWxsVHlwZSksXG4gICAgICAgIHBvbHlGaWxsVHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgY2xpcEZpbGxUeXBlKVxuICAgICAgKTtcbiAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFBvbHlUcmVlLmZyb21OYXRpdmVQb2x5VHJlZSh0aGlzLl9uYXRpdmVMaWIsIG91dE5hdGl2ZVBvbHlUcmVlLCB0cnVlKTsgLy8gZnJlZXMgb3V0TmF0aXZlUG9seVRyZWVcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKCFvdXROYXRpdmVQb2x5VHJlZS5pc0RlbGV0ZWQoKSkge1xuICAgICAgICBvdXROYXRpdmVQb2x5VHJlZS5kZWxldGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBvYmplY3QgaGFzIGJlZW4gZGlzcG9zZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gdHJ1ZSBpZiBkaXNwb3NlZCwgZmFsc2UgaWYgbm90XG4gICAqL1xuICBpc0Rpc3Bvc2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jbGlwcGVyID09PSB1bmRlZmluZWQgfHwgdGhpcy5fY2xpcHBlci5pc0RlbGV0ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaW5jZSB0aGlzIGxpYnJhcnkgdXNlcyBXQVNNL0FTTS5KUyBpbnRlcm5hbGx5IGZvciBzcGVlZCB0aGlzIG1lYW5zIHRoYXQgeW91IG11c3QgZGlzcG9zZSBvYmplY3RzIGFmdGVyIHlvdSBhcmUgZG9uZSB1c2luZyB0aGVtIG9yIG1lbSBsZWFrcyB3aWxsIG9jY3VyLlxuICAgKi9cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2xpcHBlcikge1xuICAgICAgdGhpcy5fY2xpcHBlci5kZWxldGUoKTtcbiAgICAgIHRoaXMuX2NsaXBwZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXX0=