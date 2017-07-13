import { Clipper } from './Clipper';
import { ClipType, PolyFillType, PolyType } from './enums';
import { NativeClipperLibInstance } from './native/NativeClipperLibInstance';
import { Path } from './Path';
import { Paths } from './Paths';
import { PolyTree } from './PolyTree';
import { ClipperError } from './ClipperError';

/**
 * A single subject input (of multiple possible inputs) for the clipToPaths / clipToPolyTree operations
 *
 * 'Subject' paths may be either open (lines) or closed (polygons) or even a mixture of both.
 * With closed paths, orientation should conform with the filling rule that will be passed via Clipper's execute method.
 */
export interface SubjectInput {
  /**
   * Path / Paths data.
   *
   * Path Coordinate range:
   * Path coordinates must be between ± 9007199254740992, otherwise a range error will be thrown when attempting to add the path to the Clipper object.
   * If coordinates can be kept between ± 0x3FFFFFFF (± 1.0e+9), a modest increase in performance (approx. 15-20%) over the larger range can be achieved by
   * avoiding large integer math.
   *
   * The function operation will throw an error if the path is invalid for clipping. A path is invalid for clipping when:
   * - it has less than 2 vertices
   * - it has 2 vertices but is not an open path
   * - the vertices are all co-linear and it is not an open path
   */
  data: Path | Paths;

  /**
   * If the path/paths is closed or not.
   */
  closed: boolean;
}

/**
 * A single clip input (of multiple possible inputs) for the clipToPaths / clipToPolyTree operations.
 *
 * Clipping paths must always be closed. Clipper allows polygons to clip both lines and other polygons, but doesn't allow lines to clip either lines or polygons.
 * With closed paths, orientation should conform with the filling rule that will be passed via Clipper's execute method.
 */
export interface ClipInput {
  /**
   * Path / Paths data.
   *
   * Path Coordinate range:
   * Path coordinates must be between ± 9007199254740992, otherwise a range error will be thrown when attempting to add the path to the Clipper object.
   * If coordinates can be kept between ± 0x3FFFFFFF (± 1.0e+9), a modest increase in performance (approx. 15-20%) over the larger range can be achieved by
   * avoiding large integer math.
   *
   * The function operation will throw an error if the path is invalid for clipping. A path is invalid for clipping when:
   * - it has less than 2 vertices
   * - it has 2 vertices but is not an open path
   * - the vertices are all co-linear and it is not an open path
   */
  data: Path | Paths;
}

/**
 * Data for the clipToPaths / clipToPolyTree operations.
 *
 * Any number of subject and clip paths can be added to a clipping task.
 */
export interface ClipData {
  /**
   * Clipping operation type (Intersection, Union, Difference or Xor).
   */
  clipType: ClipType;

  /**
   * Winding (fill) rule for subject polygons.
   */
  subjectFillType: PolyFillType;

  /**
   * Subject inputs.
   */
  subjectInputs: SubjectInput[];

  /**
   * Winding (fill) rule for clipping polygons.
   */
  clipFillType: PolyFillType;

  /**
   * Clipping inputs.
   */
  clipInputs: ClipInput[];

  /**
   * When this property is set to true, polygons returned in the solution parameter of the execute() method will have orientations opposite to their normal
   * orientations.
   */
  reverseSolution?: boolean;

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
   */
  strictlySimple?: boolean;

  /**
   * By default, when three or more vertices are collinear in input polygons (subject or clip), the Clipper object removes the 'inner' vertices before
   * clipping. When enabled the preserveCollinear property prevents this default behavior to allow these inner vertices to appear in the solution.
   */
  preserveCollinear?: boolean;
}

export function clipToPathsOrPolyTree(polyTreeMode: boolean, nativeClipperLib: NativeClipperLibInstance, data: ClipData): Paths | PolyTree {
  const clipper = new Clipper(nativeClipperLib, data);

  const addPathOrPaths = (inputDatas: (SubjectInput | ClipInput)[] | undefined, polyType: PolyType) => {
    if (inputDatas === undefined) {
      return;
    }

    // add each input
    for (let i = 0, maxi = inputDatas.length; i < maxi; i++) {
      const inputData = inputDatas[i];

      // add the path/paths
      const pathOrPaths = inputData.data;
      if (!pathOrPaths || pathOrPaths.length <= 0) {
        continue;
      }

      const closed = (inputData as SubjectInput).closed === undefined ? true : (inputData as SubjectInput).closed;

      // is it a path or paths?
      if (Array.isArray(pathOrPaths[0])) {
        // paths
        if (!clipper.addPaths(pathOrPaths as Paths, polyType, closed)) {
          throw new ClipperError('invalid paths');
        }
      }
      else {
        // path
        if (!clipper.addPath(pathOrPaths as Path, polyType, closed)) {
          throw new ClipperError('invalid path');
        }
      }
    }
  };

  //noinspection UnusedCatchParameterJS
  try {
    addPathOrPaths(data.subjectInputs, PolyType.Subject);
    addPathOrPaths(data.clipInputs, PolyType.Clip);
    let result;
    if (polyTreeMode) {
      result = clipper.executeToPaths(data.clipType, data.subjectFillType, data.clipFillType);
    }
    else {
      result = clipper.executeToPolyTee(data.clipType, data.subjectFillType, data.clipFillType);
    }
    if (result === undefined) {
      throw new ClipperError('error while performing clipping task');
    }
    return result;
  }
  finally {
    clipper.dispose();
  }
}

export function clipToPaths(nativeClipperLib: NativeClipperLibInstance, data: ClipData): Paths {
  return clipToPathsOrPolyTree(false, nativeClipperLib, data) as Paths;
}

export function clipToPolyTree(nativeClipperLib: NativeClipperLibInstance, data: ClipData): PolyTree {
  return clipToPathsOrPolyTree(true, nativeClipperLib, data) as PolyTree;
}