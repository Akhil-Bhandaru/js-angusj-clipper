"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mem_1 = require("./mem");
var coordsPerPoint = 2;
function getNofItemsForPath(path) {
    return 1 + path.length * coordsPerPoint;
}
exports.getNofItemsForPath = getNofItemsForPath;
// js to c++
function writePathToDoubleArray(path, heapBytes, startPtr) {
    var len = path.length;
    heapBytes[startPtr] = len;
    var arrayI = 1 + startPtr;
    for (var i = 0; i < len; i++) {
        heapBytes[arrayI++] = path[i].x;
        heapBytes[arrayI++] = path[i].y;
    }
    return arrayI;
}
exports.writePathToDoubleArray = writePathToDoubleArray;
function pathToDoubleArray(nativeClipperLib, path) {
    var nofItems = getNofItemsForPath(path);
    var heapBytes = mem_1.mallocDoubleArray(nativeClipperLib, nofItems);
    writePathToDoubleArray(path, heapBytes, 0);
    return heapBytes;
}
exports.pathToDoubleArray = pathToDoubleArray;
function doubleArrayToNativePath(nativeClipperLib, array, freeArray) {
    var p = new nativeClipperLib.Path();
    nativeClipperLib.toPath(p, array.byteOffset);
    if (freeArray) {
        mem_1.freeTypedArray(nativeClipperLib, array);
    }
    return p;
}
exports.doubleArrayToNativePath = doubleArrayToNativePath;
function pathToNativePath(nativeClipperLib, path) {
    var array = pathToDoubleArray(nativeClipperLib, path);
    return doubleArrayToNativePath(nativeClipperLib, array, true);
}
exports.pathToNativePath = pathToNativePath;
// c++ to js
function nativePathToDoubleArray(nativeClipperLib, nativePath, freeNativePath) {
    var array = nativeClipperLib.fromPath(nativePath);
    if (freeNativePath) {
        nativePath.delete();
    }
    return array;
}
exports.nativePathToDoubleArray = nativePathToDoubleArray;
function doubleArrayToPath(nativeClipperLib, array, _freeDoubleArray, startPtr) {
    var len = array[startPtr];
    var path = [];
    path.length = len;
    var arrayI = 1 + startPtr;
    for (var i = 0; i < len; i++) {
        path[i] = {
            x: array[arrayI++],
            y: array[arrayI++]
        };
    }
    if (_freeDoubleArray) {
        mem_1.freeTypedArray(nativeClipperLib, array);
    }
    return {
        path: path,
        ptrEnd: arrayI
    };
}
exports.doubleArrayToPath = doubleArrayToPath;
function nativePathToPath(nativeClipperLib, nativePath, freeNativePath) {
    var array = nativePathToDoubleArray(nativeClipperLib, nativePath, freeNativePath);
    return doubleArrayToPath(nativeClipperLib, array, true, 0).path;
}
exports.nativePathToPath = nativePathToPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF0aFRvTmF0aXZlUGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9uYXRpdmUvUGF0aFRvTmF0aXZlUGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZCQUEwRDtBQUkxRCxJQUFNLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFFekIsU0FBZ0Isa0JBQWtCLENBQUMsSUFBa0I7SUFDbkQsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFDMUMsQ0FBQztBQUZELGdEQUVDO0FBRUQsWUFBWTtBQUVaLFNBQWdCLHNCQUFzQixDQUNwQyxJQUFrQixFQUNsQixTQUF1QixFQUN2QixRQUFnQjtJQUVoQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBRXhCLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUM7SUFFMUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVCLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFoQkQsd0RBZ0JDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQy9CLGdCQUEwQyxFQUMxQyxJQUFrQjtJQUVsQixJQUFNLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxJQUFNLFNBQVMsR0FBRyx1QkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRSxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFSRCw4Q0FRQztBQUVELFNBQWdCLHVCQUF1QixDQUNyQyxnQkFBMEMsRUFDMUMsS0FBbUIsRUFDbkIsU0FBa0I7SUFFbEIsSUFBTSxDQUFDLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QyxJQUFJLFNBQVMsRUFBRTtRQUNiLG9CQUFjLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDekM7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFYRCwwREFXQztBQUVELFNBQWdCLGdCQUFnQixDQUM5QixnQkFBMEMsRUFDMUMsSUFBa0I7SUFFbEIsSUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEQsT0FBTyx1QkFBdUIsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQU5ELDRDQU1DO0FBRUQsWUFBWTtBQUVaLFNBQWdCLHVCQUF1QixDQUNyQyxnQkFBMEMsRUFDMUMsVUFBc0IsRUFDdEIsY0FBdUI7SUFFdkIsSUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BELElBQUksY0FBYyxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNyQjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVZELDBEQVVDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQy9CLGdCQUEwQyxFQUMxQyxLQUFtQixFQUNuQixnQkFBeUIsRUFDekIsUUFBZ0I7SUFFaEIsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVCLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUVsQixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHO1lBQ1IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQixDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ25CLENBQUM7S0FDSDtJQUVELElBQUksZ0JBQWdCLEVBQUU7UUFDcEIsb0JBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6QztJQUVELE9BQU87UUFDTCxJQUFJLEVBQUUsSUFBSTtRQUNWLE1BQU0sRUFBRSxNQUFNO0tBQ2YsQ0FBQztBQUNKLENBQUM7QUExQkQsOENBMEJDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQzlCLGdCQUEwQyxFQUMxQyxVQUFzQixFQUN0QixjQUF1QjtJQUV2QixJQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDcEYsT0FBTyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNsRSxDQUFDO0FBUEQsNENBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYXRoLCBSZWFkb25seVBhdGggfSBmcm9tIFwiLi4vUGF0aFwiO1xuaW1wb3J0IHsgZnJlZVR5cGVkQXJyYXksIG1hbGxvY0RvdWJsZUFycmF5IH0gZnJvbSBcIi4vbWVtXCI7XG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9OYXRpdmVDbGlwcGVyTGliSW5zdGFuY2VcIjtcbmltcG9ydCB7IE5hdGl2ZVBhdGggfSBmcm9tIFwiLi9OYXRpdmVQYXRoXCI7XG5cbmNvbnN0IGNvb3Jkc1BlclBvaW50ID0gMjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZkl0ZW1zRm9yUGF0aChwYXRoOiBSZWFkb25seVBhdGgpOiBudW1iZXIge1xuICByZXR1cm4gMSArIHBhdGgubGVuZ3RoICogY29vcmRzUGVyUG9pbnQ7XG59XG5cbi8vIGpzIHRvIGMrK1xuXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVQYXRoVG9Eb3VibGVBcnJheShcbiAgcGF0aDogUmVhZG9ubHlQYXRoLFxuICBoZWFwQnl0ZXM6IEZsb2F0NjRBcnJheSxcbiAgc3RhcnRQdHI6IG51bWJlclxuKTogbnVtYmVyIHtcbiAgY29uc3QgbGVuID0gcGF0aC5sZW5ndGg7XG5cbiAgaGVhcEJ5dGVzW3N0YXJ0UHRyXSA9IGxlbjtcblxuICBsZXQgYXJyYXlJID0gMSArIHN0YXJ0UHRyO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaGVhcEJ5dGVzW2FycmF5SSsrXSA9IHBhdGhbaV0ueDtcbiAgICBoZWFwQnl0ZXNbYXJyYXlJKytdID0gcGF0aFtpXS55O1xuICB9XG5cbiAgcmV0dXJuIGFycmF5STtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGhUb0RvdWJsZUFycmF5KFxuICBuYXRpdmVDbGlwcGVyTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIHBhdGg6IFJlYWRvbmx5UGF0aFxuKTogRmxvYXQ2NEFycmF5IHtcbiAgY29uc3Qgbm9mSXRlbXMgPSBnZXROb2ZJdGVtc0ZvclBhdGgocGF0aCk7XG4gIGNvbnN0IGhlYXBCeXRlcyA9IG1hbGxvY0RvdWJsZUFycmF5KG5hdGl2ZUNsaXBwZXJMaWIsIG5vZkl0ZW1zKTtcbiAgd3JpdGVQYXRoVG9Eb3VibGVBcnJheShwYXRoLCBoZWFwQnl0ZXMsIDApO1xuICByZXR1cm4gaGVhcEJ5dGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG91YmxlQXJyYXlUb05hdGl2ZVBhdGgoXG4gIG5hdGl2ZUNsaXBwZXJMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcbiAgYXJyYXk6IEZsb2F0NjRBcnJheSxcbiAgZnJlZUFycmF5OiBib29sZWFuXG4pOiBOYXRpdmVQYXRoIHtcbiAgY29uc3QgcCA9IG5ldyBuYXRpdmVDbGlwcGVyTGliLlBhdGgoKTtcbiAgbmF0aXZlQ2xpcHBlckxpYi50b1BhdGgocCwgYXJyYXkuYnl0ZU9mZnNldCk7XG4gIGlmIChmcmVlQXJyYXkpIHtcbiAgICBmcmVlVHlwZWRBcnJheShuYXRpdmVDbGlwcGVyTGliLCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRoVG9OYXRpdmVQYXRoKFxuICBuYXRpdmVDbGlwcGVyTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIHBhdGg6IFJlYWRvbmx5UGF0aFxuKTogTmF0aXZlUGF0aCB7XG4gIGNvbnN0IGFycmF5ID0gcGF0aFRvRG91YmxlQXJyYXkobmF0aXZlQ2xpcHBlckxpYiwgcGF0aCk7XG4gIHJldHVybiBkb3VibGVBcnJheVRvTmF0aXZlUGF0aChuYXRpdmVDbGlwcGVyTGliLCBhcnJheSwgdHJ1ZSk7XG59XG5cbi8vIGMrKyB0byBqc1xuXG5leHBvcnQgZnVuY3Rpb24gbmF0aXZlUGF0aFRvRG91YmxlQXJyYXkoXG4gIG5hdGl2ZUNsaXBwZXJMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcbiAgbmF0aXZlUGF0aDogTmF0aXZlUGF0aCxcbiAgZnJlZU5hdGl2ZVBhdGg6IGJvb2xlYW5cbik6IEZsb2F0NjRBcnJheSB7XG4gIGNvbnN0IGFycmF5ID0gbmF0aXZlQ2xpcHBlckxpYi5mcm9tUGF0aChuYXRpdmVQYXRoKTtcbiAgaWYgKGZyZWVOYXRpdmVQYXRoKSB7XG4gICAgbmF0aXZlUGF0aC5kZWxldGUoKTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3VibGVBcnJheVRvUGF0aChcbiAgbmF0aXZlQ2xpcHBlckxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxuICBhcnJheTogRmxvYXQ2NEFycmF5LFxuICBfZnJlZURvdWJsZUFycmF5OiBib29sZWFuLFxuICBzdGFydFB0cjogbnVtYmVyXG4pOiB7IHBhdGg6IFBhdGg7IHB0ckVuZDogbnVtYmVyIH0ge1xuICBjb25zdCBsZW4gPSBhcnJheVtzdGFydFB0cl07XG4gIGNvbnN0IHBhdGggPSBbXTtcbiAgcGF0aC5sZW5ndGggPSBsZW47XG5cbiAgbGV0IGFycmF5SSA9IDEgKyBzdGFydFB0cjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHBhdGhbaV0gPSB7XG4gICAgICB4OiBhcnJheVthcnJheUkrK10sXG4gICAgICB5OiBhcnJheVthcnJheUkrK11cbiAgICB9O1xuICB9XG5cbiAgaWYgKF9mcmVlRG91YmxlQXJyYXkpIHtcbiAgICBmcmVlVHlwZWRBcnJheShuYXRpdmVDbGlwcGVyTGliLCBhcnJheSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBhdGg6IHBhdGgsXG4gICAgcHRyRW5kOiBhcnJheUlcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdGl2ZVBhdGhUb1BhdGgoXG4gIG5hdGl2ZUNsaXBwZXJMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcbiAgbmF0aXZlUGF0aDogTmF0aXZlUGF0aCxcbiAgZnJlZU5hdGl2ZVBhdGg6IGJvb2xlYW5cbik6IFBhdGgge1xuICBjb25zdCBhcnJheSA9IG5hdGl2ZVBhdGhUb0RvdWJsZUFycmF5KG5hdGl2ZUNsaXBwZXJMaWIsIG5hdGl2ZVBhdGgsIGZyZWVOYXRpdmVQYXRoKTtcbiAgcmV0dXJuIGRvdWJsZUFycmF5VG9QYXRoKG5hdGl2ZUNsaXBwZXJMaWIsIGFycmF5LCB0cnVlLCAwKS5wYXRoO1xufVxuIl19