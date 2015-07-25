function gameObjectFactory(){
    return {
        getRectangle: function (xCoordinate, yCoordinate, width, height, fill, stroke, strokeWidth) {
            return Object.create(rectangle).init(xCoordinate, yCoordinate, width, height, fill, stroke, strokeWidth)
        },
        getRectangleWithText: function (xCoordinate, yCoordinate, width, height, fill, stroke, strokeWidth, text) {
            return Object.create(rectangleWithText).init(xCoordinate, yCoordinate, width, height, fill, stroke, strokeWidth, text)
        },
        getTriangle: function (xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, fill, stroke, strokeWidth) {
            return Object.create(triangle).init(xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, fill, stroke, strokeWidth)
        },
        getCircle: function (xCoordinate, yCoordinate, radius, fill, stroke, strokeWidth) {
            return Object.create(circle).init(xCoordinate, yCoordinate, radius, fill, stroke, strokeWidth)
        }
    };
}