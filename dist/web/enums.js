"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * By far the most widely used winding rules for polygon filling are EvenOdd & NonZero (GDI, GDI+, XLib, OpenGL, Cairo, AGG, Quartz, SVG, Gr32)
 * Others rules include Positive, Negative and ABS_GTR_EQ_TWO (only in OpenGL)
 * see http://glprogramming.com/red/chapter11.html
 */
var PolyFillType;
(function (PolyFillType) {
    PolyFillType["EvenOdd"] = "evenOdd";
    PolyFillType["NonZero"] = "nonZero";
    PolyFillType["Positive"] = "positive";
    PolyFillType["Negative"] = "negative";
})(PolyFillType = exports.PolyFillType || (exports.PolyFillType = {}));
var ClipType;
(function (ClipType) {
    ClipType["Intersection"] = "intersection";
    ClipType["Union"] = "union";
    ClipType["Difference"] = "difference";
    ClipType["Xor"] = "xor";
})(ClipType = exports.ClipType || (exports.ClipType = {}));
var PolyType;
(function (PolyType) {
    PolyType["Subject"] = "subject";
    PolyType["Clip"] = "clip";
})(PolyType = exports.PolyType || (exports.PolyType = {}));
var JoinType;
(function (JoinType) {
    JoinType["Square"] = "square";
    JoinType["Round"] = "round";
    JoinType["Miter"] = "miter";
})(JoinType = exports.JoinType || (exports.JoinType = {}));
var EndType;
(function (EndType) {
    EndType["ClosedPolygon"] = "closedPolygon";
    EndType["ClosedLine"] = "closedLine";
    EndType["OpenButt"] = "openButt";
    EndType["OpenSquare"] = "openSquare";
    EndType["OpenRound"] = "openRound";
})(EndType = exports.EndType || (exports.EndType = {}));
var PointInPolygonResult;
(function (PointInPolygonResult) {
    PointInPolygonResult[PointInPolygonResult["Outside"] = 0] = "Outside";
    PointInPolygonResult[PointInPolygonResult["Inside"] = 1] = "Inside";
    PointInPolygonResult[PointInPolygonResult["OnBoundary"] = -1] = "OnBoundary";
})(PointInPolygonResult = exports.PointInPolygonResult || (exports.PointInPolygonResult = {}));
/**
 * Format to use when loading the native library instance.
 */
var NativeClipperLibRequestedFormat;
(function (NativeClipperLibRequestedFormat) {
    /**
     * Try to load the WebAssembly version, if it fails try to load the Asm.js version.
     */
    NativeClipperLibRequestedFormat["WasmWithAsmJsFallback"] = "wasmWithAsmJsFallback";
    /**
     * Load the WebAssembly version exclusively.
     */
    NativeClipperLibRequestedFormat["WasmOnly"] = "wasmOnly";
    /**
     * Load the Asm.js version exclusively.
     */
    NativeClipperLibRequestedFormat["AsmJsOnly"] = "asmJsOnly";
})(NativeClipperLibRequestedFormat = exports.NativeClipperLibRequestedFormat || (exports.NativeClipperLibRequestedFormat = {}));
/**
 * The format the native library being used is in.
 */
