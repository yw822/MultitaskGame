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