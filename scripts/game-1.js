module.exports = (function (parent) {
    var game1 = Object.create(parent);

    // When the game is over, please set game1.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game1, 'init', {
        value: function (renderer, player, gameObjects, gameObjectsManager, boardRotationAngle) {
            parent.init.call(this, renderer, player, gameObjects, gameObjectsManager);
            this.boardRotationAngle = boardRotationAngle;

            return this;
        }
    });

    Object.defineProperty(game1, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.render(this.player.shape, this.boardRotationAngle);
            this.gameObjects.forEach(this.renderer.render, this.boardRotationAngle);

            this.gameObjectsManager.manageBall(this);
            this.gameObjectsManager.startChangeDirectionListener(this);
            this.gameObjectsManager.movePlayer(this);
            this.gameObjectsManager.manageState(this);
        }
    });

    Object.defineProperty(game1, 'boardRotationAngle', {
        get: function () {
            return this._boardRotationAngle;
        },
        set: function (value) {
            this._boardRotationAngle = value;
        }
    });

    return game1;
}(require('./game.js')));