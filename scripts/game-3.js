module.exports = (function (parent) {
    var game3 = Object.create(parent);

    Object.defineProperty(game3, 'update', {
        value: function () {
            parent.update.call(this);
            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.startChangeDirectionListener(this);
            this.gameObjectsManager.movePlayer(this.player);

            this.gameObjectsManager.manageState(this, this.player, this.gameObjects);
        }
    });

    return game3;
}(require('./game.js')));
