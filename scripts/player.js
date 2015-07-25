module.exports = (function() {
    var player = {},
        validator = require('./validator.js');

    Object.defineProperty(player, 'init', {
        value: function (shape) {
            this.shape = shape;

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

    return player;
}());