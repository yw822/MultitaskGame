var game = (function () {
    var game = {};

    Object.defineProperty(game, 'init', {
        value: function (renderer, player, gameObjects, gameObjectsManager) { //TODO: provide collisionDetector
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
            // some validation eventually
            this._renderer = value;
        }
    });

    Object.defineProperty(game, 'gameObjectsManager', {
        get: function () {
            return this._gameObjectsManager;
        },
        set: function (value) {
            // some validation eventually
            this._gameObjectsManager = value;
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

    Object.defineProperty(game, 'addGameObject', {
        value: function (value) {
            validator.validateIfGameObject(value, 'gameObject');
            this.gameObjects.push(value);
        }
    });

    Object.defineProperty(game, 'removeGameObject', {
        value: function (value) {
            var index,
                removedGameObject;

            validator.validateIfGameObject(value, 'gameObject');

            index = this.gameObjects.indexOf(value);

            this.gameObjects.splice(index, 1);

            //if (index >= 0) {
            //    removedGameObject = this.gameObjects.splice(index, 1)[0];
            //} else {
            //    removedGameObject = null;
            //}

            //return removedGameObject;
        }
    });

    Object.defineProperty(game, 'removeGameObjectByIndex', {
        value: function (index) {
            var removedGameObject;

            validator.validateIfInteger(index, 'index');

            removedGameObject = this.gameObjects.splice(index, 1)[0];

            return removedGameObject;
        }
    });

    return game;
}());