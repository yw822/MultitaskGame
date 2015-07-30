module.exports = (function (parent) {
    var game4 = Object.create(parent);
    
    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game4, 'update', {
        value: function () {
            parent.update.call(this);
            // Do stuff with this.gameObjectManager
            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.startChangeDirectionListener(this);
            this.gameObjectsManager.movePlayer(this.player);

            this.gameObjectsManager.manageState(this, this.player, this.gameObjects);
        }
    });

    return game4;
}(require('./game.js')));