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
