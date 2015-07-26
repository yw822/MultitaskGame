module.exports = (function () {
    var rectangle = require('./rectangle.js'),
        rectangleWithText = require('./rectangle-with-text.js'),
        triangle = require('./triangle.js'),
        circle = require('./circle.js');

    return {
        getRectangle: function (xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth) {
            return Object.create(rectangle).init(xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth);
        },
        getRectangleWithText: function (xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth, text) {
            return Object.create(rectangleWithText).init(xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth, text);
        },
        getTriangle: function (xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, collisionProfile, fill, stroke, strokeWidth) {
            return Object.create(triangle).init(xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, collisionProfile, fill, stroke, strokeWidth);
        },
        getCircle: function (xCoordinate, yCoordinate, radius, collisionProfile, fill, stroke, strokeWidth) {
            return Object.create(circle).init(xCoordinate, yCoordinate, radius, collisionProfile, fill, stroke, strokeWidth);
        }
    };
}());