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
                bX = this.xCoordinate,
                bY = this.yCoordinate + this.height,
                cX = this.xCoordinate + this.width,
                cY = this.yCoordinate + this.height,
                dX = this.xCoordinate + this.width,
                dY = this.yCoordinate;

            coordinatesAsArray = coordinatesAsArray.concat([bX, bY, cX, cY, dX, dY]);
            return coordinatesAsArray;
        }
    });

    return rectangle;
}(require('./game-object.js')));