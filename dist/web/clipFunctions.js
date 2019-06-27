"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Clipper_1 = require("./Clipper");
var ClipperError_1 = require("./ClipperError");
var enums_1 = require("./enums");
var devMode = typeof "process" !== "undefined" && process.env && process.env.NODE_ENV !== "production";
var addPathOrPaths = function (clipper, inputDatas, polyType) {
    if (inputDatas === undefined) {
        return;
    }
    // add each input
    for (var i = 0, maxi = inputDatas.length; i < maxi; i++) {
        var inputData = inputDatas[i];
        // add the path/paths
        var pathOrPaths = inputData.data;
        if (!pathOrPaths || pathOrPaths.length <= 0) {
            continue;
        }
        var closed_1 = inputData.closed === undefined ? true : inputData.closed;
        // is it a path or paths?
        if (Array.isArray(pathOrPaths[0])) {
            // paths
            if (!clipper.addPaths(pathOrPaths, polyType, closed_1)) {
                throw new ClipperError_1.ClipperError("invalid paths");
            }
        }
        else {
            // path
            if (!clipper.addPath(pathOrPaths, polyType, closed_1)) {
                throw new ClipperError_1.ClipperError("invalid path");
            }
        }
    }
};
function clipToPathsOrPolyTree(polyTreeMode, nativeClipperLib, params) {
    if (devMode) {
        if (!polyTreeMode && params.subjectInputs && params.subjectInputs.some(function (si) { return !si.closed; })) {
            throw new Error("clip to a PolyTree (not to a Path) when using open paths");
        }
    }
    var clipper = new Clipper_1.Clipper(nativeClipperLib, params);
    //noinspection UnusedCatchParameterJS
    try {
        addPathOrPaths(clipper, params.subjectInputs, enums_1.PolyType.Subject);
        addPathOrPaths(clipper, params.clipInputs, enums_1.PolyType.Clip);
        var result = void 0;
        var clipFillType = params.clipFillType === undefined ? params.subjectFillType : params.clipFillType;
        if (!polyTreeMode) {
            result = clipper.executeToPaths(params.clipType, params.subjectFillType, clipFillType, params.cleanDistance);
        }
        else {
            if (params.cleanDistance !== undefined) {
                throw new ClipperError_1.ClipperError("cleaning is not available for poly tree results");
            }
            result = clipper.executeToPolyTee(params.clipType, params.subjectFillType, clipFillType);
        }
        if (result === undefined) {
            throw new ClipperError_1.ClipperError("error while performing clipping task");
        }
        return result;
    }
    finally {
        clipper.dispose();
    }
}
exports.clipToPathsOrPolyTree = clipToPathsOrPolyTree;
function clipToPaths(nativeClipperLib, params) {
    return clipToPathsOrPolyTree(false, nativeClipperLib, params);
}
exports.clipToPaths = clipToPaths;
function clipToPolyTree(nativeClipperLib, params) {
    return clipToPathsOrPolyTree(true, nativeClipperLib, params);
}
exports.clipToPolyTree = clipToPolyTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcEZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGlwRnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQW9DO0FBQ3BDLCtDQUE4QztBQUM5QyxpQ0FBMkQ7QUFNM0QsSUFBTSxPQUFPLEdBQ1gsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDO0FBOEgzRixJQUFNLGNBQWMsR0FBRyxVQUNyQixPQUFnQixFQUNoQixVQUFvRCxFQUNwRCxRQUFrQjtJQUVsQixJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7UUFDNUIsT0FBTztLQUNSO0lBRUQsaUJBQWlCO0lBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkQsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhDLHFCQUFxQjtRQUNyQixJQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDM0MsU0FBUztTQUNWO1FBRUQsSUFBTSxRQUFNLEdBQ1QsU0FBMEIsQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLFNBQTBCLENBQUMsTUFBTSxDQUFDO1FBRS9GLHlCQUF5QjtRQUN6QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDakMsUUFBUTtZQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQW9CLEVBQUUsUUFBUSxFQUFFLFFBQU0sQ0FBQyxFQUFFO2dCQUM3RCxNQUFNLElBQUksMkJBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUN6QztTQUNGO2FBQU07WUFDTCxPQUFPO1lBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBbUIsRUFBRSxRQUFRLEVBQUUsUUFBTSxDQUFDLEVBQUU7Z0JBQzNELE1BQU0sSUFBSSwyQkFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3hDO1NBQ0Y7S0FDRjtBQUNILENBQUMsQ0FBQztBQUVGLFNBQWdCLHFCQUFxQixDQUNuQyxZQUFxQixFQUNyQixnQkFBMEMsRUFDMUMsTUFBa0I7SUFFbEIsSUFBSSxPQUFPLEVBQUU7UUFDWCxJQUFJLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQVYsQ0FBVSxDQUFDLEVBQUU7WUFDMUYsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1NBQzdFO0tBQ0Y7SUFFRCxJQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFdEQscUNBQXFDO0lBQ3JDLElBQUk7UUFDRixjQUFjLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxhQUFhLEVBQUUsZ0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRSxjQUFjLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxJQUFJLE1BQU0sU0FBQSxDQUFDO1FBQ1gsSUFBTSxZQUFZLEdBQ2hCLE1BQU0sQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ25GLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQzdCLE1BQU0sQ0FBQyxRQUFRLEVBQ2YsTUFBTSxDQUFDLGVBQWUsRUFDdEIsWUFBWSxFQUNaLE1BQU0sQ0FBQyxhQUFhLENBQ3JCLENBQUM7U0FDSDthQUFNO1lBQ0wsSUFBSSxNQUFNLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsTUFBTSxJQUFJLDJCQUFZLENBQUMsaURBQWlELENBQUMsQ0FBQzthQUMzRTtZQUNELE1BQU0sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzFGO1FBQ0QsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDaEU7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmO1lBQVM7UUFDUixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDbkI7QUFDSCxDQUFDO0FBeENELHNEQXdDQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxnQkFBMEMsRUFBRSxNQUFrQjtJQUN4RixPQUFPLHFCQUFxQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQVUsQ0FBQztBQUN6RSxDQUFDO0FBRkQsa0NBRUM7QUFFRCxTQUFnQixjQUFjLENBQzVCLGdCQUEwQyxFQUMxQyxNQUFrQjtJQUVsQixPQUFPLHFCQUFxQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQWEsQ0FBQztBQUMzRSxDQUFDO0FBTEQsd0NBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDbGlwcGVyIH0gZnJvbSBcIi4vQ2xpcHBlclwiO1xuaW1wb3J0IHsgQ2xpcHBlckVycm9yIH0gZnJvbSBcIi4vQ2xpcHBlckVycm9yXCI7XG5pbXBvcnQgeyBDbGlwVHlwZSwgUG9seUZpbGxUeXBlLCBQb2x5VHlwZSB9IGZyb20gXCIuL2VudW1zXCI7XG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlXCI7XG5pbXBvcnQgeyBQYXRoLCBSZWFkb25seVBhdGggfSBmcm9tIFwiLi9QYXRoXCI7XG5pbXBvcnQgeyBQYXRocywgUmVhZG9ubHlQYXRocyB9IGZyb20gXCIuL1BhdGhzXCI7XG5pbXBvcnQgeyBQb2x5VHJlZSB9IGZyb20gXCIuL1BvbHlUcmVlXCI7XG5cbmNvbnN0IGRldk1vZGUgPVxuICB0eXBlb2YgXCJwcm9jZXNzXCIgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiO1xuXG4vKipcbiAqIEEgc2luZ2xlIHN1YmplY3QgaW5wdXQgKG9mIG11bHRpcGxlIHBvc3NpYmxlIGlucHV0cykgZm9yIHRoZSBjbGlwVG9QYXRocyAvIGNsaXBUb1BvbHlUcmVlIG9wZXJhdGlvbnNcbiAqXG4gKiAnU3ViamVjdCcgcGF0aHMgbWF5IGJlIGVpdGhlciBvcGVuIChsaW5lcykgb3IgY2xvc2VkIChwb2x5Z29ucykgb3IgZXZlbiBhIG1peHR1cmUgb2YgYm90aC5cbiAqIFdpdGggY2xvc2VkIHBhdGhzLCBvcmllbnRhdGlvbiBzaG91bGQgY29uZm9ybSB3aXRoIHRoZSBmaWxsaW5nIHJ1bGUgdGhhdCB3aWxsIGJlIHBhc3NlZCB2aWEgQ2xpcHBlcidzIGV4ZWN1dGUgbWV0aG9kLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN1YmplY3RJbnB1dCB7XG4gIC8qKlxuICAgKiBQYXRoIC8gUGF0aHMgZGF0YS5cbiAgICpcbiAgICogUGF0aCBDb29yZGluYXRlIHJhbmdlOlxuICAgKiBQYXRoIGNvb3JkaW5hdGVzIG11c3QgYmUgYmV0d2VlbiDCsSA5MDA3MTk5MjU0NzQwOTkxLCBvdGhlcndpc2UgYSByYW5nZSBlcnJvciB3aWxsIGJlIHRocm93biB3aGVuIGF0dGVtcHRpbmcgdG8gYWRkIHRoZSBwYXRoIHRvIHRoZSBDbGlwcGVyIG9iamVjdC5cbiAgICogSWYgY29vcmRpbmF0ZXMgY2FuIGJlIGtlcHQgYmV0d2VlbiDCsSAweDNGRkZGRkZGICjCsSAxLjBlKzkpLCBhIG1vZGVzdCBpbmNyZWFzZSBpbiBwZXJmb3JtYW5jZSAoYXBwcm94LiAxNS0yMCUpIG92ZXIgdGhlIGxhcmdlciByYW5nZSBjYW4gYmUgYWNoaWV2ZWQgYnlcbiAgICogYXZvaWRpbmcgbGFyZ2UgaW50ZWdlciBtYXRoLlxuICAgKlxuICAgKiBUaGUgZnVuY3Rpb24gb3BlcmF0aW9uIHdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHBhdGggaXMgaW52YWxpZCBmb3IgY2xpcHBpbmcuIEEgcGF0aCBpcyBpbnZhbGlkIGZvciBjbGlwcGluZyB3aGVuOlxuICAgKiAtIGl0IGhhcyBsZXNzIHRoYW4gMiB2ZXJ0aWNlc1xuICAgKiAtIGl0IGhhcyAyIHZlcnRpY2VzIGJ1dCBpcyBub3QgYW4gb3BlbiBwYXRoXG4gICAqIC0gdGhlIHZlcnRpY2VzIGFyZSBhbGwgY28tbGluZWFyIGFuZCBpdCBpcyBub3QgYW4gb3BlbiBwYXRoXG4gICAqL1xuICBkYXRhOiBSZWFkb25seVBhdGggfCBSZWFkb25seVBhdGhzO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgcGF0aC9wYXRocyBpcyBjbG9zZWQgb3Igbm90LlxuICAgKi9cbiAgY2xvc2VkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgc2luZ2xlIGNsaXAgaW5wdXQgKG9mIG11bHRpcGxlIHBvc3NpYmxlIGlucHV0cykgZm9yIHRoZSBjbGlwVG9QYXRocyAvIGNsaXBUb1BvbHlUcmVlIG9wZXJhdGlvbnMuXG4gKlxuICogQ2xpcHBpbmcgcGF0aHMgbXVzdCBhbHdheXMgYmUgY2xvc2VkLiBDbGlwcGVyIGFsbG93cyBwb2x5Z29ucyB0byBjbGlwIGJvdGggbGluZXMgYW5kIG90aGVyIHBvbHlnb25zLCBidXQgZG9lc24ndCBhbGxvdyBsaW5lcyB0byBjbGlwIGVpdGhlciBsaW5lcyBvciBwb2x5Z29ucy5cbiAqIFdpdGggY2xvc2VkIHBhdGhzLCBvcmllbnRhdGlvbiBzaG91bGQgY29uZm9ybSB3aXRoIHRoZSBmaWxsaW5nIHJ1bGUgdGhhdCB3aWxsIGJlIHBhc3NlZCB2aWEgQ2xpcHBlcidzIGV4ZWN1dGUgbWV0aG9kLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsaXBJbnB1dCB7XG4gIC8qKlxuICAgKiBQYXRoIC8gUGF0aHMgZGF0YS5cbiAgICpcbiAgICogUGF0aCBDb29yZGluYXRlIHJhbmdlOlxuICAgKiBQYXRoIGNvb3JkaW5hdGVzIG11c3QgYmUgYmV0d2VlbiDCsSA5MDA3MTk5MjU0NzQwOTkxLCBvdGhlcndpc2UgYSByYW5nZSBlcnJvciB3aWxsIGJlIHRocm93biB3aGVuIGF0dGVtcHRpbmcgdG8gYWRkIHRoZSBwYXRoIHRvIHRoZSBDbGlwcGVyIG9iamVjdC5cbiAgICogSWYgY29vcmRpbmF0ZXMgY2FuIGJlIGtlcHQgYmV0d2VlbiDCsSAweDNGRkZGRkZGICjCsSAxLjBlKzkpLCBhIG1vZGVzdCBpbmNyZWFzZSBpbiBwZXJmb3JtYW5jZSAoYXBwcm94LiAxNS0yMCUpIG92ZXIgdGhlIGxhcmdlciByYW5nZSBjYW4gYmUgYWNoaWV2ZWQgYnlcbiAgICogYXZvaWRpbmcgbGFyZ2UgaW50ZWdlciBtYXRoLlxuICAgKlxuICAgKiBUaGUgZnVuY3Rpb24gb3BlcmF0aW9uIHdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHBhdGggaXMgaW52YWxpZCBmb3IgY2xpcHBpbmcuIEEgcGF0aCBpcyBpbnZhbGlkIGZvciBjbGlwcGluZyB3aGVuOlxuICAgKiAtIGl0IGhhcyBsZXNzIHRoYW4gMiB2ZXJ0aWNlc1xuICAgKiAtIGl0IGhhcyAyIHZlcnRpY2VzIGJ1dCBpcyBub3QgYW4gb3BlbiBwYXRoXG4gICAqIC0gdGhlIHZlcnRpY2VzIGFyZSBhbGwgY28tbGluZWFyIGFuZCBpdCBpcyBub3QgYW4gb3BlbiBwYXRoXG4gICAqL1xuICBkYXRhOiBSZWFkb25seVBhdGggfCBSZWFkb25seVBhdGhzO1xufVxuXG4vKipcbiAqIFBhcmFtcyBmb3IgdGhlIGNsaXBUb1BhdGhzIC8gY2xpcFRvUG9seVRyZWUgb3BlcmF0aW9ucy5cbiAqXG4gKiBBbnkgbnVtYmVyIG9mIHN1YmplY3QgYW5kIGNsaXAgcGF0aHMgY2FuIGJlIGFkZGVkIHRvIGEgY2xpcHBpbmcgdGFzay5cbiAqXG4gKiBCb29sZWFuIChjbGlwcGluZykgb3BlcmF0aW9ucyBhcmUgbW9zdGx5IGFwcGxpZWQgdG8gdHdvIHNldHMgb2YgUG9seWdvbnMsIHJlcHJlc2VudGVkIGluIHRoaXMgbGlicmFyeSBhcyBzdWJqZWN0IGFuZCBjbGlwIHBvbHlnb25zLiBXaGVuZXZlciBQb2x5Z29uc1xuICogYXJlIGFkZGVkIHRvIHRoZSBDbGlwcGVyIG9iamVjdCwgdGhleSBtdXN0IGJlIGFzc2lnbmVkIHRvIGVpdGhlciBzdWJqZWN0IG9yIGNsaXAgcG9seWdvbnMuXG4gKlxuICogVU5JT04gb3BlcmF0aW9ucyBjYW4gYmUgcGVyZm9ybWVkIG9uIG9uZSBzZXQgb3IgYm90aCBzZXRzIG9mIHBvbHlnb25zLCBidXQgYWxsIG90aGVyIGJvb2xlYW4gb3BlcmF0aW9ucyByZXF1aXJlIGJvdGggc2V0cyBvZiBwb2x5Z29ucyB0byBkZXJpdmVcbiAqIG1lYW5pbmdmdWwgc29sdXRpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsaXBQYXJhbXMge1xuICAvKipcbiAgICogQ2xpcHBpbmcgb3BlcmF0aW9uIHR5cGUgKEludGVyc2VjdGlvbiwgVW5pb24sIERpZmZlcmVuY2Ugb3IgWG9yKS5cbiAgICovXG4gIGNsaXBUeXBlOiBDbGlwVHlwZTtcblxuICAvKipcbiAgICogV2luZGluZyAoZmlsbCkgcnVsZSBmb3Igc3ViamVjdCBwb2x5Z29ucy5cbiAgICovXG4gIHN1YmplY3RGaWxsVHlwZTogUG9seUZpbGxUeXBlO1xuXG4gIC8qKlxuICAgKiBTdWJqZWN0IGlucHV0cy5cbiAgICovXG4gIHN1YmplY3RJbnB1dHM6IFN1YmplY3RJbnB1dFtdO1xuXG4gIC8qKlxuICAgKiBXaW5kaW5nIChmaWxsKSBydWxlIGZvciBjbGlwcGluZyBwb2x5Z29ucy4gSWYgbWlzc2luZyBpdCB3aWxsIHVzZSB0aGUgc2FtZSBvbmUgYXMgc3ViamVjdEZpbGxUeXBlLlxuICAgKi9cbiAgY2xpcEZpbGxUeXBlPzogUG9seUZpbGxUeXBlO1xuXG4gIC8qKlxuICAgKiBDbGlwcGluZyBpbnB1dHMuIE5vdCByZXF1aXJlZCBmb3IgdW5pb24gb3BlcmF0aW9ucywgcmVxdWlyZWQgZm9yIG90aGVycy5cbiAgICovXG4gIGNsaXBJbnB1dHM/OiBDbGlwSW5wdXRbXTtcblxuICAvKipcbiAgICogV2hlbiB0aGlzIHByb3BlcnR5IGlzIHNldCB0byB0cnVlLCBwb2x5Z29ucyByZXR1cm5lZCBpbiB0aGUgc29sdXRpb24gcGFyYW1ldGVyIG9mIHRoZSBjbGlwIG1ldGhvZCB3aWxsIGhhdmUgb3JpZW50YXRpb25zIG9wcG9zaXRlIHRvIHRoZWlyIG5vcm1hbFxuICAgKiBvcmllbnRhdGlvbnMuXG4gICAqL1xuICByZXZlcnNlU29sdXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUZXJtaW5vbG9neTpcbiAgICogLSBBIHNpbXBsZSBwb2x5Z29uIGlzIG9uZSB0aGF0IGRvZXMgbm90IHNlbGYtaW50ZXJzZWN0LlxuICAgKiAtIEEgd2Vha2x5IHNpbXBsZSBwb2x5Z29uIGlzIGEgc2ltcGxlIHBvbHlnb24gdGhhdCBjb250YWlucyAndG91Y2hpbmcnIHZlcnRpY2VzLCBvciAndG91Y2hpbmcnIGVkZ2VzLlxuICAgKiAtIEEgc3RyaWN0bHkgc2ltcGxlIHBvbHlnb24gaXMgYSBzaW1wbGUgcG9seWdvbiB0aGF0IGRvZXMgbm90IGNvbnRhaW4gJ3RvdWNoaW5nJyB2ZXJ0aWNlcywgb3IgJ3RvdWNoaW5nJyBlZGdlcy5cbiAgICpcbiAgICogVmVydGljZXMgJ3RvdWNoJyBpZiB0aGV5IHNoYXJlIHRoZSBzYW1lIGNvb3JkaW5hdGVzIChhbmQgYXJlIG5vdCBhZGphY2VudCkuIEFuIGVkZ2UgdG91Y2hlcyBhbm90aGVyIGlmIG9uZSBvZiBpdHMgZW5kIHZlcnRpY2VzIHRvdWNoZXMgYW5vdGhlciBlZGdlXG4gICAqIGV4Y2x1ZGluZyBpdHMgYWRqYWNlbnQgZWRnZXMsIG9yIGlmIHRoZXkgYXJlIGNvLWxpbmVhciBhbmQgb3ZlcmxhcHBpbmcgKGluY2x1ZGluZyBhZGphY2VudCBlZGdlcykuXG4gICAqXG4gICAqIFBvbHlnb25zIHJldHVybmVkIGJ5IGNsaXBwaW5nIG9wZXJhdGlvbnMgKHNlZSBDbGlwcGVyLmV4ZWN1dGUoKSkgc2hvdWxkIGFsd2F5cyBiZSBzaW1wbGUgcG9seWdvbnMuIFdoZW4gdGhlIFN0cmljdGx5U2ltcGx5IHByb3BlcnR5IGlzIGVuYWJsZWQsXG4gICAqIHBvbHlnb25zIHJldHVybmVkIHdpbGwgYmUgc3RyaWN0bHkgc2ltcGxlLCBvdGhlcndpc2UgdGhleSBtYXkgYmUgd2Vha2x5IHNpbXBsZS4gSXQncyBjb21wdXRhdGlvbmFsbHkgZXhwZW5zaXZlIGVuc3VyaW5nIHBvbHlnb25zIGFyZSBzdHJpY3RseSBzaW1wbGVcbiAgICogYW5kIHNvIHRoaXMgcHJvcGVydHkgaXMgZGlzYWJsZWQgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogTm90ZTogVGhlcmUncyBjdXJyZW50bHkgbm8gZ3VhcmFudGVlIHRoYXQgcG9seWdvbnMgd2lsbCBiZSBzdHJpY3RseSBzaW1wbGUgc2luY2UgJ3NpbXBsaWZ5aW5nJyBpcyBzdGlsbCBhIHdvcmsgaW4gcHJvZ3Jlc3MuXG4gICAqL1xuICBzdHJpY3RseVNpbXBsZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIHdoZW4gdGhyZWUgb3IgbW9yZSB2ZXJ0aWNlcyBhcmUgY29sbGluZWFyIGluIGlucHV0IHBvbHlnb25zIChzdWJqZWN0IG9yIGNsaXApLCB0aGUgQ2xpcHBlciBvYmplY3QgcmVtb3ZlcyB0aGUgJ2lubmVyJyB2ZXJ0aWNlcyBiZWZvcmVcbiAgICogY2xpcHBpbmcuIFdoZW4gZW5hYmxlZCB0aGUgcHJlc2VydmVDb2xsaW5lYXIgcHJvcGVydHkgcHJldmVudHMgdGhpcyBkZWZhdWx0IGJlaGF2aW9yIHRvIGFsbG93IHRoZXNlIGlubmVyIHZlcnRpY2VzIHRvIGFwcGVhciBpbiB0aGUgc29sdXRpb24uXG4gICAqL1xuICBwcmVzZXJ2ZUNvbGxpbmVhcj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgaXMgbm90IHVuZGVmaW5lZCB0aGVuIGNsZWFuaW5nIG9mIHRoZSByZXN1bHQgcG9seWdvbiB3aWxsIGJlIHBlcmZvcm1lZC5cbiAgICogVGhpcyBvcGVyYXRpb24gaXMgb25seSBhdmFpbGFibGUgd2hlbiB0aGUgb3V0cHV0IGZvcm1hdCBpcyBub3QgYSBwb2x5IHRyZWUuXG4gICAqL1xuICBjbGVhbkRpc3RhbmNlPzogbnVtYmVyO1xufVxuXG5jb25zdCBhZGRQYXRoT3JQYXRocyA9IChcbiAgY2xpcHBlcjogQ2xpcHBlcixcbiAgaW5wdXREYXRhczogKFN1YmplY3RJbnB1dCB8IENsaXBJbnB1dClbXSB8IHVuZGVmaW5lZCxcbiAgcG9seVR5cGU6IFBvbHlUeXBlXG4pID0+IHtcbiAgaWYgKGlucHV0RGF0YXMgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGFkZCBlYWNoIGlucHV0XG4gIGZvciAobGV0IGkgPSAwLCBtYXhpID0gaW5wdXREYXRhcy5sZW5ndGg7IGkgPCBtYXhpOyBpKyspIHtcbiAgICBjb25zdCBpbnB1dERhdGEgPSBpbnB1dERhdGFzW2ldO1xuXG4gICAgLy8gYWRkIHRoZSBwYXRoL3BhdGhzXG4gICAgY29uc3QgcGF0aE9yUGF0aHMgPSBpbnB1dERhdGEuZGF0YTtcbiAgICBpZiAoIXBhdGhPclBhdGhzIHx8IHBhdGhPclBhdGhzLmxlbmd0aCA8PSAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjbG9zZWQgPVxuICAgICAgKGlucHV0RGF0YSBhcyBTdWJqZWN0SW5wdXQpLmNsb3NlZCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IChpbnB1dERhdGEgYXMgU3ViamVjdElucHV0KS5jbG9zZWQ7XG5cbiAgICAvLyBpcyBpdCBhIHBhdGggb3IgcGF0aHM/XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGF0aE9yUGF0aHNbMF0pKSB7XG4gICAgICAvLyBwYXRoc1xuICAgICAgaWYgKCFjbGlwcGVyLmFkZFBhdGhzKHBhdGhPclBhdGhzIGFzIFBhdGhzLCBwb2x5VHlwZSwgY2xvc2VkKSkge1xuICAgICAgICB0aHJvdyBuZXcgQ2xpcHBlckVycm9yKFwiaW52YWxpZCBwYXRoc1wiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGF0aFxuICAgICAgaWYgKCFjbGlwcGVyLmFkZFBhdGgocGF0aE9yUGF0aHMgYXMgUGF0aCwgcG9seVR5cGUsIGNsb3NlZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IENsaXBwZXJFcnJvcihcImludmFsaWQgcGF0aFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGlwVG9QYXRoc09yUG9seVRyZWUoXG4gIHBvbHlUcmVlTW9kZTogYm9vbGVhbixcbiAgbmF0aXZlQ2xpcHBlckxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxuICBwYXJhbXM6IENsaXBQYXJhbXNcbik6IFBhdGhzIHwgUG9seVRyZWUge1xuICBpZiAoZGV2TW9kZSkge1xuICAgIGlmICghcG9seVRyZWVNb2RlICYmIHBhcmFtcy5zdWJqZWN0SW5wdXRzICYmIHBhcmFtcy5zdWJqZWN0SW5wdXRzLnNvbWUoKHNpKSA9PiAhc2kuY2xvc2VkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2xpcCB0byBhIFBvbHlUcmVlIChub3QgdG8gYSBQYXRoKSB3aGVuIHVzaW5nIG9wZW4gcGF0aHNcIik7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgY2xpcHBlciA9IG5ldyBDbGlwcGVyKG5hdGl2ZUNsaXBwZXJMaWIsIHBhcmFtcyk7XG5cbiAgLy9ub2luc3BlY3Rpb24gVW51c2VkQ2F0Y2hQYXJhbWV0ZXJKU1xuICB0cnkge1xuICAgIGFkZFBhdGhPclBhdGhzKGNsaXBwZXIsIHBhcmFtcy5zdWJqZWN0SW5wdXRzLCBQb2x5VHlwZS5TdWJqZWN0KTtcbiAgICBhZGRQYXRoT3JQYXRocyhjbGlwcGVyLCBwYXJhbXMuY2xpcElucHV0cywgUG9seVR5cGUuQ2xpcCk7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBjb25zdCBjbGlwRmlsbFR5cGUgPVxuICAgICAgcGFyYW1zLmNsaXBGaWxsVHlwZSA9PT0gdW5kZWZpbmVkID8gcGFyYW1zLnN1YmplY3RGaWxsVHlwZSA6IHBhcmFtcy5jbGlwRmlsbFR5cGU7XG4gICAgaWYgKCFwb2x5VHJlZU1vZGUpIHtcbiAgICAgIHJlc3VsdCA9IGNsaXBwZXIuZXhlY3V0ZVRvUGF0aHMoXG4gICAgICAgIHBhcmFtcy5jbGlwVHlwZSxcbiAgICAgICAgcGFyYW1zLnN1YmplY3RGaWxsVHlwZSxcbiAgICAgICAgY2xpcEZpbGxUeXBlLFxuICAgICAgICBwYXJhbXMuY2xlYW5EaXN0YW5jZVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBhcmFtcy5jbGVhbkRpc3RhbmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IENsaXBwZXJFcnJvcihcImNsZWFuaW5nIGlzIG5vdCBhdmFpbGFibGUgZm9yIHBvbHkgdHJlZSByZXN1bHRzXCIpO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gY2xpcHBlci5leGVjdXRlVG9Qb2x5VGVlKHBhcmFtcy5jbGlwVHlwZSwgcGFyYW1zLnN1YmplY3RGaWxsVHlwZSwgY2xpcEZpbGxUeXBlKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgQ2xpcHBlckVycm9yKFwiZXJyb3Igd2hpbGUgcGVyZm9ybWluZyBjbGlwcGluZyB0YXNrXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGZpbmFsbHkge1xuICAgIGNsaXBwZXIuZGlzcG9zZSgpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGlwVG9QYXRocyhuYXRpdmVDbGlwcGVyTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsIHBhcmFtczogQ2xpcFBhcmFtcyk6IFBhdGhzIHtcbiAgcmV0dXJuIGNsaXBUb1BhdGhzT3JQb2x5VHJlZShmYWxzZSwgbmF0aXZlQ2xpcHBlckxpYiwgcGFyYW1zKSBhcyBQYXRocztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsaXBUb1BvbHlUcmVlKFxuICBuYXRpdmVDbGlwcGVyTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gIHBhcmFtczogQ2xpcFBhcmFtc1xuKTogUG9seVRyZWUge1xuICByZXR1cm4gY2xpcFRvUGF0aHNPclBvbHlUcmVlKHRydWUsIG5hdGl2ZUNsaXBwZXJMaWIsIHBhcmFtcykgYXMgUG9seVRyZWU7XG59XG4iXX0=