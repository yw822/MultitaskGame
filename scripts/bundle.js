(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Version 0.5.0 - Copyright 2012 - 2015 -  Jim Riecken <jimr@jimr.ca>
//
// Released under the MIT License - https://github.com/jriecken/sat-js
//
// A simple library for determining intersections of circles and
// polygons using the Separating Axis Theorem.
/** @preserve SAT.js - Version 0.5.0 - Copyright 2012 - 2015 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

/*global define: false, module: false*/
/*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true, 
  eqeqeq:true, bitwise:true, strict:true, undef:true, 
  curly:true, browser:true */

// Create a UMD wrapper for SAT. Works in:
//
//  - Plain browser via global SAT variable
//  - AMD loader (like require.js)
//  - Node.js
//
// The quoted properties all over the place are used so that the Closure Compiler
// does not mangle the exposed API in advanced mode.
/**
 * @param {*} root - The global scope
 * @param {Function} factory - Factory that creates SAT module
 */
(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define['amd']) {
    define(factory);
  } else if (typeof exports === 'object') {
    module['exports'] = factory();
  } else {
    root['SAT'] = factory();
  }
}(this, function () {
  "use strict";

  var SAT = {};

  //
  // ## Vector
  //
  // Represents a vector in two dimensions with `x` and `y` properties.


  // Create a new Vector, optionally passing in the `x` and `y` coordinates. If
  // a coordinate is not specified, it will be set to `0`
  /** 
   * @param {?number=} x The x position.
   * @param {?number=} y The y position.
   * @constructor
   */
  function Vector(x, y) {
    this['x'] = x || 0;
    this['y'] = y || 0;
  }
  SAT['Vector'] = Vector;
  // Alias `Vector` as `V`
  SAT['V'] = Vector;


  // Copy the values of another Vector into this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['copy'] = Vector.prototype.copy = function(other) {
    this['x'] = other['x'];
    this['y'] = other['y'];
    return this;
  };

  // Create a new vector with the same coordinates as this on.
  /**
   * @return {Vector} The new cloned vector
   */
  Vector.prototype['clone'] = Vector.prototype.clone = function() {
    return new Vector(this['x'], this['y']);
  };

  // Change this vector to be perpendicular to what it was before. (Effectively
  // roatates it 90 degrees in a clockwise direction)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['perp'] = Vector.prototype.perp = function() {
    var x = this['x'];
    this['x'] = this['y'];
    this['y'] = -x;
    return this;
  };

  // Rotate this vector (counter-clockwise) by the specified angle (in radians).
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Vector} This for chaining.
   */
  Vector.prototype['rotate'] = Vector.prototype.rotate = function (angle) {
    var x = this['x'];
    var y = this['y'];
    this['x'] = x * Math.cos(angle) - y * Math.sin(angle);
    this['y'] = x * Math.sin(angle) + y * Math.cos(angle);
    return this;
  };

  // Reverse this vector.
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reverse'] = Vector.prototype.reverse = function() {
    this['x'] = -this['x'];
    this['y'] = -this['y'];
    return this;
  };
  

  // Normalize this vector.  (make it have length of `1`)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['normalize'] = Vector.prototype.normalize = function() {
    var d = this.len();
    if(d > 0) {
      this['x'] = this['x'] / d;
      this['y'] = this['y'] / d;
    }
    return this;
  };
  
  // Add another vector to this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['add'] = Vector.prototype.add = function(other) {
    this['x'] += other['x'];
    this['y'] += other['y'];
    return this;
  };
  
  // Subtract another vector from this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaiing.
   */
  Vector.prototype['sub'] = Vector.prototype.sub = function(other) {
    this['x'] -= other['x'];
    this['y'] -= other['y'];
    return this;
  };
  
  // Scale this vector. An independant scaling factor can be provided
  // for each axis, or a single scaling factor that will scale both `x` and `y`.
  /**
   * @param {number} x The scaling factor in the x direction.
   * @param {?number=} y The scaling factor in the y direction.  If this
   *   is not specified, the x scaling factor will be used.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['scale'] = Vector.prototype.scale = function(x,y) {
    this['x'] *= x;
    this['y'] *= y || x;
    return this; 
  };
  
  // Project this vector on to another vector.
  /**
   * @param {Vector} other The vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['project'] = Vector.prototype.project = function(other) {
    var amt = this.dot(other) / other.len2();
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };
  
  // Project this vector onto a vector of unit length. This is slightly more efficient
  // than `project` when dealing with unit vectors.
  /**
   * @param {Vector} other The unit vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['projectN'] = Vector.prototype.projectN = function(other) {
    var amt = this.dot(other);
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };
  
  // Reflect this vector on an arbitrary axis.
  /**
   * @param {Vector} axis The vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflect'] = Vector.prototype.reflect = function(axis) {
    var x = this['x'];
    var y = this['y'];
    this.project(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };
  
  // Reflect this vector on an arbitrary axis (represented by a unit vector). This is
  // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
  /**
   * @param {Vector} axis The unit vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflectN'] = Vector.prototype.reflectN = function(axis) {
    var x = this['x'];
    var y = this['y'];
    this.projectN(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };
  
  // Get the dot product of this vector and another.
  /**
   * @param {Vector}  other The vector to dot this one against.
   * @return {number} The dot product.
   */
  Vector.prototype['dot'] = Vector.prototype.dot = function(other) {
    return this['x'] * other['x'] + this['y'] * other['y'];
  };
  
  // Get the squared length of this vector.
  /**
   * @return {number} The length^2 of this vector.
   */
  Vector.prototype['len2'] = Vector.prototype.len2 = function() {
    return this.dot(this);
  };
  
  // Get the length of this vector.
  /**
   * @return {number} The length of this vector.
   */
  Vector.prototype['len'] = Vector.prototype.len = function() {
    return Math.sqrt(this.len2());
  };
  
  // ## Circle
  //
  // Represents a circle with a position and a radius.

  // Create a new circle, optionally passing in a position and/or radius. If no position
  // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
  // have a radius of `0`.
  /**
   * @param {Vector=} pos A vector representing the position of the center of the circle
   * @param {?number=} r The radius of the circle
   * @constructor
   */
  function Circle(pos, r) {
    this['pos'] = pos || new Vector();
    this['r'] = r || 0;
  }
  SAT['Circle'] = Circle;
  
  // Compute the axis-aligned bounding box (AABB) of this Circle.
  //
  // Note: Returns a _new_ `Polygon` each time you call this.
  /**
   * @return {Polygon} The AABB
   */
  Circle.prototype['getAABB'] = Circle.prototype.getAABB = function() {
    var r = this['r'];
    var corner = this["pos"].clone().sub(new Vector(r, r));
    return new Box(corner, r*2, r*2).toPolygon();
  };

  // ## Polygon
  //
  // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
  //
  // Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the
  // provided setters. Otherwise the calculated properties will not be updated correctly.
  //
  // `pos` can be changed directly.

  // Create a new polygon, passing in a position vector, and an array of points (represented
  // by vectors relative to the position vector). If no position is passed in, the position
  // of the polygon will be `(0,0)`.
  /**
   * @param {Vector=} pos A vector representing the origin of the polygon. (all other
   *   points are relative to this one)
   * @param {Array.<Vector>=} points An array of vectors representing the points in the polygon,
   *   in counter-clockwise order.
   * @constructor
   */
  function Polygon(pos, points) {
    this['pos'] = pos || new Vector();
    this['angle'] = 0;
    this['offset'] = new Vector();
    this.setPoints(points || []);
  }
  SAT['Polygon'] = Polygon;
  
  // Set the points of the polygon.
  /**
   * @param {Array.<Vector>=} points An array of vectors representing the points in the polygon,
   *   in counter-clockwise order.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setPoints'] = Polygon.prototype.setPoints = function(points) {
    // Only re-allocate if this is a new polygon or the number of points has changed.
    var lengthChanged = !this['points'] || this['points'].length !== points.length;
    if (lengthChanged) {
      var i;
      var calcPoints = this['calcPoints'] = [];
      var edges = this['edges'] = [];
      var normals = this['normals'] = [];
      // Allocate the vector arrays for the calculated properties
      for (i = 0; i < points.length; i++) {
        calcPoints.push(new Vector());
        edges.push(new Vector());
        normals.push(new Vector());
      }
    }
    this['points'] = points;
    this._recalc();
    return this;
  };

  // Set the current rotation angle of the polygon.
  /**
   * @param {number} angle The current rotation angle (in radians).
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setAngle'] = Polygon.prototype.setAngle = function(angle) {
    this['angle'] = angle;
    this._recalc();
    return this;
  };

  // Set the current offset to apply to the `points` before applying the `angle` rotation.
  /**
   * @param {Vector} offset The new offset vector.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setOffset'] = Polygon.prototype.setOffset = function(offset) {
    this['offset'] = offset;
    this._recalc();
    return this;
  };

  // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
  //
  // Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['rotate'] = Polygon.prototype.rotate = function(angle) {
    var points = this['points'];
    var len = points.length;
    for (var i = 0; i < len; i++) {
      points[i].rotate(angle);
    }
    this._recalc();
    return this;
  };

  // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
  // system* (i.e. `pos`).
  //
  // This is most useful to change the "center point" of a polygon. If you just want to move the whole polygon, change
  // the coordinates of `pos`.
  //
  // Note: This changes the **original** points (so any `offset` will be applied on top of this translation)
  /**
   * @param {number} x The horizontal amount to translate.
   * @param {number} y The vertical amount to translate.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['translate'] = Polygon.prototype.translate = function (x, y) {
    var points = this['points'];
    var len = points.length;
    for (var i = 0; i < len; i++) {
      points[i].x += x;
      points[i].y += y;
    }
    this._recalc();
    return this;
  };


  // Computes the calculated collision polygon. Applies the `angle` and `offset` to the original points then recalculates the
  // edges and normals of the collision polygon.
  /**
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype._recalc = function() {
    // Calculated points - this is what is used for underlying collisions and takes into account
    // the angle/offset set on the polygon.
    var calcPoints = this['calcPoints'];
    // The edges here are the direction of the `n`th edge of the polygon, relative to
    // the `n`th point. If you want to draw a given edge from the edge value, you must
    // first translate to the position of the starting point.
    var edges = this['edges'];
    // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
    // to the position of the `n`th point. If you want to draw an edge normal, you must first
    // translate to the position of the starting point.
    var normals = this['normals'];
    // Copy the original points array and apply the offset/angle
    var points = this['points'];
    var offset = this['offset'];
    var angle = this['angle'];
    var len = points.length;
    var i;
    for (i = 0; i < len; i++) {
      var calcPoint = calcPoints[i].copy(points[i]);
      calcPoint.x += offset.x;
      calcPoint.y += offset.y;
      if (angle !== 0) {
        calcPoint.rotate(angle);
      }
    }
    // Calculate the edges/normals
    for (i = 0; i < len; i++) {
      var p1 = calcPoints[i];
      var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
      var e = edges[i].copy(p2).sub(p1);
      normals[i].copy(e).perp().normalize();
    }
    return this;
  };
  
  
  // Compute the axis-aligned bounding box. Any current state
  // (translations/rotations) will be applied before constructing the AABB.
  //
  // Note: Returns a _new_ `Polygon` each time you call this.
  /**
   * @return {Polygon} The AABB
   */
  Polygon.prototype["getAABB"] = Polygon.prototype.getAABB = function() {
    var points = this["calcPoints"];
    var len = points.length;
    var xMin = points[0]["x"];
    var yMin = points[0]["y"];
    var xMax = points[0]["x"];
    var yMax = points[0]["y"];
    for (var i = 1; i < len; i++) {
      var point = points[i];
      if (point["x"] < xMin) {
        xMin = point["x"];
      }
      else if (point["x"] > xMax) {
        xMax = point["x"];
      }
      if (point["y"] < yMin) {
        yMin = point["y"];
      }
      else if (point["y"] > yMax) {
        yMax = point["y"];
      }
    }
    return new Box(this["pos"].clone().add(new Vector(xMin, yMin)), xMax - xMin, yMax - yMin).toPolygon();
  };
  

  // ## Box
  //
  // Represents an axis-aligned box, with a width and height.


  // Create a new box, with the specified position, width, and height. If no position
  // is given, the position will be `(0,0)`. If no width or height are given, they will
  // be set to `0`.
  /**
   * @param {Vector=} pos A vector representing the top-left of the box.
   * @param {?number=} w The width of the box.
   * @param {?number=} h The height of the box.
   * @constructor
   */
  function Box(pos, w, h) {
    this['pos'] = pos || new Vector();
    this['w'] = w || 0;
    this['h'] = h || 0;
  }
  SAT['Box'] = Box;

  // Returns a polygon whose edges are the same as this box.
  /**
   * @return {Polygon} A new Polygon that represents this box.
   */
  Box.prototype['toPolygon'] = Box.prototype.toPolygon = function() {
    var pos = this['pos'];
    var w = this['w'];
    var h = this['h'];
    return new Polygon(new Vector(pos['x'], pos['y']), [
     new Vector(), new Vector(w, 0), 
     new Vector(w,h), new Vector(0,h)
    ]);
  };
  
  // ## Response
  //
  // An object representing the result of an intersection. Contains:
  //  - The two objects participating in the intersection
  //  - The vector representing the minimum change necessary to extract the first object
  //    from the second one (as well as a unit vector in that direction and the magnitude
  //    of the overlap)
  //  - Whether the first object is entirely inside the second, and vice versa.
  /**
   * @constructor
   */  
  function Response() {
    this['a'] = null;
    this['b'] = null;
    this['overlapN'] = new Vector();
    this['overlapV'] = new Vector();
    this.clear();
  }
  SAT['Response'] = Response;

  // Set some values of the response back to their defaults.  Call this between tests if
  // you are going to reuse a single Response object for multiple intersection tests (recommented
  // as it will avoid allcating extra memory)
  /**
   * @return {Response} This for chaining
   */
  Response.prototype['clear'] = Response.prototype.clear = function() {
    this['aInB'] = true;
    this['bInA'] = true;
    this['overlap'] = Number.MAX_VALUE;
    return this;
  };

  // ## Object Pools

  // A pool of `Vector` objects that are used in calculations to avoid
  // allocating memory.
  /**
   * @type {Array.<Vector>}
   */
  var T_VECTORS = [];
  for (var i = 0; i < 10; i++) { T_VECTORS.push(new Vector()); }
  
  // A pool of arrays of numbers used in calculations to avoid allocating
  // memory.
  /**
   * @type {Array.<Array.<number>>}
   */
  var T_ARRAYS = [];
  for (var i = 0; i < 5; i++) { T_ARRAYS.push([]); }

  // Temporary response used for polygon hit detection.
  /**
   * @type {Response}
   */
  var T_RESPONSE = new Response();

  // Unit square polygon used for polygon hit detection.
  /**
   * @type {Polygon}
   */
  var UNIT_SQUARE = new Box(new Vector(), 1, 1).toPolygon();

  // ## Helper Functions

  // Flattens the specified array of points onto a unit vector axis,
  // resulting in a one dimensional range of the minimum and
  // maximum value on that axis.
  /**
   * @param {Array.<Vector>} points The points to flatten.
   * @param {Vector} normal The unit vector axis to flatten on.
   * @param {Array.<number>} result An array.  After calling this function,
   *   result[0] will be the minimum value,
   *   result[1] will be the maximum value.
   */
  function flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++ ) {
      // The magnitude of the projection of the point onto the normal
      var dot = points[i].dot(normal);
      if (dot < min) { min = dot; }
      if (dot > max) { max = dot; }
    }
    result[0] = min; result[1] = max;
  }
  
  // Check whether two convex polygons are separated by the specified
  // axis (must be a unit vector).
  /**
   * @param {Vector} aPos The position of the first polygon.
   * @param {Vector} bPos The position of the second polygon.
   * @param {Array.<Vector>} aPoints The points in the first polygon.
   * @param {Array.<Vector>} bPoints The points in the second polygon.
   * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
   *   will be projected onto this axis.
   * @param {Response=} response A Response object (optional) which will be populated
   *   if the axis is not a separating axis.
   * @return {boolean} true if it is a separating axis, false otherwise.  If false,
   *   and a response is passed in, information about how much overlap and
   *   the direction of the overlap will be populated.
   */
  function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
    var rangeA = T_ARRAYS.pop();
    var rangeB = T_ARRAYS.pop();
    // The magnitude of the offset between the two polygons
    var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
    var projectedOffset = offsetV.dot(axis);
    // Project the polygons onto the axis.
    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
      T_VECTORS.push(offsetV); 
      T_ARRAYS.push(rangeA); 
      T_ARRAYS.push(rangeB);
      return true;
    }
    // This is not a separating axis. If we're calculating a response, calculate the overlap.
    if (response) {
      var overlap = 0;
      // A starts further left than B
      if (rangeA[0] < rangeB[0]) {
        response['aInB'] = false;
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) { 
          overlap = rangeA[1] - rangeB[0];
          response['bInA'] = false;
        // B is fully inside A.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      // B starts further left than A
      } else {
        response['bInA'] = false;
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) { 
          overlap = rangeA[0] - rangeB[1];
          response['aInB'] = false;
        // A is fully inside B.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      }
      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
      var absOverlap = Math.abs(overlap);
      if (absOverlap < response['overlap']) {
        response['overlap'] = absOverlap;
        response['overlapN'].copy(axis);
        if (overlap < 0) {
          response['overlapN'].reverse();
        }
      }      
    }
    T_VECTORS.push(offsetV); 
    T_ARRAYS.push(rangeA); 
    T_ARRAYS.push(rangeB);
    return false;
  }
  
  // Calculates which Vornoi region a point is on a line segment.
  // It is assumed that both the line and the point are relative to `(0,0)`
  //
  //            |       (0)      |
  //     (-1)  [S]--------------[E]  (1)
  //            |       (0)      |
  /**
   * @param {Vector} line The line segment.
   * @param {Vector} point The point.
   * @return  {number} LEFT_VORNOI_REGION (-1) if it is the left region, 
   *          MIDDLE_VORNOI_REGION (0) if it is the middle region, 
   *          RIGHT_VORNOI_REGION (1) if it is the right region.
   */
  function vornoiRegion(line, point) {
    var len2 = line.len2();
    var dp = point.dot(line);
    // If the point is beyond the start of the line, it is in the
    // left vornoi region.
    if (dp < 0) { return LEFT_VORNOI_REGION; }
    // If the point is beyond the end of the line, it is in the
    // right vornoi region.
    else if (dp > len2) { return RIGHT_VORNOI_REGION; }
    // Otherwise, it's in the middle one.
    else { return MIDDLE_VORNOI_REGION; }
  }
  // Constants for Vornoi regions
  /**
   * @const
   */
  var LEFT_VORNOI_REGION = -1;
  /**
   * @const
   */
  var MIDDLE_VORNOI_REGION = 0;
  /**
   * @const
   */
  var RIGHT_VORNOI_REGION = 1;
  
  // ## Collision Tests

  // Check if a point is inside a circle.
  /**
   * @param {Vector} p The point to test.
   * @param {Circle} c The circle to test.
   * @return {boolean} true if the point is inside the circle, false if it is not.
   */
  function pointInCircle(p, c) {
    var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']);
    var radiusSq = c['r'] * c['r'];
    var distanceSq = differenceV.len2();
    T_VECTORS.push(differenceV);
    // If the distance between is smaller than the radius then the point is inside the circle.
    return distanceSq <= radiusSq;
  }
  SAT['pointInCircle'] = pointInCircle;

  // Check if a point is inside a convex polygon.
  /**
   * @param {Vector} p The point to test.
   * @param {Polygon} poly The polygon to test.
   * @return {boolean} true if the point is inside the polygon, false if it is not.
   */
  function pointInPolygon(p, poly) {
    UNIT_SQUARE['pos'].copy(p);
    T_RESPONSE.clear();
    var result = testPolygonPolygon(UNIT_SQUARE, poly, T_RESPONSE);
    if (result) {
      result = T_RESPONSE['aInB'];
    }
    return result;
  }
  SAT['pointInPolygon'] = pointInPolygon;

  // Check if two circles collide.
  /**
   * @param {Circle} a The first circle.
   * @param {Circle} b The second circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   the circles intersect.
   * @return {boolean} true if the circles intersect, false if they don't. 
   */
  function testCircleCircle(a, b, response) {
    // Check if the distance between the centers of the two
    // circles is greater than their combined radius.
    var differenceV = T_VECTORS.pop().copy(b['pos']).sub(a['pos']);
    var totalRadius = a['r'] + b['r'];
    var totalRadiusSq = totalRadius * totalRadius;
    var distanceSq = differenceV.len2();
    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
      T_VECTORS.push(differenceV);
      return false;
    }
    // They intersect.  If we're calculating a response, calculate the overlap.
    if (response) { 
      var dist = Math.sqrt(distanceSq);
      response['a'] = a;
      response['b'] = b;
      response['overlap'] = totalRadius - dist;
      response['overlapN'].copy(differenceV.normalize());
      response['overlapV'].copy(differenceV).scale(response['overlap']);
      response['aInB']= a['r'] <= b['r'] && dist <= b['r'] - a['r'];
      response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];
    }
    T_VECTORS.push(differenceV);
    return true;
  }
  SAT['testCircleCircle'] = testCircleCircle;
  
  // Check if a polygon and a circle collide.
  /**
   * @param {Polygon} polygon The polygon.
   * @param {Circle} circle The circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonCircle(polygon, circle, response) {
    // Get the position of the circle relative to the polygon.
    var circlePos = T_VECTORS.pop().copy(circle['pos']).sub(polygon['pos']);
    var radius = circle['r'];
    var radius2 = radius * radius;
    var points = polygon['calcPoints'];
    var len = points.length;
    var edge = T_VECTORS.pop();
    var point = T_VECTORS.pop();
    
    // For each edge in the polygon:
    for (var i = 0; i < len; i++) {
      var next = i === len - 1 ? 0 : i + 1;
      var prev = i === 0 ? len - 1 : i - 1;
      var overlap = 0;
      var overlapN = null;
      
      // Get the edge.
      edge.copy(polygon['edges'][i]);
      // Calculate the center of the circle relative to the starting point of the edge.
      point.copy(circlePos).sub(points[i]);
      
      // If the distance between the center of the circle and the point
      // is bigger than the radius, the polygon is definitely not fully in
      // the circle.
      if (response && point.len2() > radius2) {
        response['aInB'] = false;
      }
      
      // Calculate which Vornoi region the center of the circle is in.
      var region = vornoiRegion(edge, point);
      // If it's the left region:
      if (region === LEFT_VORNOI_REGION) { 
        // We need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
        edge.copy(polygon['edges'][prev]);
        // Calculate the center of the circle relative the starting point of the previous edge
        var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
        region = vornoiRegion(edge, point2);
        if (region === RIGHT_VORNOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos); 
            T_VECTORS.push(edge);
            T_VECTORS.push(point); 
            T_VECTORS.push(point2);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        T_VECTORS.push(point2);
      // If it's the right region:
      } else if (region === RIGHT_VORNOI_REGION) {
        // We need to make sure we're in the left region on the next edge
        edge.copy(polygon['edges'][next]);
        // Calculate the center of the circle relative to the starting point of the next edge.
        point.copy(circlePos).sub(points[next]);
        region = vornoiRegion(edge, point);
        if (region === LEFT_VORNOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos); 
            T_VECTORS.push(edge); 
            T_VECTORS.push(point);
            return false;              
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
      // Otherwise, it's the middle region:
      } else {
        // Need to check if the circle is intersecting the edge,
        // Change the edge into its "edge normal".
        var normal = edge.perp().normalize();
        // Find the perpendicular distance between the center of the 
        // circle and the edge.
        var dist = point.dot(normal);
        var distAbs = Math.abs(dist);
        // If the circle is on the outside of the edge, there is no intersection.
        if (dist > 0 && distAbs > radius) {
          // No intersection
          T_VECTORS.push(circlePos); 
          T_VECTORS.push(normal); 
          T_VECTORS.push(point);
          return false;
        } else if (response) {
          // It intersects, calculate the overlap.
          overlapN = normal;
          overlap = radius - dist;
          // If the center of the circle is on the outside of the edge, or part of the
          // circle is on the outside, the circle is not fully inside the polygon.
          if (dist >= 0 || overlap < 2 * radius) {
            response['bInA'] = false;
          }
        }
      }
      
      // If this is the smallest overlap we've seen, keep it. 
      // (overlapN may be null if the circle was in the wrong Vornoi region).
      if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {
        response['overlap'] = overlap;
        response['overlapN'].copy(overlapN);
      }
    }
    
    // Calculate the final overlap vector - based on the smallest overlap.
    if (response) {
      response['a'] = polygon;
      response['b'] = circle;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    T_VECTORS.push(circlePos); 
    T_VECTORS.push(edge); 
    T_VECTORS.push(point);
    return true;
  }
  SAT['testPolygonCircle'] = testPolygonCircle;
  
  // Check if a circle and a polygon collide.
  //
  // **NOTE:** This is slightly less efficient than polygonCircle as it just
  // runs polygonCircle and reverses everything at the end.
  /**
   * @param {Circle} circle The circle.
   * @param {Polygon} polygon The polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testCirclePolygon(circle, polygon, response) {
    // Test the polygon against the circle.
    var result = testPolygonCircle(polygon, circle, response);
    if (result && response) {
      // Swap A and B in the response.
      var a = response['a'];
      var aInB = response['aInB'];
      response['overlapN'].reverse();
      response['overlapV'].reverse();
      response['a'] = response['b'];
      response['b'] = a;
      response['aInB'] = response['bInA'];
      response['bInA'] = aInB;
    }
    return result;
  }
  SAT['testCirclePolygon'] = testCirclePolygon;
  
  // Checks whether polygons collide.
  /**
   * @param {Polygon} a The first polygon.
   * @param {Polygon} b The second polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonPolygon(a, b, response) {
    var aPoints = a['calcPoints'];
    var aLen = aPoints.length;
    var bPoints = b['calcPoints'];
    var bLen = bPoints.length;
    // If any of the edge normals of A is a separating axis, no intersection.
    for (var i = 0; i < aLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {
        return false;
      }
    }
    // If any of the edge normals of B is a separating axis, no intersection.
    for (var i = 0;i < bLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {
        return false;
      }
    }
    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
    // final overlap vector.
    if (response) {
      response['a'] = a;
      response['b'] = b;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    return true;
  }
  SAT['testPolygonPolygon'] = testPolygonPolygon;

  return SAT;
}));

},{}],2:[function(require,module,exports){
module.exports = function () {
    var initializator = require('./initializator.js'),
        games,
        engine = require('./mainEngine.js'),
        parentContainer = document.getElementById('game-table'),
        playButton = document.getElementById('play-button');

    function onClickPlayButton() {
        playButton.removeEventListener('click', onClickPlayButton);

        parentContainer.className = 'table';
        playButton.className = 'hidden';

        games = initializator.initiateGames();
        engine.runGames(games);
    }

    playButton.addEventListener('click', onClickPlayButton);
}
},{"./initializator.js":26,"./mainEngine.js":27}],3:[function(require,module,exports){
module.exports = (function (parent) {
    var circle = Object.create(parent),
        validator = require('./validator.js');

    Object.defineProperty(circle, 'init', {
        value: function (xCoordinate, yCoordinate, radius, collisionProfile, fill, stroke, strokeWidth) {
            parent.init.call(this, xCoordinate, yCoordinate, collisionProfile, fill, stroke, strokeWidth);
            this.radius = radius;

            return this;
        }
    });

    Object.defineProperty(circle, 'radius', {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'radius');
            this._radius = value;
        }
    });

    return circle;
}(require('./game-object.js')));

},{"./game-object.js":24,"./validator.js":34}],4:[function(require,module,exports){
module.exports = (function () {

    return {
        DEFAULT_VALUE_NAME: 'Value',

        CANVAS_WIDTH: 300,
        CANVAS_HEIGHT: 201,

        // game1 constants        
        GAME1_BOARD_TOP_LEFT_POINT_X: 50,
        GAME1_BOARD_TOP_LEFT_POINT_Y: 100,
        GAME1_BOARD_WIDTH: 200,
        GAME1_BOARD_HEIGHT: 10,
        GAME1_BOARD_FILL: 'black',
        GAME1_BOARD_STROKE: 'none',
        GAME1_BOARD_STROKE_WIDTH: 1,

        GAME1_BALL_START_X: 150,
        GAME1_BALL_START_Y: 90,
        GAME1_BALL_RADIUS: 10,
        GAME1_BALL_FILL: 'red',
        GAME1_BALL_STROKE: 'none',
        GAME1_BALL_STROKE_WIDTH: 1,
        GAME1_BALL_STEP: 1.5,
        GAME1_BALL_MIN_X: 50,
        GAME1_BALL_MAX_X: 250,

        GAME1_INITIAL_ROTATION_ANGLE: 0,
        GAME1_ROTATION_ANGLE_STEP: 0.02,
        GAME1_ROTATION_ANGLE_STEP_WHEN_PRESSED: 0.05,
        GAME1_ROT_ANGLE_STEP_MODIFIER: 100,
        GAME1_ROT_ANGLE_STEP_MODIFIER_WHEN_PRESSED: 2000,

        // game2 constants:
        GAME2_PLAYER_TOP_LEFT_POINT_X: 145,
        GAME2_PLAYER_TOP_LEFT_POINT_Y: 90,
        GAME2_PLAYER_WIDTH: 10,
        GAME2_PLAYER_HEIGHT: 20,
        GAME2_PLAYER_MIN_Y: 50,
        GAME2_PLAYER_MAX_Y: 130,
        GAME2_PLAYER_STEP: 20,
        GAME2_PLAYER_FILL: 'blue',
        GAME2_PLAYER_STROKE: 'black',
        GAME2_PLAYER_STROKE_WIDTH: 2,

        GAME2_RP_OBSTACLE_START_POINT_A_X: -20,
        GAME2_RP_OBSTACLE_START_POINT_A_Y: 50,
        GAME2_RP_OBSTACLE_START_POINT_B_X: -20,
        GAME2_RP_OBSTACLE_START_POINT_B_Y: 60,
        GAME2_RP_OBSTACLE_START_POINT_C_X: -5,
        GAME2_RP_OBSTACLE_START_POINT_C_Y: 55,
        GAME2_OBSTACLES_STEP: 2,
        GAME2_RP_OBSTACLE_FILL: 'black',
        GAME2_RP_OBSTACLE_STROKE: 'none',
        GAME2_RP_OBSTACLE_STROKE_WIDTH: 1,
        GAME2_LP_OBSTACLE_START_POINT_A_X: 320,
        GAME2_LP_OBSTACLE_START_POINT_A_Y: 90,
        GAME2_LP_OBSTACLE_START_POINT_B_X: 320,
        GAME2_LP_OBSTACLE_START_POINT_B_Y: 100,
        GAME2_LP_OBSTACLE_START_POINT_C_X: 305,
        GAME2_LP_OBSTACLE_START_POINT_C_Y: 95,
        GAME2_LP_OBSTACLE_FILL: 'black',
        GAME2_LP_OBSTACLE_STROKE: 'none',
        GAME2_LP_OBSTACLE_STROKE_WIDTH: 1,
        GAME2_POINT_TO_RESET_RP_OBSTACLE_X: 200,
        GAME2_POINT_TO_RESET_LP_OBSTACLE_X: 120,

        GAME2_BACKGROUND_TOP_LEFT_X: 145,
        GAME2_BACKGROUND_TOP_LEFT_Y: 50,
        GAME2_BACKGROUND_RECTS_WIDTH: 10,
        GAME2_BACKGROUND_RECTS_HEIGHT: 20,
        GAME2_BACKGROUND_RECTS_COUNT: 5,
        GAME2_BACKGROUND_RECTS_FILL: 'none',
        GAME2_BACKGROUND_RECTS_STROKE: 'black',
        GAME2_BACKGROUND_RECTS_STROKE_WIDTH: 2,

        // game3 constants:        
        GAME3_PLAYER_TOP_LEFT_POINT_X: 50,
        GAME3_PLAYER_TOP_LEFT_POINT_Y: 180,
        GAME3_PLAYER_BOTTOM_LEFT_POINT_X: 50,
        GAME3_PLAYER_BOTTOM_LEFT_POINT_Y: 200,
        GAME3_PLAYER_RIGHT_POINT_X: 65,
        GAME3_PLAYER_RIGHT_POINT_Y: 190,
        GAME3_PLAYER_MIN_Y: 0,
        GAME3_PLAYER_MAX_Y: 180,
        GAME3_PLAYER_STEP: 2,
        GAME3_PLAYER_FILL: 'azure',
        GAME3_PLAYER_STROKE: 'purple',
        GAME3_PLAYER_STROKE_WIDTH: 2,

        GAME3_OBSTACLE_START_POINT_X: 300,
        GAME3_POINT_TO_RELEASE_NEW_OBSTACLE_X: 140,
        GAME3_POINT_TO_REMOVE_OBSTACLE_X: 0,
        GAME3_OBSTACLE_WIDTH: 15,
        GAME3_OBSTACLE_HEIGHT: 50,
        GAME3_OBSTACLE_MAX_Y: 150,
        GAME3_OBSTACLE_STEP: 2,
        GAME3_OBSTACLE_FILL: 'black',
        GAME3_OBSTACLE_STROKE: 'none',
        GAME3_OBSTACLE_STROKE_WIDTH: 1,
        
        // game4 constants:
        GAME4_PLAYER_TOP_LEFT_POINT_X: 150,
        GAME4_PLAYER_TOP_LEFT_POINT_Y: 100,
        GAME4_PLAYER_WIDTH: 30,
        GAME4_PLAYER_HEIGHT: 30,
        GAME4_PLAYER_MIN_X: 0,
        GAME4_PLAYER_MAX_X: 270,
        GAME4_PLAYER_MIN_Y: 0,
        GAME4_PLAYER_MAX_Y: 170,
        GAME4_PLAYER_STEP: 3,
        GAME4_PLAYER_FILL: 'green',
        GAME4_PLAYER_STROKE: 'none',
        GAME4_PLAYER_STROKE_WIDTH: 1,

        GAME4_OBSTACLE_CREATION_INTERVAL: 4000,
        GAME4_OBSTACLE_WIDTH: 40,
        GAME4_OBSTACLE_HEIGHT: 40,
        GAME4_OBSTACLE_MAX_X: 260,
        GAME4_OBSTACLE_MAX_Y: 160,
        GAME4_OBSTACLE_COUNTER_START_VALUE: 10,
        GAME4_OBSTACLE_COUNTER_STEP: 1000,
        GAME4_OBSTACLE_FILL: 'grey',
        GAME4_OBSTACLE_STROKE: 'none',
        GAME4_OBSTACLE_STROKE_WIDTH: 1,
    };
}());
},{}],5:[function(require,module,exports){
module.exports = (function (parent) {
    var game1ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js'),
        keyPressed = false,
        rotationDirection,
        ball;

    Object.defineProperty(game1ObjectsManager, 'manageBall', {
        value: function (game) {
            ball = game.gameObjects[0];
            ball.xCoordinate += constants.GAME1_BALL_STEP * game.boardRotationAngle;
        }
    });
    
    Object.defineProperty(game1ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            document.addEventListener('keydown', downpressHandle);
            document.addEventListener('keyup', upHandle);

            function downpressHandle(key) {
                if (key.keyCode === 37) {
                    rotationDirection = 'left';
                    keyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 39) {
                    rotationDirection = 'right';
                    keyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
            }

            function upHandle(key) {
                if (key.keyCode === 37) {
                    keyPressed = false;
                    document.removeEventListener('keyup', upHandle);
                }
                if (key.keyCode === 39) {
                    keyPressed = false;
                    document.removeEventListener('keyup', upHandle);
                }
            }
        }
    });

    Object.defineProperty(game1ObjectsManager, 'movePlayer', {
        value: function (game) {
            var randomChoiceOfDirection,
                ballXCoord = game.gameObjects[0].xCoordinate;

            if (!keyPressed) {
                if ((ballXCoord - constants.GAME1_BALL_MIN_X) > constants.GAME1_BOARD_WIDTH / 2) {
                    game.boardRotationAngle =
                        constants.GAME1_ROTATION_ANGLE_STEP
                        + (ballXCoord - constants.GAME1_BALL_START_X) / constants.GAME1_ROT_ANGLE_STEP_MODIFIER;
                }
                else if ((ballXCoord - constants.GAME1_BALL_MIN_X) < constants.GAME1_BOARD_WIDTH / 2) {
                    game.boardRotationAngle =
                        -constants.GAME1_ROTATION_ANGLE_STEP
                        + (ballXCoord - constants.GAME1_BALL_START_X) / constants.GAME1_ROT_ANGLE_STEP_MODIFIER;
                }
                else {
                    randomChoiceOfDirection = Math.random();
                game.boardRotationAngle = randomChoiceOfDirection < 0.5 ? -constants.GAME1_ROTATION_ANGLE_STEP 
                                                                        : constants.GAME1_ROTATION_ANGLE_STEP;
                }
            }
            else {
                if (rotationDirection === 'left') {
                    game.boardRotationAngle -=
                        constants.GAME1_ROTATION_ANGLE_STEP_WHEN_PRESSED
                        - Math.abs(ballXCoord - constants.GAME1_BALL_START_X) / constants.GAME1_ROT_ANGLE_STEP_MODIFIER_WHEN_PRESSED;
                }
                else if (rotationDirection === 'right') {
                    game.boardRotationAngle +=
                        constants.GAME1_ROTATION_ANGLE_STEP_WHEN_PRESSED
                        - Math.abs(ballXCoord - constants.GAME1_BALL_START_X) / constants.GAME1_ROT_ANGLE_STEP_MODIFIER_WHEN_PRESSED;
                }
            }
        }
    });

    Object.defineProperty(game1ObjectsManager, 'manageState', {
        value: function (game) {
            ball = game.gameObjects[0];

            if (ball.xCoordinate < constants.GAME1_BALL_MIN_X || ball.xCoordinate > constants.GAME1_BALL_MAX_X) {
                // Uncomment this line to enable game over condition
                 game.over = true;
            }
        }
    });

    return game1ObjectsManager;
}(require('./game-object-manager.js')));
},{"./constants.js":4,"./game-object-manager.js":23,"sat":1}],6:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./constants.js":4,"./game-object-manager.js":23,"dup":5,"sat":1}],7:[function(require,module,exports){
module.exports = (function (parent) {
    var game1Renderer = Object.create(parent),
        constants = require('./constants.js'),
        circle = require('./circle.js'),
        stage = new Kinetic.Stage({
            container: document.getElementById('game-1'),
            width: constants.CANVAS_WIDTH,
            height: constants.CANVAS_HEIGHT
        }),
        layer = new Kinetic.Layer({ width: 300, height: 200});

    Object.defineProperty(game1Renderer, 'clearStage', {
        value: function () {
            layer.removeChildren();
        }
    });

    Object.defineProperty(game1Renderer, 'render', {
        value: function (gameObject, rotationAngle) {
            var figure;
            if (circle.isPrototypeOf(gameObject)) {
                figure = new Kinetic.Circle({
                    x: gameObject.xCoordinate,
                    y: gameObject.yCoordinate,
                    radius: gameObject.radius,
                    fill: gameObject.fill,
                    stroke: gameObject.stroke,
                    strokeWidth: gameObject.strokeWidth
                });
            }
            else {
                figure = new Kinetic.Line({
                    points: gameObject.getCoordinatesAsArray(),
                    stroke: gameObject.stroke,
                    fill: gameObject.fill,
                    strokeWidth: gameObject.strokeWidth,
                    closed: true
                });
            }           

            layer.add(figure);
            var w = layer.getWidth(),
                h = layer.getHeight();
            layer.setOffset({x:w / 2,y:h / 2});
            layer.setPosition({ x: w / 2, y: h / 2 });
            layer.rotateDeg(rotationAngle);
            stage.add(layer);
        }
    });

    return game1Renderer;
}(require('./renderer.js')));
},{"./circle.js":3,"./constants.js":4,"./renderer.js":31}],8:[function(require,module,exports){
module.exports = (function (parent) {
    var game1 = Object.create(parent);

    // When the game is over, please set game1.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game1, 'init', {
        value: function (renderer, player, gameObjects, gameObjectsManager, boardRotationAngle) {
            parent.init.call(this, renderer, player, gameObjects, gameObjectsManager);
            this.boardRotationAngle = boardRotationAngle;

            return this;
        }
    });

    Object.defineProperty(game1, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.render(this.player.shape, this.boardRotationAngle);
            this.gameObjects.forEach(this.renderer.render, this.boardRotationAngle);

            this.gameObjectsManager.manageBall(this);
            this.gameObjectsManager.startChangeDirectionListener(this);
            this.gameObjectsManager.movePlayer(this);
            this.gameObjectsManager.manageState(this);
        }
    });

    Object.defineProperty(game1, 'boardRotationAngle', {
        get: function () {
            return this._boardRotationAngle;
        },
        set: function (value) {
            this._boardRotationAngle = value;
        }
    });

    return game1;
}(require('./game.js')));
},{"./game.js":25}],9:[function(require,module,exports){
module.exports = (function (parent) {
    var game2ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js'),
        isUpArrowKeyPressed = false,
        isDownArowKeyPressed = false,
        possibleYCoordsForObstacles = [55, 75, 95, 115, 135],
        len = possibleYCoordsForObstacles.length,
        randomFirstYCoord,
        randomSecondYCoord;

    function moveEnemyObjects(obstacles) {
        var rightPointingObstacle = obstacles[0],
            leftPointingObstacle = obstacles[1];

        parent.move(rightPointingObstacle, constants.GAME2_OBSTACLES_STEP, 0);
        parent.move(leftPointingObstacle, -constants.GAME2_OBSTACLES_STEP, 0);
    }

    function maintainObstaclesNumber(obstacles) {
        var dx,
            dy;

        if (obstacles[0].xCoordinateA >= constants.GAME2_POINT_TO_RESET_RP_OBSTACLE_X) {
            dx = - 205;
            randomFirstYCoord = possibleYCoordsForObstacles[Math.round(Math.random() * (len - 1))];
            dy = -(obstacles[0].yCoordinateA - randomFirstYCoord);
            parent.move(obstacles[0], dx, dy);
        }

        if (obstacles[1].xCoordinateA <= constants.GAME2_POINT_TO_RESET_LP_OBSTACLE_X) {
            dx = 200;
            randomSecondYCoord = possibleYCoordsForObstacles[Math.round(Math.random() * (len - 1))];
            dy = -(obstacles[1].yCoordinateA - randomSecondYCoord);
            parent.move(obstacles[1], dx, dy);  
        }
    }

    Object.defineProperty(game2ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
            moveEnemyObjects(obstacles);
            maintainObstaclesNumber(obstacles);
        }
    });

    Object.defineProperty(game2ObjectsManager, 'startChangeDirectionListener', {
        value: function () {
            document.addEventListener('keydown', downpressHandle);
            document.addEventListener('keyup', upHandle);

            function downpressHandle(key) {
                if (key.keyCode === 38) {
                    isUpArrowKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 40) {
                    isDownArowKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
            }

            function upHandle(key) {
                if (key.keyCode === 38) {
                    isUpArrowKeyPressed = false;
                    document.removeEventListener('keyup', upHandle);
                }
                if (key.keyCode === 40) {
                    isDownArowKeyPressed = false;
                    document.removeEventListener('keyup', upHandle);
                }
            }
        }
    });

    Object.defineProperty(game2ObjectsManager, 'movePlayer', {
        value: function (player) {
            if (player.shape.yCoordinate === constants.GAME2_PLAYER_MIN_Y) {
                if (isUpArrowKeyPressed) {
                    isUpArrowKeyPressed = false;
                    parent.move(player.shape, 0, 0);
                }
                if (isDownArowKeyPressed) {
                    isDownArowKeyPressed = false;
                    parent.move(player.shape, 0, constants.GAME2_PLAYER_STEP);
                }                
            }

            if (player.shape.yCoordinate === constants.GAME2_PLAYER_MAX_Y) {
                if (isDownArowKeyPressed) {
                    isDownArowKeyPressed = false;
                    parent.move(player.shape, 0, 0);
                }
                if (isUpArrowKeyPressed) {
                    isUpArrowKeyPressed = false;
                    parent.move(player.shape, 0, -constants.GAME2_PLAYER_STEP);
                }
            }

            if (isUpArrowKeyPressed && isDownArowKeyPressed) {
                isUpArrowKeyPressed  = false;
                isDownArowKeyPressed = false;
                return;
            }

            if (isUpArrowKeyPressed) {     
                isUpArrowKeyPressed = false;
                parent.move(player.shape, 0, -constants.GAME2_PLAYER_STEP);
            }

            if (isDownArowKeyPressed) {
                isDownArowKeyPressed = false;
                parent.move(player.shape, 0, constants.GAME2_PLAYER_STEP);
            }
        }
    });

    Object.defineProperty(game2ObjectsManager, 'manageState', {
        value: function (game, player, obstacles) {
            var collisionHappened = obstacles.some(function (obstacle) {
                return sat.testPolygonPolygon(obstacle.collisionProfile, player.shape.collisionProfile);
            });

            if (collisionHappened) {
                game.over = true;
            }
        }
    });

    return game2ObjectsManager;
}(require('./game-object-manager.js')));
},{"./constants.js":4,"./game-object-manager.js":23,"sat":1}],10:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"./constants.js":4,"./game-object-manager.js":23,"dup":9,"sat":1}],11:[function(require,module,exports){
module.exports = (function (parent) {
    var game2Renderer = Object.create(parent),
        constants = require('./constants.js'),
        triangle = require('./triangle.js'),
        svgContainer = document.getElementById('the-svg'),
        svgNs = 'http://www.w3.org/2000/svg',
        backgroundIsDrawn = false,
        isPlayerDrawn = false,
        playerRect = document.createElementNS(svgNs, 'rect'),
        firstObstacle = document.createElementNS(svgNs, 'path'),
        secondObstacle = document.createElementNS(svgNs, 'path'),
        obstaclesCount = 0;

    function drawBackground() {
        var i;

        for (i = 0; i < constants.GAME2_BACKGROUND_RECTS_COUNT; i += 1) {
            svgContainer.style.display = 'inline-block';
            var rect = document.createElementNS(svgNs, 'rect');
            rect.setAttribute('x', constants.GAME2_BACKGROUND_TOP_LEFT_X);
            rect.setAttribute('y', constants.GAME2_BACKGROUND_TOP_LEFT_Y + i*constants.GAME2_BACKGROUND_RECTS_HEIGHT);
            rect.setAttribute('width', constants.GAME2_BACKGROUND_RECTS_WIDTH);
            rect.setAttribute('height', constants.GAME2_BACKGROUND_RECTS_HEIGHT);
            rect.setAttribute('fill', constants.GAME2_BACKGROUND_RECTS_FILL);
            rect.setAttribute('stroke', constants.GAME2_BACKGROUND_RECTS_STROKE);
            rect.setAttribute('stroke-width', constants.GAME2_BACKGROUND_RECTS_STROKE_WIDTH);

            svgContainer.appendChild(rect);
        }
    }

    Object.defineProperty(game2Renderer, 'clearStage', {
        value: function () {
            
        }
    });

    Object.defineProperty(game2Renderer, 'render', {
        value: function (gameObject) {
            if (!backgroundIsDrawn) {
                backgroundIsDrawn = true;
                drawBackground();
            }

            if (triangle.isPrototypeOf(gameObject)) {
                if (obstaclesCount === 0) {
                    obstaclesCount += 1;
                    firstObstacle.setAttribute('d', 'M ' + gameObject.xCoordinateA + ' ' + gameObject.yCoordinateA
                        + ' L ' + gameObject.xCoordinateB + ' ' + gameObject.yCoordinateB
                        + ' L ' + gameObject.xCoordinateC + ' ' + gameObject.yCoordinateC + ' z');
                    firstObstacle.setAttribute('fill', 'black');

                    svgContainer.appendChild(firstObstacle);
                }
                else if (obstaclesCount === 1) {
                    obstaclesCount += 1;
                    secondObstacle.setAttribute('d', 'M ' + gameObject.xCoordinateA + ' ' + gameObject.yCoordinateA
                        + ' L ' + gameObject.xCoordinateB + ' ' + gameObject.yCoordinateB
                        + ' L ' + gameObject.xCoordinateC + ' ' + gameObject.yCoordinateC + ' z');
                    secondObstacle.setAttribute('fill', 'black');

                    svgContainer.appendChild(secondObstacle);
                }
                else {
                    if (gameObject.id === 1) {
                        firstObstacle.setAttribute('d', 'M ' + gameObject.xCoordinateA + ' ' + gameObject.yCoordinateA
                        + ' L ' + gameObject.xCoordinateB + ' ' + gameObject.yCoordinateB
                        + ' L ' + gameObject.xCoordinateC + ' ' + gameObject.yCoordinateC + ' z');
                    }
                    else if (gameObject.id === 2) {
                        secondObstacle.setAttribute('d', 'M ' + gameObject.xCoordinateA + ' ' + gameObject.yCoordinateA
                        + ' L ' + gameObject.xCoordinateB + ' ' + gameObject.yCoordinateB
                        + ' L ' + gameObject.xCoordinateC + ' ' + gameObject.yCoordinateC + ' z');
                    }
                }
            }
            else {
                playerRect.setAttribute('x', gameObject.xCoordinate);
                playerRect.setAttribute('y', gameObject.yCoordinate);
                playerRect.setAttribute('width', gameObject.width);
                playerRect.setAttribute('height', gameObject.height);
                playerRect.setAttribute('fill', gameObject.fill);
                playerRect.setAttribute('stroke', gameObject.stroke);
                playerRect.setAttribute('stroke-width', gameObject.strokeWidth);

                if (!isPlayerDrawn) {
                    isPlayerDrawn = true;                 

                    svgContainer.appendChild(playerRect);
                }
            }
        }
    });

    return game2Renderer;
}(require('./renderer.js')));
},{"./constants.js":4,"./renderer.js":31,"./triangle.js":33}],12:[function(require,module,exports){
module.exports = (function (parent) {
    var game2 = Object.create(parent);
    
    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game2, 'update', {
        value: function () {
            parent.update.call(this);

            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.startChangeDirectionListener();
            this.gameObjectsManager.movePlayer(this.player);

            this.gameObjectsManager.manageState(this, this.player, this.gameObjects);
        }
    });

    return game2;
}(require('./game.js')));
},{"./game.js":25}],13:[function(require,module,exports){
module.exports = (function (parent) {
    var game3ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js');

    // Obstacles logic
    function maintainSpecifiedNumberOfEnemies(obstacles) {
        var index = 0,
            randomYCoord,
            gameObjectFactory = require('./game-object-factory.js'),
            newObstacle;

        if (obstacles.length === 0) {
            randomYCoord = Math.random() * constants.GAME3_OBSTACLE_MAX_Y;
            newObstacle = gameObjectFactory.getRectangle(constants.GAME3_OBSTACLE_START_POINT_X, randomYCoord,
                constants.GAME3_OBSTACLE_WIDTH, constants.GAME3_OBSTACLE_HEIGHT, constants.GAME3_OBSTACLE_FILL,
                constants.GAME3_OBSTACLE_STROKE, constants.GAME3_OBSTACLE_STROKE_WIDTH);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle) {
            return obstacle.xCoordinate === constants.GAME3_POINT_TO_RELEASE_NEW_OBSTACLE_X;
        })) {
            randomYCoord = Math.random() * constants.GAME3_OBSTACLE_MAX_Y;
            newObstacle = gameObjectFactory.getRectangle(constants.GAME3_OBSTACLE_START_POINT_X, randomYCoord,
                constants.GAME3_OBSTACLE_WIDTH, constants.GAME3_OBSTACLE_HEIGHT, constants.GAME3_OBSTACLE_FILL,
                constants.GAME3_OBSTACLE_STROKE, constants.GAME3_OBSTACLE_STROKE_WIDTH);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle, index) {
            return obstacle.xCoordinate === constants.GAME3_POINT_TO_REMOVE_OBSTACLE_X;
        })) {
            obstacles.splice(index, 1);
        }
    }       

    function moveEnemyObjects(obstacles) {
        obstacles.forEach(function (obstacle) {
            parent.move(obstacle, -constants.GAME3_OBSTACLE_STEP, 0);
            });
    }

    Object.defineProperty(game3ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
            moveEnemyObjects(obstacles);
            maintainSpecifiedNumberOfEnemies(obstacles);
        }
    });

    Object.defineProperty(game3ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            document.addEventListener('keydown', downpressHandle);
            document.addEventListener('keyup', upHandle);

            function downpressHandle(key) {
                if (key.keyCode === 32) {
                    game.player.direction = 'up';
                    document.removeEventListener('keydown', downpressHandle);
                }
            }
            function upHandle(key) {
                if (key.keyCode === 32) {
                    game.player.direction = 'down';
                    document.removeEventListener('keyup', upHandle);
                }
            }
        }
    });

    Object.defineProperty(game3ObjectsManager, 'movePlayer', {
        value: function (player) {
            if (player.shape.yCoordinateA < constants.GAME3_PLAYER_MAX_Y && player.direction === 'down') {
                parent.move(player.shape, 0, constants.GAME3_PLAYER_STEP);
            }

            if (player.shape.yCoordinateA >= constants.GAME3_PLAYER_MIN_Y && player.direction === 'up') {
                parent.move(player.shape, 0, -constants.GAME3_PLAYER_STEP);
            }
        }
    });

    Object.defineProperty(game3ObjectsManager, 'manageState', {
        value: function (game, player, obstacles) {
            var collisionHappened = obstacles.some(function(obstacle){
                return sat.testPolygonPolygon(obstacle.collisionProfile, player.shape.collisionProfile);
            });
            
            if (collisionHappened) {
                // Uncomment this to have a game over condition.
                 game.over = true;
            }
        }
    });

    return game3ObjectsManager;
}(require('./game-object-manager.js')));
},{"./constants.js":4,"./game-object-factory.js":22,"./game-object-manager.js":23,"sat":1}],14:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./constants.js":4,"./game-object-factory.js":22,"./game-object-manager.js":23,"dup":13,"sat":1}],15:[function(require,module,exports){
module.exports = (function (parent) {
    var game3Renderer = Object.create(parent),
        constants = require('./constants.js'),
        stage = new Kinetic.Stage({
            container:  document.getElementById('game-3'),
            width: constants.CANVAS_WIDTH,            
            height: constants.CANVAS_HEIGHT
        }),
        layer = new Kinetic.Layer();

    Object.defineProperty(game3Renderer, 'clearStage', {
        value: function () {
            layer.removeChildren();
        }
    });   

    Object.defineProperty(game3Renderer, 'render', {
        value: function (gameObject) {
            var figure = new Kinetic.Line({
                    points: gameObject.getCoordinatesAsArray(),
                    stroke: gameObject.stroke,
                    fill: gameObject.fill,
                    strokeWidth: gameObject.strokeWidth,
                    closed: true
                });

            layer.add(figure);
            stage.add(layer);
        }
    });

    return game3Renderer;
}(require('./renderer.js')));

},{"./constants.js":4,"./renderer.js":31}],16:[function(require,module,exports){
module.exports = (function (parent) {
    var game3 = Object.create(parent);
    
    // Not needed for this game. May be needed for the others.
    //Object.defineProperty(game3, 'init', {
    //    value: function (renderer, somePlayer, obstacles, gameObjectsManager) {
    //        parent.init.call(this, renderer, somePlayer, [], gameObjectsManager);

    //        return this;
    //    }
    //});

    //TODO: check if it is possible to move this logic to parent. Not for now.
    Object.defineProperty(game3, 'update', {
        value: function () {
            parent.update.call(this);
            // TODO: Consider how the gameObjectManager can provide general methods here
            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.startChangeDirectionListener(this);
            this.gameObjectsManager.movePlayer(this.player);

            this.gameObjectsManager.manageState(this, this.player, this.gameObjects);
        }
    });

    return game3;
}(require('./game.js')));

},{"./game.js":25}],17:[function(require,module,exports){
module.exports = (function (parent) {
    var game4ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js'),
        gameObjectFactory = require('./game-object-factory.js'),
        wKeyPressed = false,
        aKeyPressed = false,
        sKeyPressed = false,
        dKeyPressed = false,
        createNewObstacleInterval,
        changeTextInterval,
        obstaclesCreatedWithInterval = [];

    // Create and add new obstacle every GAME4_OBSTACLE_CREATION_INTERVAL milliseconds
    function addNewObstacleAfterInterval(obstacleCollection) {
        obstacleCollection.push(createObstacle());
    }

    function startObstacleCreationBetweenInterval(interval) {
        createNewObstacleInterval = setInterval(addNewObstacleAfterInterval, interval, obstaclesCreatedWithInterval);
    };

    startObstacleCreationBetweenInterval(constants.GAME4_OBSTACLE_CREATION_INTERVAL);

    // decrease the counter inside every obstacle rectangle with 1
    function changeRectText() {
        arguments[0].text -= 1;
    }

    function createObstacle() {
        var newObstacle,
            randXCoord = Math.random() * constants.GAME4_OBSTACLE_MAX_X,
            randYCoord = Math.random() * constants.GAME4_OBSTACLE_MAX_Y;     

        newObstacle = gameObjectFactory.getRectangleWithText(randXCoord, randYCoord, constants.GAME4_OBSTACLE_WIDTH, constants.GAME4_OBSTACLE_HEIGHT,
            constants.GAME4_OBSTACLE_FILL, constants.GAME4_OBSTACLE_STROKE, constants.GAME4_OBSTACLE_STROKE_WIDTH, constants.GAME4_OBSTACLE_COUNTER_START_VALUE);
            changeTextInterval = setInterval(changeRectText, constants.GAME4_OBSTACLE_COUNTER_STEP, newObstacle);

        return newObstacle;
    }    

    Object.defineProperty(game4ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {

            if (obstaclesCreatedWithInterval.length > 0) {
                obstacles.push(obstaclesCreatedWithInterval[0]);
                obstaclesCreatedWithInterval.splice(0, 1);
            }
        }
    });

    Object.defineProperty(game4ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            document.addEventListener('keydown', downpressHandle);
            document.addEventListener('keyup', upHandle);

            function downpressHandle(key) {
                if (key.keyCode === 87) {
                    wKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 65) {
                    aKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 83) {
                    sKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 68) {
                    dKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
            }

            function upHandle(key) {
                if (key.keyCode === 87) {
                    wKeyPressed = false;
                    document.removeEventListener('keyup', downpressHandle);
                }
                if (key.keyCode === 65) {
                    aKeyPressed = false;
                    document.removeEventListener('keyup', downpressHandle);
                }
                if (key.keyCode === 83) {
                    sKeyPressed = false;
                    document.removeEventListener('keyup', downpressHandle);
                }
                if (key.keyCode === 68) {
                    dKeyPressed = false;
                    document.removeEventListener('keyup', downpressHandle);
                }
            }
        }
    });
    
    Object.defineProperty(game4ObjectsManager, 'movePlayer', {
        value: function (player) {
            var dx = 0,
                dy = 0;

            if (player.shape.xCoordinate < constants.GAME4_PLAYER_MIN_X) {
                dx = 1;
            }
            else if (player.shape.xCoordinate > constants.GAME4_PLAYER_MAX_X) {
                dx = -1;
            }
            else {
                if (aKeyPressed && dKeyPressed) {
                    dx = 0;
                }
                if (aKeyPressed && !dKeyPressed) {
                    dx = -constants.GAME4_PLAYER_STEP;
                }
                if (!aKeyPressed && dKeyPressed) {
                    dx = constants.GAME4_PLAYER_STEP;
                }
            }

            if (player.shape.yCoordinate < constants.GAME4_PLAYER_MIN_Y) {
                dy = 1;
            }
            else if (player.shape.yCoordinate > constants.GAME4_PLAYER_MAX_Y) {
                dy = -1;
            }
            else {
                if (wKeyPressed && sKeyPressed) {
                    dy = 0;
                }
                if (wKeyPressed && !sKeyPressed) {
                    dy = -constants.GAME4_PLAYER_STEP;
                }
                if (!wKeyPressed && sKeyPressed) {
                    dy = constants.GAME4_PLAYER_STEP;
                }
            }

            parent.move(player.shape, dx, dy);
        }
    });

    Object.defineProperty(game4ObjectsManager, 'manageState', {
        value: function (game, player, obstacles) {
            var index = -1,
                collisionHappened = obstacles.some(function (obstacle) {
                index += 1;
                return sat.testPolygonPolygon(obstacle.collisionProfile, player.shape.collisionProfile);
                });

            if (collisionHappened) {
                obstacles.splice(index, 1);
            }

            if (obstacles.some(function (obstacle) {
                return obstacle.text === 0;
            })) {
                game.over = true;
            }
        }
    });

    return game4ObjectsManager;
}(require('./game-object-manager.js')));
},{"./constants.js":4,"./game-object-factory.js":22,"./game-object-manager.js":23,"sat":1}],18:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./constants.js":4,"./game-object-factory.js":22,"./game-object-manager.js":23,"dup":17,"sat":1}],19:[function(require,module,exports){
module.exports = (function (parent) {
    var game4Renderer = Object.create(parent),
        constants = require('./constants.js'),
        rectWithText = require('./rectangle-with-text.js'),
        stage = new Kinetic.Stage({
            container: document.getElementById('game-4'),
            width: constants.CANVAS_WIDTH,
            height: constants.CANVAS_HEIGHT
        }),
        layer = new Kinetic.Layer();

    Object.defineProperty(game4Renderer, 'clearStage', {
        value: function () {
            layer.removeChildren();
        }
    });

    Object.defineProperty(game4Renderer, 'render', {
        value: function (gameObject) {
            var figure = new Kinetic.Line({
                points: gameObject.getCoordinatesAsArray(),
                fill: gameObject.fill,
                stroke: gameObject.stroke,
                strokeWidth: gameObject.strokeWidth,
                closed: true
            });

            layer.add(figure);

            if (rectWithText.isPrototypeOf(gameObject)) {
                var text = new Kinetic.Text({
                    x: gameObject.xCoordinate + 10,
                    y: gameObject.yCoordinate + 5,
                    text: gameObject.text.toString(),
                    fontSize: 25,
                    fontFamily: 'Calibri',
                    fill: 'white'
                });

                layer.add(text);
            }

            stage.add(layer);
        }
    });

    return game4Renderer;
}(require('./renderer.js')));
},{"./constants.js":4,"./rectangle-with-text.js":29,"./renderer.js":31}],20:[function(require,module,exports){
module.exports = (function (parent) {
    var game4 = Object.create(parent);
    
    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game4, 'update', {
        value: function () {
            parent.update.call(this);
            // Do stuff with this.gameObjectManager
            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.startChangeDirectionListener(this);
            this.gameObjectsManager.movePlayer(this.player);

            this.gameObjectsManager.manageState(this, this.player, this.gameObjects);
        }
    });

    return game4;
}(require('./game.js')));
},{"./game.js":25}],21:[function(require,module,exports){
module.exports = (function() {
    var gameError = {
        NotImplementedError: function (message) {
            this.name = "NotImplementedError";
            this.message = (message || "");
        }
    };

    gameError.NotImplementedError.prototype = Error.prototype;

    return gameError;
}());
},{}],22:[function(require,module,exports){
module.exports = (function () {
    var rectangle = require('./rectangle.js'),
        rectangleWithText = require('./rectangle-with-text.js'),
        triangle = require('./triangle.js'),
        circle = require('./circle.js'),
        SAT = require('sat');


    return {
        getRectangle: function (xCoordinate, yCoordinate, width, height, fill, stroke, strokeWidth) {
            var collisionProfile = new SAT.Box(new SAT.Vector(xCoordinate, yCoordinate), width, height).toPolygon();

            return Object.create(rectangle).init(xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth);
        },
        getRectangleWithText: function (xCoordinate, yCoordinate, width, height, fill, stroke, strokeWidth, text) {
            var collisionProfile = new SAT.Box(new SAT.Vector(xCoordinate, yCoordinate), width, height).toPolygon();

            return Object.create(rectangleWithText).init(xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth, text);
        },
        getTriangle: function (xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, fill, stroke, strokeWidth) {
            var aAbsolute = new SAT.Vector(xCoordinateA, yCoordinateA),
                aRelativeToA = new SAT.Vector(0, 0),
                bRelativeToA = new SAT.Vector(xCoordinateB - xCoordinateA, yCoordinateB - yCoordinateA),
                cRelativeToA = new SAT.Vector(xCoordinateC - xCoordinateA, yCoordinateC - yCoordinateA),
                collisionProfile = new SAT.Polygon(aAbsolute, [aRelativeToA, bRelativeToA, cRelativeToA]);

            return Object.create(triangle).init(xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, collisionProfile, fill, stroke, strokeWidth);
        },
        getCircle: function (xCoordinate, yCoordinate, radius, fill, stroke, strokeWidth) {
            var collisionProfile = new SAT.Circle(new SAT.Vector(xCoordinate, yCoordinate), radius);

            return Object.create(circle).init(xCoordinate, yCoordinate, radius, collisionProfile, fill, stroke, strokeWidth);
        }
    };
}());
},{"./circle.js":3,"./rectangle-with-text.js":29,"./rectangle.js":30,"./triangle.js":33,"sat":1}],23:[function(require,module,exports){
module.exports = (function() {
    var gameObjectManager = {},
        validator = require('./validator.js'),
        triangle = require('./triangle.js');

    Object.defineProperty(gameObjectManager, 'move', {
        value: function (gameObject, dx, dy) {
            validator.validateIfGameObject(gameObject, 'gameObject to move');
            validator.validateIfRealNumber(dx);
            validator.validateIfRealNumber(dy);

            gameObject.xCoordinate += dx;
            gameObject.yCoordinate += dy;

            gameObject.collisionProfile.pos.x += dx;
            gameObject.collisionProfile.pos.y += dy;

            if (triangle.isPrototypeOf(gameObject)) {
                gameObject.xCoordinateB += dx;
                gameObject.yCoordinateB += dy;

                gameObject.xCoordinateC += dx;
                gameObject.yCoordinateC += dy;
            }
        }
    });

    return gameObjectManager;
}());
},{"./triangle.js":33,"./validator.js":34}],24:[function(require,module,exports){
//TODO: make a gameObjectFactory
module.exports = (function () {
    var gameObject = {},
        validator = require('./validator.js');

    Object.defineProperty(gameObject, 'init', {
        value: function (xCoordinate, yCoordinate, collisionProfile, fill, stroke, strokeWidth) {
            this.xCoordinate = xCoordinate;
            this.yCoordinate = yCoordinate;
            this.collisionProfile = collisionProfile;
            this.fill = fill;
            this.stroke = stroke;
            this.strokeWidth = strokeWidth;

            return this;
        }
    });

    Object.defineProperty(gameObject, 'xCoordinate', {
        get: function () {
            return this._xCoordinate;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, 'xCoordinate');
            this._xCoordinate = value;
        }
    });

    Object.defineProperty(gameObject, 'yCoordinate', {
        get: function () {
            return this._yCoordinate;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, 'yCoordinate');
            this._yCoordinate = value;
        }
    });

    Object.defineProperty(gameObject, 'collisionProfile', {
        get: function () {
            return this._collisionProfile;
        },
        set: function (value) {
            validator.validateIfCollisionProfile(value, 'collisionProfile');
            this._collisionProfile = value;
        }
    });

    Object.defineProperty(gameObject, 'fill', {
        get: function () {
            return this._fill;
        },
        set: function (value) {
            validator.validateIfString(value, 'fill');
            this._fill = value;
        }
    });

    Object.defineProperty(gameObject, 'stroke', {
        get: function () {
            return this._stroke;
        },
        set: function (value) {
            validator.validateIfString(value, 'stroke');
            this._stroke = value;
        }
    });

    Object.defineProperty(gameObject, 'strokeWidth', {
        get: function () {
            return this._strokeWidth;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'strokeWidth');
            this._strokeWidth = value;
        }
    });

    Object.defineProperty(gameObject, 'getCoordinatesAsArray', {
        value: function () {
            return [this.xCoordinate, this.yCoordinate];
        }
    });

    return gameObject;
}());
},{"./validator.js":34}],25:[function(require,module,exports){
module.exports = (function () {
    var game = {},
        validator = require('./validator.js');

    Object.defineProperty(game, 'init', {
        value: function (renderer, player, gameObjects, gameObjectsManager) { 
            this.renderer = renderer;
            this.player = player;
            this.gameObjects = gameObjects || [];
            this.gameObjectsManager = gameObjectsManager;
            this.over = false;

            return this;
        }
    });

    Object.defineProperty(game, 'renderer', {
        get: function () {
            return this._renderer;
        },
        set: function (value) {
            validator.validateIfRenderer(value, 'renderer');
            this._renderer = value;
        }
    });

    Object.defineProperty(game, 'player', {
        get: function () {
            return this._player;
        },
        set: function (value) {
            validator.validateIfPlayer(value, 'player');
            this._player = value;
        }
    });

    Object.defineProperty(game, 'gameObjects', {
        get: function () {
            return this._gameObjects;
        },
        set: function (value) {
            validator.validateIfArray(value, 'gameObjects');
            value.forEach(function (val) {
                validator.validateIfGameObject(val, 'Each value in gameObjects');
            });
            this._gameObjects = value;
        }
    });

    Object.defineProperty(game, 'gameObjectsManager', {
        get: function () {
            return this._gameObjectsManager;
        },
        set: function (value) {
            //TODO: Add validation or meybe not before circular dependency is understood.
            this._gameObjectsManager = value;
        }
    });

    Object.defineProperty(game, 'over', {
        get: function () {
            return this._over;
        },
        set: function (value) {
            validator.validateIfBoolean(value, 'over');
            this._over = value;
        }
    });

    Object.defineProperty(game, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.render(this.player.shape);
            this.gameObjects.forEach(this.renderer.render);
        }
    });    

    return game;
}());
},{"./validator.js":34}],26:[function(require,module,exports){
module.exports = (function () {
    var constants = require('./constants.js'),
        game1Prototype = require('./game-1.js'),
        game2Prototype = require('./game-2.js'),
        game3Prototype = require('./game-3.js'),
        game4Prototype = require('./game-4.js'),
        gameObjectFactory = require('./game-object-factory.js'),
        game1RendererProto = require('./game-1-renderer.js'),
        game2RendererProto = require('./game-2-renderer.js'),
        game3RendererProto = require('./game-3-renderer.js'),
        game4RendererProto = require('./game-4-renderer.js'),
        game1ObjectsManagerProto = require('./game-1-objects-manager.js'),
        game2ObjectsManagerProto = require('./game-2-objects-manager.js'),
        game3ObjectsManagerProto = require('./game-3-objects-manager.js'),
        game4ObjectsManagerProto = require('./game-4-objects-manager.js'),
        player = require('./player.js');

    function initializeGame1() {
        var playerShape = gameObjectFactory.getRectangle(constants.GAME1_BOARD_TOP_LEFT_POINT_X, constants.GAME1_BOARD_TOP_LEFT_POINT_Y,
                constants.GAME1_BOARD_WIDTH, constants.GAME1_BOARD_HEIGHT, constants.GAME1_BOARD_FILL,
                constants.GAME1_BOARD_STROKE, constants.GAME1_BOARD_STROKE_WIDTH),
            ball = gameObjectFactory.getCircle(constants.GAME1_BALL_START_X, constants.GAME1_BALL_START_Y, constants.GAME1_BALL_RADIUS,
                constants.GAME1_BALL_FILL, constants.GAME1_BALL_STROKE, constants.GAME1_BALL_STROKE_WIDTH),
            renderer = Object.create(game1RendererProto),
            somePlayer = Object.create(player).init(playerShape, 'none'),
            gameObjectsManager = Object.create(game1ObjectsManagerProto),
            game1;
        
        game1 = Object.create(game1Prototype).init(renderer, somePlayer, [ball], gameObjectsManager, constants.GAME1_INITIAL_ROTATION_ANGLE);

        return game1;
    }

    function initializeGame2() {
        var playerShape = gameObjectFactory.getRectangle(constants.GAME2_PLAYER_TOP_LEFT_POINT_X, constants.GAME2_PLAYER_TOP_LEFT_POINT_Y,
                constants.GAME2_PLAYER_WIDTH, constants.GAME2_PLAYER_HEIGHT, constants.GAME2_PLAYER_FILL, constants.GAME2_PLAYER_STROKE, constants.GAME2_PLAYER_STROKE_WIDTH),
            rightPointingObstacle = gameObjectFactory.getTriangle(constants.GAME2_RP_OBSTACLE_START_POINT_A_X, constants.GAME2_RP_OBSTACLE_START_POINT_A_Y,
                constants.GAME2_RP_OBSTACLE_START_POINT_B_X, constants.GAME2_RP_OBSTACLE_START_POINT_B_Y, constants.GAME2_RP_OBSTACLE_START_POINT_C_X,
                constants.GAME2_RP_OBSTACLE_START_POINT_C_Y, constants.GAME2_RP_OBSTACLE_FILL, constants.GAME2_RP_OBSTACLE_STROKE, constants.GAME2_RP_OBSTACLE_STROKE_WIDTH),
            leftPointingObstacle = gameObjectFactory.getTriangle(constants.GAME2_LP_OBSTACLE_START_POINT_A_X, constants.GAME2_LP_OBSTACLE_START_POINT_A_Y,
                constants.GAME2_LP_OBSTACLE_START_POINT_B_X, constants.GAME2_LP_OBSTACLE_START_POINT_B_Y, constants.GAME2_LP_OBSTACLE_START_POINT_C_X,
                constants.GAME2_LP_OBSTACLE_START_POINT_C_Y, constants.GAME2_LP_OBSTACLE_FILL, constants.GAME2_LP_OBSTACLE_STROKE, constants.GAME2_LP_OBSTACLE_STROKE_WIDTH),
            renderer = Object.create(game2RendererProto),
            somePlayer = Object.create(player).init(playerShape, 'none'),
            gameObjectsManager = Object.create(game2ObjectsManagerProto),
            game2,
            gameObstacles = [];

        rightPointingObstacle.id = 1;
        leftPointingObstacle.id = 2;
        gameObstacles.push(rightPointingObstacle, leftPointingObstacle);

        game2 = Object.create(game2Prototype).init(renderer, somePlayer, gameObstacles, gameObjectsManager);

        return game2;
    }

    function initializeGame3() {
        var playerShape = gameObjectFactory.getTriangle(constants.GAME3_PLAYER_TOP_LEFT_POINT_X,constants.GAME3_PLAYER_TOP_LEFT_POINT_Y,
                constants.GAME3_PLAYER_BOTTOM_LEFT_POINT_X,constants.GAME3_PLAYER_BOTTOM_LEFT_POINT_Y,constants.GAME3_PLAYER_RIGHT_POINT_X,
                constants.GAME3_PLAYER_RIGHT_POINT_Y, constants.GAME3_PLAYER_FILL, constants.GAME3_PLAYER_STROKE, constants.GAME3_PLAYER_STROKE_WIDTH),
            renderer = Object.create(game3RendererProto),
            somePlayer = Object.create(player).init(playerShape, 'down'),
            gameObjectsManager = Object.create(game3ObjectsManagerProto),
            game3;

        game3 = Object.create(game3Prototype).init(renderer, somePlayer, [], gameObjectsManager);

        return game3;
    }

    function initializeGame4() {
        var playerShape = gameObjectFactory.getRectangle(constants.GAME4_PLAYER_TOP_LEFT_POINT_X, constants.GAME4_PLAYER_TOP_LEFT_POINT_Y,
            constants.GAME4_PLAYER_WIDTH, constants.GAME4_PLAYER_HEIGHT, constants.GAME4_PLAYER_FILL, constants.GAME4_PLAYER_STROKE, constants.GAME4_PLAYER_STROKE_WIDTH),
            renderer = Object.create(game4RendererProto),
            somePlayer = Object.create(player).init(playerShape, 'down'),
            gameObjectsManager = Object.create(game4ObjectsManagerProto),
            game4;

        game4 = Object.create(game4Prototype).init(renderer, somePlayer, [], gameObjectsManager);

        return game4;
    }   

    return {
        initiateGames: function () {
            var games = [],
                game1 = initializeGame1(),
                game2 = initializeGame2(),
                game3 = initializeGame3(),
                game4 = initializeGame4();

            games.push(game1,
                       game2,
                       game3,
                       game4
                       );

            return games;
        }
    };
}());
},{"./constants.js":4,"./game-1-objects-manager.js":6,"./game-1-renderer.js":7,"./game-1.js":8,"./game-2-objects-manager.js":10,"./game-2-renderer.js":11,"./game-2.js":12,"./game-3-objects-manager.js":14,"./game-3-renderer.js":15,"./game-3.js":16,"./game-4-objects-manager.js":18,"./game-4-renderer.js":19,"./game-4.js":20,"./game-object-factory.js":22,"./player.js":28}],27:[function(require,module,exports){
module.exports = (function () {    
    var engine = {},
        games,
        gameOver = false,
        restart = require('./application.js'),
        parentContainer = document.getElementById('game-table'),
        score = 0,
        scoreInterval = setInterval(changeScore, 1000),
        scoreButton = document.getElementById('score-button');

    function changeScore() {
        score += 1;
    }

    function onScoreButtonClicked() {
        scoreButton.removeEventListener('click', onScoreButtonClicked);
        scoreButton.className = 'hidden';
        window.location.reload(true);
    }

    function onGameOver() {
        document.getElementById('game-1').innerHTML = '';
        document.getElementById('game-2').innerHTML = '';
        document.getElementById('game-3').innerHTML = '';
        document.getElementById('game-4').innerHTML = '';
        clearInterval(scoreInterval);
        scoreButton.className = 'visible';
        scoreButton.innerHTML = 'Score: ' + score;
        parentContainer.className = 'game-over';

        scoreButton.addEventListener('click', onScoreButtonClicked);
    }

    function updateGames() {
        games.forEach(function (game) {
            game.update();
        });
    }

    function checkGameOver() {
        gameOver = games.some(function (game) {
            return game.over;
        });
    }

    function runGames() {
        updateGames();
        checkGameOver();
        if (!gameOver) {
            requestAnimationFrame(runGames);
        }
        else {
            onGameOver();
        }
    }

    Object.defineProperty(engine, 'runGames', {
        value: function (gamesList) {
            games = gamesList
            runGames();
        }
    });

    return engine;
}());
},{"./application.js":2}],28:[function(require,module,exports){
module.exports = (function() {
    var player = {},
        validator = require('./validator.js');

    Object.defineProperty(player, 'init', {
        value: function (shape, direction) {
            this.shape = shape;
            this.direction = direction;

            return this;
        }
    });

    Object.defineProperty(player, 'shape', {
        get: function () {
            return this._shape;
        },
        set: function (value) {
            validator.validateIfGameObject(value, 'shape');
            this._shape = value;
        }
    });

    Object.defineProperty(player, 'direction', {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            validator.validateIfString(value, 'direction'); // Maybe better validation here;
            this._direction = value;
        }
    });

    return player;
}());
},{"./validator.js":34}],29:[function(require,module,exports){
module.exports = (function(parent) {
    var rectangleWithText = Object.create(parent),
        validator = require('./validator.js');

    Object.defineProperty(rectangleWithText, 'init', {
        value: function (xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth, text) {
            parent.init.call(this, xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth);
            this.text = text;

            return this;
        }
    });

    Object.defineProperty(rectangleWithText, 'text', {
        get: function () {
            return this._text;
        },
        set: function (value) {
            //validator.validateIfString(value, 'text');
            this._text = value;
        }
    });

    return rectangleWithText;
}(require('./rectangle.js')));
},{"./rectangle.js":30,"./validator.js":34}],30:[function(require,module,exports){
module.exports = (function (parent) {
    var rectangle = Object.create(parent),
        validator = require('./validator.js');

    Object.defineProperty(rectangle, 'init', {
        value: function (xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth) {
            parent.init.call(this, xCoordinate, yCoordinate, collisionProfile, fill, stroke, strokeWidth);
            this.width = width;
            this.height = height;

            return this;
        }
    });

    Object.defineProperty(rectangle, 'width', {
        get: function () {
            return this._width;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'width');
            this._width = value;
        }
    });

    Object.defineProperty(rectangle, 'height', {
        get: function () {
            return this._height;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'height');
            this._height = value;
        }
    });

    Object.defineProperty(rectangle, 'getCoordinatesAsArray', {
        value: function () {
            var coordinatesAsArray = parent.getCoordinatesAsArray.call(this),
                bX = this.xCoordinate + this.width,
                bY = this.yCoordinate,
                cX = this.xCoordinate + this.width,
                cY = this.yCoordinate + this.height,
                dX = this.xCoordinate,
                dY = this.yCoordinate + this.height;

            coordinatesAsArray = coordinatesAsArray.concat([bX, bY, cX, cY, dX, dY]);
            return coordinatesAsArray;
        }
    });

    return rectangle;
}(require('./game-object.js')));
},{"./game-object.js":24,"./validator.js":34}],31:[function(require,module,exports){
module.exports = (function() {
    var renderer = {},
        gameError = require('./game-errors.js');

    Object.defineProperty(renderer, 'clearStage', {
        value: function () {
            throw new gameError.NotImplementedError('Your renderer needs to implement the "abstract" method clearStage');
        }
    });

    Object.defineProperty(renderer, 'render', {
        value: function (gameObject) {
            throw new gameError.NotImplementedError('Your renderer needs to implement the "abstract" method render');
        }
    });

    return renderer;
}());
},{"./game-errors.js":21}],32:[function(require,module,exports){
var run = require('./application.js');
run();
},{"./application.js":2}],33:[function(require,module,exports){
module.exports = (function (parent) {
    var triangle = Object.create(parent),
        validator = require('./validator.js');

    Object.defineProperty(triangle, 'init', {
        value: function (xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, collisionProfile, fill, stroke, strokeWidth) {
            parent.init.call(this, xCoordinateA, yCoordinateA, collisionProfile, fill, stroke, strokeWidth);
            this.xCoordinateB = xCoordinateB;
            this.yCoordinateB = yCoordinateB;
            this.xCoordinateC = xCoordinateC;
            this.yCoordinateC = yCoordinateC;

            return this;
        }
    });

    // Triangle's xCoordinate and yCoordinate are the coordinates of its point A.
    Object.defineProperty(triangle, 'xCoordinateA', {
        get: function () {
            return this.xCoordinate;
        },
        set: function (value) {
            this.xCoordinate = value;
        }
    });

    Object.defineProperty(triangle, 'yCoordinateA', {
        get: function () {
            return this.yCoordinate;
        },
        set: function (value) {
            this.yCoordinate = value;
        }
    });

    Object.defineProperty(triangle, 'xCoordinateB', {
        get: function () {
            return this._xCoordinateB;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, "xCoordinateB");
            this._xCoordinateB = value;
        }
    });

    Object.defineProperty(triangle, 'yCoordinateB', {
        get: function () {
            return this._yCoordinateB;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, "yCoordinateB");
            this._yCoordinateB = value;
        }
    });

    Object.defineProperty(triangle, 'xCoordinateC', {
        get: function () {
            return this._xCoordinateC;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, "xCoordinateC");
            this._xCoordinateC = value;
        }
    });

    Object.defineProperty(triangle, 'yCoordinateC', {
        get: function () {
            return this._yCoordinateC;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, "yCoordinateC");
            this._yCoordinateC = value;
        }
    });

    Object.defineProperty(triangle, 'getCoordinatesAsArray', {
        value: function () {
            var coordinatesAsArray = parent.getCoordinatesAsArray.call(this);
            coordinatesAsArray = coordinatesAsArray.concat([this.xCoordinateB, this.yCoordinateB, this.xCoordinateC, this.yCoordinateC]);
            return coordinatesAsArray;
        }
    });

    return triangle;
}(require('./game-object.js')));

},{"./game-object.js":24,"./validator.js":34}],34:[function(require,module,exports){
module.exports = (function () {
    var validator = {},
        CONSTANTS = require('./constants.js');

    function isRealNumber(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    function isInteger(number) {
        return number === parseInt(number, 10);
    }

    Object.defineProperty(validator, 'validateNotNullAndUndefined', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (value == undefined) {
                throw new TypeError(valueName + ' cannot be null and undefined.');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfBoolean', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (typeof value !== 'boolean') {
                throw new TypeError(valueName + ' must be a boolean');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfRealNumber', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (isRealNumber(value) === false) {
                throw new TypeError(valueName + ' must be a real number');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfPositiveNumber', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateIfRealNumber(value, valueName);

            if (value <= 0) {
                throw new RangeError(valueName + ' must be a positive number');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfInteger', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (isInteger(value) === false) {
                throw new TypeError(valueName + ' must be an integer');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfString', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (typeof value !== 'string') {
                throw new TypeError(valueName + ' must be a string');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfArray', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (!(value instanceof Array)) {
                throw new TypeError(valueName + ' must be an array');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfGameObject', {
        value: function (value, valueName) {
            var gameObject = require('./game-object.js');

            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateNotNullAndUndefined(value, valueName);

            if (!gameObject.isPrototypeOf(value)) {
                throw new TypeError(valueName + ' must be a gameObject');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfPlayer', {
        value: function (value, valueName) {
            var player = require('./player.js');
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateNotNullAndUndefined(value, valueName);

            if (!player.isPrototypeOf(value)) {
                throw new TypeError(valueName + ' must be a player');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfRenderer', {
        value: function (value, valueName) {
            var renderer = require('./renderer.js'),

                valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateNotNullAndUndefined(value, valueName);

            if (!renderer.isPrototypeOf(value)) {
                throw new TypeError(valueName + ' must be a renderer');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfCollisionProfile', {
        value: function (value, valueName) {
            var SAT = require('sat');

            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateNotNullAndUndefined(value, valueName);

            if (!((value instanceof SAT.Circle) || (value instanceof SAT.Polygon))) {
                throw new TypeError(valueName + ' must be a SAT.Circle or SAT.Polygon');
            }
        }
    });

    return validator;
}());
},{"./constants.js":4,"./game-object.js":24,"./player.js":28,"./renderer.js":31,"sat":1}]},{},[4,21,34,24,3,33,30,29,22,28,31,7,11,15,19,5,9,13,17,25,8,12,16,20,26,27,2,32]);
