"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathToNativePath_1 = require("./native/PathToNativePath");
/**
 * PolyNodes are encapsulated within a PolyTree container, and together provide a data structure representing the parent-child relationships of polygon
 * contours returned by clipping/ofsetting methods.
 *
 * A PolyNode object represents a single polygon. It's isHole property indicates whether it's an outer or a hole. PolyNodes may own any number of PolyNode
 * children (childs), where children of outer polygons are holes, and children of holes are (nested) outer polygons.
 */
var PolyNode = /** @class */ (function () {
    function PolyNode() {
        this._childs = [];
        this._contour = [];
        this._isOpen = false;
        this._index = 0;
    }
    Object.defineProperty(PolyNode.prototype, "parent", {
        /**
         * Returns the parent PolyNode.
         *
         * The PolyTree object (which is also a PolyNode) does not have a parent and will return undefined.
         */
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "childs", {
        /**
         * A read-only list of PolyNode.
         * Outer PolyNode childs contain hole PolyNodes, and hole PolyNode childs contain nested outer PolyNodes.
         */
        get: function () {
            return this._childs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "contour", {
        /**
         * Returns a path list which contains any number of vertices.
         */
        get: function () {
            return this._contour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "isOpen", {
        /**
         * Returns true when the PolyNode's Contour results from a clipping operation on an open contour (path). Only top-level PolyNodes can contain open contours.
         */
        get: function () {
            return this._isOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "index", {
        /**
         * Index in the parent's child list, or 0 if no parent.
         */
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "isHole", {
        /**
         * Returns true when the PolyNode's polygon (Contour) is a hole.
         *
         * Children of outer polygons are always holes, and children of holes are always (nested) outer polygons.
         * The isHole property of a PolyTree object is undefined but its children are always top-level outer polygons.
         *
         * @return {boolean}
         */
        get: function () {
            if (this._isHole === undefined) {
                var result = true;
                var node = this._parent;
                while (node !== undefined) {
                    result = !result;
                    node = node._parent;
                }
                this._isHole = result;
            }
            return this._isHole;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The returned PolyNode will be the first child if any, otherwise the next sibling, otherwise the next sibling of the Parent etc.
     *
     * A PolyTree can be traversed very easily by calling GetFirst() followed by GetNext() in a loop until the returned object is undefined.
     *
     * @return {PolyNode | undefined}
     */
    PolyNode.prototype.getNext = function () {
        if (this._childs.length > 0) {
            return this._childs[0];
        }
        else {
            return this.getNextSiblingUp();
        }
    };
    PolyNode.prototype.getNextSiblingUp = function () {
        if (this._parent === undefined) {
            return undefined;
        }
        else if (this._index === this._parent._childs.length - 1) {
            //noinspection TailRecursionJS
            return this._parent.getNextSiblingUp();
        }
        else {
            return this._parent._childs[this._index + 1];
        }
    };
    PolyNode.fillFromNativePolyNode = function (pn, nativeLib, nativePolyNode, parent, childIndex, freeNativePolyNode) {
        pn._parent = parent;
        var childs = nativePolyNode.childs;
        for (var i = 0, max = childs.size(); i < max; i++) {
            var newChild = PolyNode.fromNativePolyNode(nativeLib, childs.get(i), pn, i, freeNativePolyNode);
            pn._childs.push(newChild);
        }
        // do we need to clear the object ourselves? for now let's assume so (seems to work)
        pn._contour = PathToNativePath_1.nativePathToPath(nativeLib, nativePolyNode.contour, true);
        pn._isOpen = nativePolyNode.isOpen();
        pn._index = childIndex;
        if (freeNativePolyNode) {
            nativePolyNode.delete();
        }
    };
    PolyNode.fromNativePolyNode = function (nativeLib, nativePolyNode, parent, childIndex, freeNativePolyNode) {
        var pn = new PolyNode();
        PolyNode.fillFromNativePolyNode(pn, nativeLib, nativePolyNode, parent, childIndex, freeNativePolyNode);
        return pn;
    };
    return PolyNode;
}());
exports.PolyNode = PolyNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seU5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUG9seU5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw4REFBNkQ7QUFHN0Q7Ozs7OztHQU1HO0FBQ0g7SUE4RkU7UUFsRlUsWUFBTyxHQUFlLEVBQUUsQ0FBQztRQVN6QixhQUFRLEdBQWlCLEVBQUUsQ0FBQztRQVE1QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBUXpCLFdBQU0sR0FBVyxDQUFDLENBQUM7SUF5REosQ0FBQztJQXRGMUIsc0JBQUksNEJBQU07UUFMVjs7OztXQUlHO2FBQ0g7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFPRCxzQkFBSSw0QkFBTTtRQUpWOzs7V0FHRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksNkJBQU87UUFIWDs7V0FFRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksNEJBQU07UUFIVjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksMkJBQUs7UUFIVDs7V0FFRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBV0Qsc0JBQUksNEJBQU07UUFSVjs7Ozs7OztXQU9HO2FBQ0g7WUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO2dCQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLElBQUksSUFBSSxHQUF5QixJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM5QyxPQUFPLElBQUksS0FBSyxTQUFTLEVBQUU7b0JBQ3pCLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDakIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7aUJBQ3JCO2dCQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO2FBQ3ZCO1lBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsMEJBQU8sR0FBUDtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFUyxtQ0FBZ0IsR0FBMUI7UUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQzlCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDMUQsOEJBQThCO1lBQzlCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3hDO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBSWdCLCtCQUFzQixHQUF2QyxVQUNFLEVBQVksRUFDWixTQUFtQyxFQUNuQyxjQUE4QixFQUM5QixNQUE0QixFQUM1QixVQUFrQixFQUNsQixrQkFBMkI7UUFFM0IsRUFBRSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFcEIsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUMxQyxTQUFTLEVBQ1QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFDYixFQUFFLEVBQ0YsQ0FBQyxFQUNELGtCQUFrQixDQUNuQixDQUFDO1lBQ0YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDM0I7UUFFRCxvRkFBb0Y7UUFDcEYsRUFBRSxDQUFDLFFBQVEsR0FBRyxtQ0FBZ0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RSxFQUFFLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyQyxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUV2QixJQUFJLGtCQUFrQixFQUFFO1lBQ3RCLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFZ0IsMkJBQWtCLEdBQW5DLFVBQ0UsU0FBbUMsRUFDbkMsY0FBOEIsRUFDOUIsTUFBNEIsRUFDNUIsVUFBa0IsRUFDbEIsa0JBQTJCO1FBRTNCLElBQU0sRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDMUIsUUFBUSxDQUFDLHNCQUFzQixDQUM3QixFQUFFLEVBQ0YsU0FBUyxFQUNULGNBQWMsRUFDZCxNQUFNLEVBQ04sVUFBVSxFQUNWLGtCQUFrQixDQUNuQixDQUFDO1FBQ0YsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFsSkQsSUFrSkM7QUFsSlksNEJBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlXCI7XG5pbXBvcnQgeyBOYXRpdmVQb2x5Tm9kZSB9IGZyb20gXCIuL25hdGl2ZS9OYXRpdmVQb2x5Tm9kZVwiO1xuaW1wb3J0IHsgbmF0aXZlUGF0aFRvUGF0aCB9IGZyb20gXCIuL25hdGl2ZS9QYXRoVG9OYXRpdmVQYXRoXCI7XG5pbXBvcnQgeyBSZWFkb25seVBhdGggfSBmcm9tIFwiLi9QYXRoXCI7XG5cbi8qKlxuICogUG9seU5vZGVzIGFyZSBlbmNhcHN1bGF0ZWQgd2l0aGluIGEgUG9seVRyZWUgY29udGFpbmVyLCBhbmQgdG9nZXRoZXIgcHJvdmlkZSBhIGRhdGEgc3RydWN0dXJlIHJlcHJlc2VudGluZyB0aGUgcGFyZW50LWNoaWxkIHJlbGF0aW9uc2hpcHMgb2YgcG9seWdvblxuICogY29udG91cnMgcmV0dXJuZWQgYnkgY2xpcHBpbmcvb2ZzZXR0aW5nIG1ldGhvZHMuXG4gKlxuICogQSBQb2x5Tm9kZSBvYmplY3QgcmVwcmVzZW50cyBhIHNpbmdsZSBwb2x5Z29uLiBJdCdzIGlzSG9sZSBwcm9wZXJ0eSBpbmRpY2F0ZXMgd2hldGhlciBpdCdzIGFuIG91dGVyIG9yIGEgaG9sZS4gUG9seU5vZGVzIG1heSBvd24gYW55IG51bWJlciBvZiBQb2x5Tm9kZVxuICogY2hpbGRyZW4gKGNoaWxkcyksIHdoZXJlIGNoaWxkcmVuIG9mIG91dGVyIHBvbHlnb25zIGFyZSBob2xlcywgYW5kIGNoaWxkcmVuIG9mIGhvbGVzIGFyZSAobmVzdGVkKSBvdXRlciBwb2x5Z29ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBvbHlOb2RlIHtcbiAgcHJvdGVjdGVkIF9wYXJlbnQ/OiBQb2x5Tm9kZTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcGFyZW50IFBvbHlOb2RlLlxuICAgKlxuICAgKiBUaGUgUG9seVRyZWUgb2JqZWN0ICh3aGljaCBpcyBhbHNvIGEgUG9seU5vZGUpIGRvZXMgbm90IGhhdmUgYSBwYXJlbnQgYW5kIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC5cbiAgICovXG4gIGdldCBwYXJlbnQoKTogUG9seU5vZGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NoaWxkczogUG9seU5vZGVbXSA9IFtdO1xuICAvKipcbiAgICogQSByZWFkLW9ubHkgbGlzdCBvZiBQb2x5Tm9kZS5cbiAgICogT3V0ZXIgUG9seU5vZGUgY2hpbGRzIGNvbnRhaW4gaG9sZSBQb2x5Tm9kZXMsIGFuZCBob2xlIFBvbHlOb2RlIGNoaWxkcyBjb250YWluIG5lc3RlZCBvdXRlciBQb2x5Tm9kZXMuXG4gICAqL1xuICBnZXQgY2hpbGRzKCk6IFBvbHlOb2RlW10ge1xuICAgIHJldHVybiB0aGlzLl9jaGlsZHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbnRvdXI6IFJlYWRvbmx5UGF0aCA9IFtdO1xuICAvKipcbiAgICogUmV0dXJucyBhIHBhdGggbGlzdCB3aGljaCBjb250YWlucyBhbnkgbnVtYmVyIG9mIHZlcnRpY2VzLlxuICAgKi9cbiAgZ2V0IGNvbnRvdXIoKTogUmVhZG9ubHlQYXRoIHtcbiAgICByZXR1cm4gdGhpcy5fY29udG91cjtcbiAgfVxuXG4gIHByb3RlY3RlZCBfaXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgd2hlbiB0aGUgUG9seU5vZGUncyBDb250b3VyIHJlc3VsdHMgZnJvbSBhIGNsaXBwaW5nIG9wZXJhdGlvbiBvbiBhbiBvcGVuIGNvbnRvdXIgKHBhdGgpLiBPbmx5IHRvcC1sZXZlbCBQb2x5Tm9kZXMgY2FuIGNvbnRhaW4gb3BlbiBjb250b3Vycy5cbiAgICovXG4gIGdldCBpc09wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzT3BlbjtcbiAgfVxuXG4gIHByb3RlY3RlZCBfaW5kZXg6IG51bWJlciA9IDA7XG4gIC8qKlxuICAgKiBJbmRleCBpbiB0aGUgcGFyZW50J3MgY2hpbGQgbGlzdCwgb3IgMCBpZiBubyBwYXJlbnQuXG4gICAqL1xuICBnZXQgaW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5faW5kZXg7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2lzSG9sZT86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgd2hlbiB0aGUgUG9seU5vZGUncyBwb2x5Z29uIChDb250b3VyKSBpcyBhIGhvbGUuXG4gICAqXG4gICAqIENoaWxkcmVuIG9mIG91dGVyIHBvbHlnb25zIGFyZSBhbHdheXMgaG9sZXMsIGFuZCBjaGlsZHJlbiBvZiBob2xlcyBhcmUgYWx3YXlzIChuZXN0ZWQpIG91dGVyIHBvbHlnb25zLlxuICAgKiBUaGUgaXNIb2xlIHByb3BlcnR5IG9mIGEgUG9seVRyZWUgb2JqZWN0IGlzIHVuZGVmaW5lZCBidXQgaXRzIGNoaWxkcmVuIGFyZSBhbHdheXMgdG9wLWxldmVsIG91dGVyIHBvbHlnb25zLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGlzSG9sZSgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5faXNIb2xlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgICAgbGV0IG5vZGU6IFBvbHlOb2RlIHwgdW5kZWZpbmVkID0gdGhpcy5fcGFyZW50O1xuICAgICAgd2hpbGUgKG5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXN1bHQgPSAhcmVzdWx0O1xuICAgICAgICBub2RlID0gbm9kZS5fcGFyZW50O1xuICAgICAgfVxuICAgICAgdGhpcy5faXNIb2xlID0gcmVzdWx0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9pc0hvbGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJldHVybmVkIFBvbHlOb2RlIHdpbGwgYmUgdGhlIGZpcnN0IGNoaWxkIGlmIGFueSwgb3RoZXJ3aXNlIHRoZSBuZXh0IHNpYmxpbmcsIG90aGVyd2lzZSB0aGUgbmV4dCBzaWJsaW5nIG9mIHRoZSBQYXJlbnQgZXRjLlxuICAgKlxuICAgKiBBIFBvbHlUcmVlIGNhbiBiZSB0cmF2ZXJzZWQgdmVyeSBlYXNpbHkgYnkgY2FsbGluZyBHZXRGaXJzdCgpIGZvbGxvd2VkIGJ5IEdldE5leHQoKSBpbiBhIGxvb3AgdW50aWwgdGhlIHJldHVybmVkIG9iamVjdCBpcyB1bmRlZmluZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge1BvbHlOb2RlIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0TmV4dCgpOiBQb2x5Tm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuX2NoaWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2hpbGRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXROZXh0U2libGluZ1VwKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldE5leHRTaWJsaW5nVXAoKTogUG9seU5vZGUgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLl9wYXJlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2luZGV4ID09PSB0aGlzLl9wYXJlbnQuX2NoaWxkcy5sZW5ndGggLSAxKSB7XG4gICAgICAvL25vaW5zcGVjdGlvbiBUYWlsUmVjdXJzaW9uSlNcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQuZ2V0TmV4dFNpYmxpbmdVcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50Ll9jaGlsZHNbdGhpcy5faW5kZXggKyAxXTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoKSB7fVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZmlsbEZyb21OYXRpdmVQb2x5Tm9kZShcbiAgICBwbjogUG9seU5vZGUsXG4gICAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gICAgbmF0aXZlUG9seU5vZGU6IE5hdGl2ZVBvbHlOb2RlLFxuICAgIHBhcmVudDogUG9seU5vZGUgfCB1bmRlZmluZWQsXG4gICAgY2hpbGRJbmRleDogbnVtYmVyLFxuICAgIGZyZWVOYXRpdmVQb2x5Tm9kZTogYm9vbGVhblxuICApOiB2b2lkIHtcbiAgICBwbi5fcGFyZW50ID0gcGFyZW50O1xuXG4gICAgY29uc3QgY2hpbGRzID0gbmF0aXZlUG9seU5vZGUuY2hpbGRzO1xuICAgIGZvciAobGV0IGkgPSAwLCBtYXggPSBjaGlsZHMuc2l6ZSgpOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgIGNvbnN0IG5ld0NoaWxkID0gUG9seU5vZGUuZnJvbU5hdGl2ZVBvbHlOb2RlKFxuICAgICAgICBuYXRpdmVMaWIsXG4gICAgICAgIGNoaWxkcy5nZXQoaSksXG4gICAgICAgIHBuLFxuICAgICAgICBpLFxuICAgICAgICBmcmVlTmF0aXZlUG9seU5vZGVcbiAgICAgICk7XG4gICAgICBwbi5fY2hpbGRzLnB1c2gobmV3Q2hpbGQpO1xuICAgIH1cblxuICAgIC8vIGRvIHdlIG5lZWQgdG8gY2xlYXIgdGhlIG9iamVjdCBvdXJzZWx2ZXM/IGZvciBub3cgbGV0J3MgYXNzdW1lIHNvIChzZWVtcyB0byB3b3JrKVxuICAgIHBuLl9jb250b3VyID0gbmF0aXZlUGF0aFRvUGF0aChuYXRpdmVMaWIsIG5hdGl2ZVBvbHlOb2RlLmNvbnRvdXIsIHRydWUpO1xuICAgIHBuLl9pc09wZW4gPSBuYXRpdmVQb2x5Tm9kZS5pc09wZW4oKTtcbiAgICBwbi5faW5kZXggPSBjaGlsZEluZGV4O1xuXG4gICAgaWYgKGZyZWVOYXRpdmVQb2x5Tm9kZSkge1xuICAgICAgbmF0aXZlUG9seU5vZGUuZGVsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBmcm9tTmF0aXZlUG9seU5vZGUoXG4gICAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXG4gICAgbmF0aXZlUG9seU5vZGU6IE5hdGl2ZVBvbHlOb2RlLFxuICAgIHBhcmVudDogUG9seU5vZGUgfCB1bmRlZmluZWQsXG4gICAgY2hpbGRJbmRleDogbnVtYmVyLFxuICAgIGZyZWVOYXRpdmVQb2x5Tm9kZTogYm9vbGVhblxuICApOiBQb2x5Tm9kZSB7XG4gICAgY29uc3QgcG4gPSBuZXcgUG9seU5vZGUoKTtcbiAgICBQb2x5Tm9kZS5maWxsRnJvbU5hdGl2ZVBvbHlOb2RlKFxuICAgICAgcG4sXG4gICAgICBuYXRpdmVMaWIsXG4gICAgICBuYXRpdmVQb2x5Tm9kZSxcbiAgICAgIHBhcmVudCxcbiAgICAgIGNoaWxkSW5kZXgsXG4gICAgICBmcmVlTmF0aXZlUG9seU5vZGVcbiAgICApO1xuICAgIHJldHVybiBwbjtcbiAgfVxufVxuIl19