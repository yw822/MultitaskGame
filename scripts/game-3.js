module.exports = (function (parent) {
    var game3 = Object.create(parent);
    
    // Not needed for this game. May be needed for the others.
    //Object.defineProperty(game3, 'init', {
    //    value: function (renderer, somePlayer, obstacles, gameObjectsManager) {
    //        parent.init.call(this, renderer, somePlayer, [], gameObjectsManager);

    //        return this;
    //    }
    //});

    //TODO: check if it is possible to move this logic to parent. Not for now.
    Object.defineProperty(game3, 'update', {
        value: function () {
            parent.update.call(this);
            // TODO: Consider how the gameObjectManager can provide general methods here
            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.startChangeDirectionListener(this);
            this.gameObjectsManager.movePlayer(this.player);

            this.gameObjectsManager.manageState(this, this.player, this.gameObjects);
        }
    });

    return game3;
}(require('./game.js')));
