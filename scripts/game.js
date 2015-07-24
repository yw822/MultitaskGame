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
            validator.validateIfBoolean(value, 'over');
            this._over = value;
        }
    });

    Object.defineProperty(game, 'update', {
        value: function () {
            throw new NotImplementedError('Your game needs to implement the "abstract" method update');
        }
    });

    return game;
}());