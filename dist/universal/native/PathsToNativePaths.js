"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mem_1 = require("./mem");
var PathToNativePath_1 = require("./PathToNativePath");
// js to c++
function pathsToDoubleArray(nativeClipperLib, myPaths) {
    var nofPaths = myPaths.length;
    // first calculate nof items required
    var nofItems = 1; // for path count
    for (var i = 0; i < nofPaths; i++) {
        nofItems += PathToNativePath_1.getNofItemsForPath(myPaths[i]);
    }
    var heapBytes = mem_1.mallocDoubleArray(nativeClipperLib, nofItems);
    heapBytes[0] = nofPaths;
    var ptr = 1;
    for (var i = 0; i < nofPaths; i++) {
        var path = myPaths[i];
        ptr = PathToNativePath_1.writePathToDoubleArray(path, heapBytes, ptr);
    }
    return heapBytes;
}
exports.pathsToDoubleArray = pathsToDoubleArray;
function doubleArrayToNativePaths(nativeClipperLib, array, freeArray) {
    var p = new nativeClipperLib.Paths();
    nativeClipperLib.toPaths(p, array.byteOffset);
    if (freeArray) {
        mem_1.freeTypedArray(nativeClipperLib, array);
    }
    return p;
}
exports.doubleArrayToNativePaths = doubleArrayToNativePaths;
function pathsToNativePaths(nativeClipperLib, paths) {
    var array = pathsToDoubleArray(nativeClipperLib, paths);
    return doubleArrayToNativePaths(nativeClipperLib, array, true);
}
exports.pathsToNativePaths = pathsToNativePaths;
// c++ to js
function nativePathsToDoubleArray(nativeClipperLib, nativePaths, freeNativePaths) {
    var array = nativeClipperLib.fromPaths(nativePaths);
    if (freeNativePaths) {
        nativePaths.delete();
    }
    return array;
}
exports.nativePathsToDoubleArray = nativePathsToDoubleArray;
function doubleArrayToPaths(nativeClipperLib, array, _freeDoubleArray) {
    var len = array[0];
    var paths = [];
    paths.length = len;
    var arrayI = 1;
    for (var i = 0; i < len; i++) {
        var result = PathToNativePath_1.doubleArrayToPath(nativeClipperLib, array, false, arrayI);
        paths[i] = result.path;
        arrayI = result.ptrEnd;
    }
    if (_freeDoubleArray) {
        mem_1.freeTypedArray(nativeClipperLib, array);
    }
    return paths;
}
exports.doubleArrayToPaths = doubleArrayToPaths;
function nativePathsToPaths(nativeClipperLib, nativePaths, freeNativePaths) {
    var array = nativePathsToDoubleArray(nativeClipperLib, nativePaths, freeNativePaths);
    return doubleArrayToPaths(nativeClipperLib, array, true);
}
exports.nativePathsToPaths = nativePathsToPaths;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF0aHNUb05hdGl2ZVBhdGhzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL25hdGl2ZS9QYXRoc1RvTmF0aXZlUGF0aHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw2QkFBMEQ7QUFHMUQsdURBQW1HO0FBRW5HLFlBQVk7QUFFWixTQUFnQixrQkFBa0IsQ0FDaEMsZ0JBQTBDLEVBQzFDLE9BQXNCO0lBRXRCLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFaEMscUNBQXFDO0lBQ3JDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtJQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLFFBQVEsSUFBSSxxQ0FBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1QztJQUNELElBQU0sU0FBUyxHQUFHLHVCQUFpQixDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7SUFFeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsR0FBRyxHQUFHLHlDQUFzQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDcEQ7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBckJELGdEQXFCQztBQUVELFNBQWdCLHdCQUF3QixDQUN0QyxnQkFBMEMsRUFDMUMsS0FBbUIsRUFDbkIsU0FBa0I7SUFFbEIsSUFBTSxDQUFDLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5QyxJQUFJLFNBQVMsRUFBRTtRQUNiLG9CQUFjLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDekM7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFYRCw0REFXQztBQUVELFNBQWdCLGtCQUFrQixDQUNoQyxnQkFBMEMsRUFDMUMsS0FBb0I7SUFFcEIsSUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUQsT0FBTyx3QkFBd0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakUsQ0FBQztBQU5ELGdEQU1DO0FBRUQsWUFBWTtBQUVaLFNBQWdCLHdCQUF3QixDQUN0QyxnQkFBMEMsRUFDMUMsV0FBd0IsRUFDeEIsZUFBd0I7SUFFeEIsSUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELElBQUksZUFBZSxFQUFFO1FBQ25CLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN0QjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVZELDREQVVDO0FBRUQsU0FBZ0Isa0JBQWtCLENBQ2hDLGdCQUEwQyxFQUMxQyxLQUFtQixFQUNuQixnQkFBeUI7SUFFekIsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLElBQU0sS0FBSyxHQUFXLEVBQUUsQ0FBQztJQUN6QixLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUVuQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVCLElBQU0sTUFBTSxHQUFHLG9DQUFpQixDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdkIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDeEI7SUFFRCxJQUFJLGdCQUFnQixFQUFFO1FBQ3BCLG9CQUFjLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDekM7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFyQkQsZ0RBcUJDO0FBRUQsU0FBZ0Isa0JBQWtCLENBQ2hDLGdCQUEwQyxFQUMxQyxXQUF3QixFQUN4QixlQUF3QjtJQUV4QixJQUFNLEtBQUssR0FBRyx3QkFBd0IsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdkYsT0FBTyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQVBELGdEQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGF0aCB9IGZyb20gXCIuLi9QYXRoXCI7XG5pbXBvcnQgeyBQYXRocywgUmVhZG9ubHlQYXRocyB9IGZyb20gXCIuLi9QYXRoc1wiO1xuaW1wb3J0IHsgZnJlZVR5cGVkQXJyYXksIG1hbGxvY0RvdWJsZUFycmF5IH0gZnJvbSBcIi4vbWVtXCI7XG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9OYXRpdmVDbGlwcGVyTGliSW5zdGFuY2VcIjtcbmltcG9ydCB7IE5hdGl2ZVBhdGhzIH0gZnJvbSBcIi4vTmF0aXZlUGF0aHNcIjtcbmltcG9ydCB7IGRvdWJsZUFycmF5VG9QYXRoLCBnZXROb2ZJdGVtc0ZvclBhdGgsIHdyaXRlUGF0aFRvRG91YmxlQXJyYXkgfSBmcm9tIFwiLi9QYXRoVG9OYXRpdmVQYXRoXCI7XG5cbi8vIGpzIHRvIGMrK1xuXG5leHBvcnQgZnVuY3Rpb24gcGF0aHNUb0RvdWJsZUFycmF5KFxuICBuYXRpdmVDbGlwcGVyTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIG15UGF0aHM6IFJlYWRvbmx5UGF0aHNcbik6IEZsb2F0NjRBcnJheSB7XG4gIGNvbnN0IG5vZlBhdGhzID0gbXlQYXRocy5sZW5ndGg7XG5cbiAgLy8gZmlyc3QgY2FsY3VsYXRlIG5vZiBpdGVtcyByZXF1aXJlZFxuICBsZXQgbm9mSXRlbXMgPSAxOyAvLyBmb3IgcGF0aCBjb3VudFxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZlBhdGhzOyBpKyspIHtcbiAgICBub2ZJdGVtcyArPSBnZXROb2ZJdGVtc0ZvclBhdGgobXlQYXRoc1tpXSk7XG4gIH1cbiAgY29uc3QgaGVhcEJ5dGVzID0gbWFsbG9jRG91YmxlQXJyYXkobmF0aXZlQ2xpcHBlckxpYiwgbm9mSXRlbXMpO1xuICBoZWFwQnl0ZXNbMF0gPSBub2ZQYXRocztcblxuICBsZXQgcHRyID0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2ZQYXRoczsgaSsrKSB7XG4gICAgY29uc3QgcGF0aCA9IG15UGF0aHNbaV07XG4gICAgcHRyID0gd3JpdGVQYXRoVG9Eb3VibGVBcnJheShwYXRoLCBoZWFwQnl0ZXMsIHB0cik7XG4gIH1cblxuICByZXR1cm4gaGVhcEJ5dGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG91YmxlQXJyYXlUb05hdGl2ZVBhdGhzKFxuICBuYXRpdmVDbGlwcGVyTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIGFycmF5OiBGbG9hdDY0QXJyYXksXG4gIGZyZWVBcnJheTogYm9vbGVhblxuKTogTmF0aXZlUGF0aHMge1xuICBjb25zdCBwID0gbmV3IG5hdGl2ZUNsaXBwZXJMaWIuUGF0aHMoKTtcbiAgbmF0aXZlQ2xpcHBlckxpYi50b1BhdGhzKHAsIGFycmF5LmJ5dGVPZmZzZXQpO1xuICBpZiAoZnJlZUFycmF5KSB7XG4gICAgZnJlZVR5cGVkQXJyYXkobmF0aXZlQ2xpcHBlckxpYiwgYXJyYXkpO1xuICB9XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0aHNUb05hdGl2ZVBhdGhzKFxuICBuYXRpdmVDbGlwcGVyTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIHBhdGhzOiBSZWFkb25seVBhdGhzXG4pOiBOYXRpdmVQYXRocyB7XG4gIGNvbnN0IGFycmF5ID0gcGF0aHNUb0RvdWJsZUFycmF5KG5hdGl2ZUNsaXBwZXJMaWIsIHBhdGhzKTtcbiAgcmV0dXJuIGRvdWJsZUFycmF5VG9OYXRpdmVQYXRocyhuYXRpdmVDbGlwcGVyTGliLCBhcnJheSwgdHJ1ZSk7XG59XG5cbi8vIGMrKyB0byBqc1xuXG5leHBvcnQgZnVuY3Rpb24gbmF0aXZlUGF0aHNUb0RvdWJsZUFycmF5KFxuICBuYXRpdmVDbGlwcGVyTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIG5hdGl2ZVBhdGhzOiBOYXRpdmVQYXRocyxcbiAgZnJlZU5hdGl2ZVBhdGhzOiBib29sZWFuXG4pOiBGbG9hdDY0QXJyYXkge1xuICBjb25zdCBhcnJheSA9IG5hdGl2ZUNsaXBwZXJMaWIuZnJvbVBhdGhzKG5hdGl2ZVBhdGhzKTtcbiAgaWYgKGZyZWVOYXRpdmVQYXRocykge1xuICAgIG5hdGl2ZVBhdGhzLmRlbGV0ZSgpO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvdWJsZUFycmF5VG9QYXRocyhcbiAgbmF0aXZlQ2xpcHBlckxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxuICBhcnJheTogRmxvYXQ2NEFycmF5LFxuICBfZnJlZURvdWJsZUFycmF5OiBib29sZWFuXG4pOiBQYXRocyB7XG4gIGNvbnN0IGxlbiA9IGFycmF5WzBdO1xuICBjb25zdCBwYXRoczogUGF0aFtdID0gW107XG4gIHBhdGhzLmxlbmd0aCA9IGxlbjtcblxuICBsZXQgYXJyYXlJID0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGRvdWJsZUFycmF5VG9QYXRoKG5hdGl2ZUNsaXBwZXJMaWIsIGFycmF5LCBmYWxzZSwgYXJyYXlJKTtcbiAgICBwYXRoc1tpXSA9IHJlc3VsdC5wYXRoO1xuICAgIGFycmF5SSA9IHJlc3VsdC5wdHJFbmQ7XG4gIH1cblxuICBpZiAoX2ZyZWVEb3VibGVBcnJheSkge1xuICAgIGZyZWVUeXBlZEFycmF5KG5hdGl2ZUNsaXBwZXJMaWIsIGFycmF5KTtcbiAgfVxuXG4gIHJldHVybiBwYXRocztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdGl2ZVBhdGhzVG9QYXRocyhcbiAgbmF0aXZlQ2xpcHBlckxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxuICBuYXRpdmVQYXRoczogTmF0aXZlUGF0aHMsXG4gIGZyZWVOYXRpdmVQYXRoczogYm9vbGVhblxuKTogUGF0aHMge1xuICBjb25zdCBhcnJheSA9IG5hdGl2ZVBhdGhzVG9Eb3VibGVBcnJheShuYXRpdmVDbGlwcGVyTGliLCBuYXRpdmVQYXRocywgZnJlZU5hdGl2ZVBhdGhzKTtcbiAgcmV0dXJuIGRvdWJsZUFycmF5VG9QYXRocyhuYXRpdmVDbGlwcGVyTGliLCBhcnJheSwgdHJ1ZSk7XG59XG4iXX0=