var NativeClipperLibLoadedFormat;
(function (NativeClipperLibLoadedFormat) {
    /**
     * WebAssembly.
     */
    NativeClipperLibLoadedFormat["Wasm"] = "wasm";
    /**
     * Asm.js.
     */
    NativeClipperLibLoadedFormat["AsmJs"] = "asmJs";
})(NativeClipperLibLoadedFormat = exports.NativeClipperLibLoadedFormat || (exports.NativeClipperLibLoadedFormat = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZW51bXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxZQUtYO0FBTEQsV0FBWSxZQUFZO0lBQ3RCLG1DQUFtQixDQUFBO0lBQ25CLG1DQUFtQixDQUFBO0lBQ25CLHFDQUFxQixDQUFBO0lBQ3JCLHFDQUFxQixDQUFBO0FBQ3ZCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtBQUVELElBQVksUUFLWDtBQUxELFdBQVksUUFBUTtJQUNsQix5Q0FBNkIsQ0FBQTtJQUM3QiwyQkFBZSxDQUFBO0lBQ2YscUNBQXlCLENBQUE7SUFDekIsdUJBQVcsQ0FBQTtBQUNiLENBQUMsRUFMVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQUtuQjtBQUNELElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNsQiwrQkFBbUIsQ0FBQTtJQUNuQix5QkFBYSxDQUFBO0FBQ2YsQ0FBQyxFQUhXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBR25CO0FBRUQsSUFBWSxRQUlYO0FBSkQsV0FBWSxRQUFRO0lBQ2xCLDZCQUFpQixDQUFBO0lBQ2pCLDJCQUFlLENBQUE7SUFDZiwyQkFBZSxDQUFBO0FBQ2pCLENBQUMsRUFKVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQUluQjtBQUNELElBQVksT0FNWDtBQU5ELFdBQVksT0FBTztJQUNqQiwwQ0FBK0IsQ0FBQTtJQUMvQixvQ0FBeUIsQ0FBQTtJQUN6QixnQ0FBcUIsQ0FBQTtJQUNyQixvQ0FBeUIsQ0FBQTtJQUN6QixrQ0FBdUIsQ0FBQTtBQUN6QixDQUFDLEVBTlcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBTWxCO0FBRUQsSUFBWSxvQkFJWDtBQUpELFdBQVksb0JBQW9CO0lBQzlCLHFFQUFXLENBQUE7SUFDWCxtRUFBVSxDQUFBO0lBQ1YsNEVBQWUsQ0FBQTtBQUNqQixDQUFDLEVBSlcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFJL0I7QUFFRDs7R0FFRztBQUNILElBQVksK0JBYVg7QUFiRCxXQUFZLCtCQUErQjtJQUN6Qzs7T0FFRztJQUNILGtGQUErQyxDQUFBO0lBQy9DOztPQUVHO0lBQ0gsd0RBQXFCLENBQUE7SUFDckI7O09BRUc7SUFDSCwwREFBdUIsQ0FBQTtBQUN6QixDQUFDLEVBYlcsK0JBQStCLEdBQS9CLHVDQUErQixLQUEvQix1Q0FBK0IsUUFhMUM7QUFFRDs7R0FFRztBQUNILElBQVksNEJBU1g7QUFURCxXQUFZLDRCQUE0QjtJQUN0Qzs7T0FFRztJQUNILDZDQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILCtDQUFlLENBQUE7QUFDakIsQ0FBQyxFQVRXLDRCQUE0QixHQUE1QixvQ0FBNEIsS0FBNUIsb0NBQTRCLFFBU3ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCeSBmYXIgdGhlIG1vc3Qgd2lkZWx5IHVzZWQgd2luZGluZyBydWxlcyBmb3IgcG9seWdvbiBmaWxsaW5nIGFyZSBFdmVuT2RkICYgTm9uWmVybyAoR0RJLCBHREkrLCBYTGliLCBPcGVuR0wsIENhaXJvLCBBR0csIFF1YXJ0eiwgU1ZHLCBHcjMyKVxuICogT3RoZXJzIHJ1bGVzIGluY2x1ZGUgUG9zaXRpdmUsIE5lZ2F0aXZlIGFuZCBBQlNfR1RSX0VRX1RXTyAob25seSBpbiBPcGVuR0wpXG4gKiBzZWUgaHR0cDovL2dscHJvZ3JhbW1pbmcuY29tL3JlZC9jaGFwdGVyMTEuaHRtbFxuICovXG5leHBvcnQgZW51bSBQb2x5RmlsbFR5cGUge1xuICBFdmVuT2RkID0gXCJldmVuT2RkXCIsXG4gIE5vblplcm8gPSBcIm5vblplcm9cIixcbiAgUG9zaXRpdmUgPSBcInBvc2l0aXZlXCIsXG4gIE5lZ2F0aXZlID0gXCJuZWdhdGl2ZVwiXG59XG5cbmV4cG9ydCBlbnVtIENsaXBUeXBlIHtcbiAgSW50ZXJzZWN0aW9uID0gXCJpbnRlcnNlY3Rpb25cIixcbiAgVW5pb24gPSBcInVuaW9uXCIsXG4gIERpZmZlcmVuY2UgPSBcImRpZmZlcmVuY2VcIixcbiAgWG9yID0gXCJ4b3JcIlxufVxuZXhwb3J0IGVudW0gUG9seVR5cGUge1xuICBTdWJqZWN0ID0gXCJzdWJqZWN0XCIsXG4gIENsaXAgPSBcImNsaXBcIlxufVxuXG5leHBvcnQgZW51bSBKb2luVHlwZSB7XG4gIFNxdWFyZSA9IFwic3F1YXJlXCIsXG4gIFJvdW5kID0gXCJyb3VuZFwiLFxuICBNaXRlciA9IFwibWl0ZXJcIlxufVxuZXhwb3J0IGVudW0gRW5kVHlwZSB7XG4gIENsb3NlZFBvbHlnb24gPSBcImNsb3NlZFBvbHlnb25cIixcbiAgQ2xvc2VkTGluZSA9IFwiY2xvc2VkTGluZVwiLFxuICBPcGVuQnV0dCA9IFwib3BlbkJ1dHRcIixcbiAgT3BlblNxdWFyZSA9IFwib3BlblNxdWFyZVwiLFxuICBPcGVuUm91bmQgPSBcIm9wZW5Sb3VuZFwiXG59XG5cbmV4cG9ydCBlbnVtIFBvaW50SW5Qb2x5Z29uUmVzdWx0IHtcbiAgT3V0c2lkZSA9IDAsXG4gIEluc2lkZSA9IDEsXG4gIE9uQm91bmRhcnkgPSAtMVxufVxuXG4vKipcbiAqIEZvcm1hdCB0byB1c2Ugd2hlbiBsb2FkaW5nIHRoZSBuYXRpdmUgbGlicmFyeSBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGVudW0gTmF0aXZlQ2xpcHBlckxpYlJlcXVlc3RlZEZvcm1hdCB7XG4gIC8qKlxuICAgKiBUcnkgdG8gbG9hZCB0aGUgV2ViQXNzZW1ibHkgdmVyc2lvbiwgaWYgaXQgZmFpbHMgdHJ5IHRvIGxvYWQgdGhlIEFzbS5qcyB2ZXJzaW9uLlxuICAgKi9cbiAgV2FzbVdpdGhBc21Kc0ZhbGxiYWNrID0gXCJ3YXNtV2l0aEFzbUpzRmFsbGJhY2tcIixcbiAgLyoqXG4gICAqIExvYWQgdGhlIFdlYkFzc2VtYmx5IHZlcnNpb24gZXhjbHVzaXZlbHkuXG4gICAqL1xuICBXYXNtT25seSA9IFwid2FzbU9ubHlcIixcbiAgLyoqXG4gICAqIExvYWQgdGhlIEFzbS5qcyB2ZXJzaW9uIGV4Y2x1c2l2ZWx5LlxuICAgKi9cbiAgQXNtSnNPbmx5ID0gXCJhc21Kc09ubHlcIlxufVxuXG4vKipcbiAqIFRoZSBmb3JtYXQgdGhlIG5hdGl2ZSBsaWJyYXJ5IGJlaW5nIHVzZWQgaXMgaW4uXG4gKi9cbmV4cG9ydCBlbnVtIE5hdGl2ZUNsaXBwZXJMaWJMb2FkZWRGb3JtYXQge1xuICAvKipcbiAgICogV2ViQXNzZW1ibHkuXG4gICAqL1xuICBXYXNtID0gXCJ3YXNtXCIsXG4gIC8qKlxuICAgKiBBc20uanMuXG4gICAqL1xuICBBc21KcyA9IFwiYXNtSnNcIlxufVxuIl19