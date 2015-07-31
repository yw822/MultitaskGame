module.exports = (function (parent) {
    var game2 = Object.create(parent);

    Object.defineProperty(game2, 'update', {
        value: function () {
            parent.update.call(this);

            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.startChangeDirectionListener();
            this.gameObjectsManager.movePlayer(this.player);

            this.gameObjectsManager.manageState(this, this.player, this.gameObjects);
        }
    });

    return game2;
}(require('./game.js')));