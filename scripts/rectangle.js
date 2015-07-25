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

    return rectangle;
}(require('./game-object.js')));