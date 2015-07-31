module.exports = (function () {
    var game = {},
        validator = require('./validator.js');

    Object.defineProperty(game, 'init', {
        value: function (renderer, player, gameObjects, gameObjectsManager) { 
            this.renderer = renderer;
            this.player = player;
            this.gameObjects = gameObjects || [];
            this.gameObjectsManager = gameObjectsManager;
            this.over = false;

            return this;
        }
    });

    Object.defineProperty(game, 'renderer', {
        get: function () {
            return this._renderer;
        },
        set: function (value) {
            validator.validateIfRenderer(value, 'renderer');
            this._renderer = value;
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

    Object.defineProperty(game, 'gameObjectsManager', {
        get: function () {
            return this._gameObjectsManager;
        },
        set: function (value) {
            //TODO: Add validation or meybe not before circular dependency is understood.
            this._gameObjectsManager = value;
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
            this.renderer.clearStage();
            this.renderer.render(this.player.shape);
            this.gameObjects.forEach(this.renderer.render);
        }
    });    

    return game;
}());