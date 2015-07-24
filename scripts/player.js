var player = (function() {
    var player = {};

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