"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PolyNode_1 = require("./PolyNode");
/**
 * PolyTree is intended as a read-only data structure that should only be used to receive solutions from clipping and offsetting operations. It's an
 * alternative to the Paths data structure which also receives these solutions. PolyTree's two major advantages over the Paths structure are: it properly
 * represents the parent-child relationships of the returned polygons; it differentiates between open and closed paths. However, since PolyTree is a more
 * complex structure than the Paths structure, and since it's more computationally expensive to process (the Execute method being roughly 5-10% slower), it
 * should used only be when parent-child polygon relationships are needed, or when open paths are being 'clipped'.
 *
 * A PolyTree object is a container for any number of PolyNode children, with each contained PolyNode representing a single polygon contour (either an outer
 * or hole polygon). PolyTree itself is a specialized PolyNode whose immediate children represent the top-level outer polygons of the solution. (It's own
 * Contour property is always empty.) The contained top-level PolyNodes may contain their own PolyNode children representing hole polygons that may also
 * contain children representing nested outer polygons etc. Children of outers will always be holes, and children of holes will always be outers.
 *
 * PolyTrees can also contain open paths. Open paths will always be represented by top level PolyNodes. Two functions are provided to quickly separate out
 * open and closed paths from a polytree - openPathsFromPolyTree and closedPathsFromPolyTree.
 */
