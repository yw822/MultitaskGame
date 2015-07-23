var game = (function () {
    var game = {};

    Object.defineProperty(game, 'init', {
        value: function () {
            this.over = false;

            return this;
        }
    });

    Object.defineProperty(game, 'over', {
        get: function () {
            return this._over;
        },
        set: function (value) {
            validator.validateBoolean(value, 'over');
            this._over = value;
        }
    });

    Object.defineProperty(game, 'update', {
        value: function () {
            throw new NotImplementedError('You must implement the "abstract" method update');
        }
    });

    return game;
}());