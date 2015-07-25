var game = (function () {
    var game = {};

    Object.defineProperty(game, 'init', {
        value: function (renderer, player, gameObjects) { //TODO: Make renderer superclass //TODO: provide collisionDetector
            this.player = player;
            this.gameObjects = gameObjects || [];
            this.over = false;

            return this;
        }
    });

    Object.defineProperty(game, 'player', {
        get: function () {
            return this._player;
        },
        set: function (value) {
            validator.validateIfPlayer(value, 'player');
            this._player = value;
        }
    });

    Object.defineProperty(game, 'gameObjects', {
        get: function () {
            return this._gameObjects;
        },
        set: function (value) {
            validator.validateIfArray(value, 'gameObjects');
            value.forEach(function (val) {
                validator.validateIfGameObject(val, 'Each value in gameObjects');
            });
            this._gameObjects = value;
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