var PolyTree = /** @class */ (function (_super) {
    __extends(PolyTree, _super);
    function PolyTree() {
        var _this = _super.call(this) || this;
        _this._total = 0;
        return _this;
    }
    Object.defineProperty(PolyTree.prototype, "total", {
        /**
         * Returns the total number of PolyNodes (polygons) contained within the PolyTree. This value is not to be confused with childs.length which returns the
         * number of immediate children only (Childs) contained by PolyTree.
         */
        get: function () {
            return this._total;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method returns the first outer polygon contour if any, otherwise undefined.
     *
     * This function is equivalent to calling childs[0].
     */
    PolyTree.prototype.getFirst = function () {
        if (this.childs.length > 0) {
            return this.childs[0];
        }
        else {
            return undefined;
        }
    };
    /**
     * Internal use.
     * Constructs a PolyTree from a native PolyTree.
     */
    PolyTree.fromNativePolyTree = function (nativeLib, nativePolyTree, freeNativePolyTree) {
        var pt = new PolyTree();
        PolyNode_1.PolyNode.fillFromNativePolyNode(pt, nativeLib, nativePolyTree, undefined, 0, false); // do NOT free them, they are freed on destruction of the polytree
        pt._total = nativePolyTree.total();
        if (freeNativePolyTree) {
            nativePolyTree.delete(); // this deletes all inner paths, contours etc
        }
        return pt;
    };
    return PolyTree;
}(PolyNode_1.PolyNode));
exports.PolyTree = PolyTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seVRyZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUG9seVRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsdUNBQXNDO0FBRXRDOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0g7SUFBOEIsNEJBQVE7SUF3QnBDO1FBQUEsWUFDRSxpQkFBTyxTQUNSO1FBekJTLFlBQU0sR0FBVyxDQUFDLENBQUM7O0lBeUI3QixDQUFDO0lBbkJELHNCQUFJLDJCQUFLO1FBSlQ7OztXQUdHO2FBQ0g7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFFRDs7OztPQUlHO0lBQ0ksMkJBQVEsR0FBZjtRQUNFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsT0FBTyxTQUFTLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBTUQ7OztPQUdHO0lBQ0ksMkJBQWtCLEdBQXpCLFVBQ0UsU0FBbUMsRUFDbkMsY0FBOEIsRUFDOUIsa0JBQTJCO1FBRTNCLElBQU0sRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDMUIsbUJBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsa0VBQWtFO1FBRXZKLEVBQUUsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRW5DLElBQUksa0JBQWtCLEVBQUU7WUFDdEIsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsNkNBQTZDO1NBQ3ZFO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFoREQsQ0FBOEIsbUJBQVEsR0FnRHJDO0FBaERZLDRCQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZVwiO1xuaW1wb3J0IHsgTmF0aXZlUG9seVRyZWUgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlUG9seVRyZWVcIjtcbmltcG9ydCB7IFBvbHlOb2RlIH0gZnJvbSBcIi4vUG9seU5vZGVcIjtcblxuLyoqXG4gKiBQb2x5VHJlZSBpcyBpbnRlbmRlZCBhcyBhIHJlYWQtb25seSBkYXRhIHN0cnVjdHVyZSB0aGF0IHNob3VsZCBvbmx5IGJlIHVzZWQgdG8gcmVjZWl2ZSBzb2x1dGlvbnMgZnJvbSBjbGlwcGluZyBhbmQgb2Zmc2V0dGluZyBvcGVyYXRpb25zLiBJdCdzIGFuXG4gKiBhbHRlcm5hdGl2ZSB0byB0aGUgUGF0aHMgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggYWxzbyByZWNlaXZlcyB0aGVzZSBzb2x1dGlvbnMuIFBvbHlUcmVlJ3MgdHdvIG1ham9yIGFkdmFudGFnZXMgb3ZlciB0aGUgUGF0aHMgc3RydWN0dXJlIGFyZTogaXQgcHJvcGVybHlcbiAqIHJlcHJlc2VudHMgdGhlIHBhcmVudC1jaGlsZCByZWxhdGlvbnNoaXBzIG9mIHRoZSByZXR1cm5lZCBwb2x5Z29uczsgaXQgZGlmZmVyZW50aWF0ZXMgYmV0d2VlbiBvcGVuIGFuZCBjbG9zZWQgcGF0aHMuIEhvd2V2ZXIsIHNpbmNlIFBvbHlUcmVlIGlzIGEgbW9yZVxuICogY29tcGxleCBzdHJ1Y3R1cmUgdGhhbiB0aGUgUGF0aHMgc3RydWN0dXJlLCBhbmQgc2luY2UgaXQncyBtb3JlIGNvbXB1dGF0aW9uYWxseSBleHBlbnNpdmUgdG8gcHJvY2VzcyAodGhlIEV4ZWN1dGUgbWV0aG9kIGJlaW5nIHJvdWdobHkgNS0xMCUgc2xvd2VyKSwgaXRcbiAqIHNob3VsZCB1c2VkIG9ubHkgYmUgd2hlbiBwYXJlbnQtY2hpbGQgcG9seWdvbiByZWxhdGlvbnNoaXBzIGFyZSBuZWVkZWQsIG9yIHdoZW4gb3BlbiBwYXRocyBhcmUgYmVpbmcgJ2NsaXBwZWQnLlxuICpcbiAqIEEgUG9seVRyZWUgb2JqZWN0IGlzIGEgY29udGFpbmVyIGZvciBhbnkgbnVtYmVyIG9mIFBvbHlOb2RlIGNoaWxkcmVuLCB3aXRoIGVhY2ggY29udGFpbmVkIFBvbHlOb2RlIHJlcHJlc2VudGluZyBhIHNpbmdsZSBwb2x5Z29uIGNvbnRvdXIgKGVpdGhlciBhbiBvdXRlclxuICogb3IgaG9sZSBwb2x5Z29uKS4gUG9seVRyZWUgaXRzZWxmIGlzIGEgc3BlY2lhbGl6ZWQgUG9seU5vZGUgd2hvc2UgaW1tZWRpYXRlIGNoaWxkcmVuIHJlcHJlc2VudCB0aGUgdG9wLWxldmVsIG91dGVyIHBvbHlnb25zIG9mIHRoZSBzb2x1dGlvbi4gKEl0J3Mgb3duXG4gKiBDb250b3VyIHByb3BlcnR5IGlzIGFsd2F5cyBlbXB0eS4pIFRoZSBjb250YWluZWQgdG9wLWxldmVsIFBvbHlOb2RlcyBtYXkgY29udGFpbiB0aGVpciBvd24gUG9seU5vZGUgY2hpbGRyZW4gcmVwcmVzZW50aW5nIGhvbGUgcG9seWdvbnMgdGhhdCBtYXkgYWxzb1xuICogY29udGFpbiBjaGlsZHJlbiByZXByZXNlbnRpbmcgbmVzdGVkIG91dGVyIHBvbHlnb25zIGV0Yy4gQ2hpbGRyZW4gb2Ygb3V0ZXJzIHdpbGwgYWx3YXlzIGJlIGhvbGVzLCBhbmQgY2hpbGRyZW4gb2YgaG9sZXMgd2lsbCBhbHdheXMgYmUgb3V0ZXJzLlxuICpcbiAqIFBvbHlUcmVlcyBjYW4gYWxzbyBjb250YWluIG9wZW4gcGF0aHMuIE9wZW4gcGF0aHMgd2lsbCBhbHdheXMgYmUgcmVwcmVzZW50ZWQgYnkgdG9wIGxldmVsIFBvbHlOb2Rlcy4gVHdvIGZ1bmN0aW9ucyBhcmUgcHJvdmlkZWQgdG8gcXVpY2tseSBzZXBhcmF0ZSBvdXRcbiAqIG9wZW4gYW5kIGNsb3NlZCBwYXRocyBmcm9tIGEgcG9seXRyZWUgLSBvcGVuUGF0aHNGcm9tUG9seVRyZWUgYW5kIGNsb3NlZFBhdGhzRnJvbVBvbHlUcmVlLlxuICovXG5leHBvcnQgY2xhc3MgUG9seVRyZWUgZXh0ZW5kcyBQb2x5Tm9kZSB7XG4gIHByb3RlY3RlZCBfdG90YWw6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRvdGFsIG51bWJlciBvZiBQb2x5Tm9kZXMgKHBvbHlnb25zKSBjb250YWluZWQgd2l0aGluIHRoZSBQb2x5VHJlZS4gVGhpcyB2YWx1ZSBpcyBub3QgdG8gYmUgY29uZnVzZWQgd2l0aCBjaGlsZHMubGVuZ3RoIHdoaWNoIHJldHVybnMgdGhlXG4gICAqIG51bWJlciBvZiBpbW1lZGlhdGUgY2hpbGRyZW4gb25seSAoQ2hpbGRzKSBjb250YWluZWQgYnkgUG9seVRyZWUuXG4gICAqL1xuICBnZXQgdG90YWwoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdG90YWw7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3Qgb3V0ZXIgcG9seWdvbiBjb250b3VyIGlmIGFueSwgb3RoZXJ3aXNlIHVuZGVmaW5lZC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBlcXVpdmFsZW50IHRvIGNhbGxpbmcgY2hpbGRzWzBdLlxuICAgKi9cbiAgcHVibGljIGdldEZpcnN0KCk6IFBvbHlOb2RlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5jaGlsZHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIHVzZS5cbiAgICogQ29uc3RydWN0cyBhIFBvbHlUcmVlIGZyb20gYSBuYXRpdmUgUG9seVRyZWUuXG4gICAqL1xuICBzdGF0aWMgZnJvbU5hdGl2ZVBvbHlUcmVlKFxuICAgIG5hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxuICAgIG5hdGl2ZVBvbHlUcmVlOiBOYXRpdmVQb2x5VHJlZSxcbiAgICBmcmVlTmF0aXZlUG9seVRyZWU6IGJvb2xlYW5cbiAgKTogUG9seVRyZWUge1xuICAgIGNvbnN0IHB0ID0gbmV3IFBvbHlUcmVlKCk7XG4gICAgUG9seU5vZGUuZmlsbEZyb21OYXRpdmVQb2x5Tm9kZShwdCwgbmF0aXZlTGliLCBuYXRpdmVQb2x5VHJlZSwgdW5kZWZpbmVkLCAwLCBmYWxzZSk7IC8vIGRvIE5PVCBmcmVlIHRoZW0sIHRoZXkgYXJlIGZyZWVkIG9uIGRlc3RydWN0aW9uIG9mIHRoZSBwb2x5dHJlZVxuXG4gICAgcHQuX3RvdGFsID0gbmF0aXZlUG9seVRyZWUudG90YWwoKTtcblxuICAgIGlmIChmcmVlTmF0aXZlUG9seVRyZWUpIHtcbiAgICAgIG5hdGl2ZVBvbHlUcmVlLmRlbGV0ZSgpOyAvLyB0aGlzIGRlbGV0ZXMgYWxsIGlubmVyIHBhdGhzLCBjb250b3VycyBldGNcbiAgICB9XG5cbiAgICByZXR1cm4gcHQ7XG4gIH1cbn1cbiJdfQ==