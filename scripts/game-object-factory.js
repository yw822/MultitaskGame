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