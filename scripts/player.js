var player = (function() {
    var player = {};

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