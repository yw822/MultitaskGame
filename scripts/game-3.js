module.exports = (function (parent) {
     var game3 = Object.create(parent);       

    // When the game is over, please set game3.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game3, 'init', {
        value: function () {
            //TODO: This vars must be provided, and not hardcoded here. Move them in the initializator.
            var gameObjectFactory = require('./game-object-factory.js'),
                game3Renderer = require('./game-3-renderer.js'),
                player = require('./player.js'),
                game3ObjectsManager = require('./game-3-Objects-Manager.js'),
                playerShape = gameObjectFactory.getTriangle(50, 180, 50, 200, 65, 190, 'azure', 'purple', 2),
                renderer = Object.create(game3Renderer),
                somePlayer = Object.create(player).init(playerShape, 'down'),
                gameObjectsManager = Object.create(game3ObjectsManager);            

            parent.init.call(this, renderer, somePlayer, [], gameObjectsManager);
            return this;
        }
    });

    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game3, 'update', {
        value: function () {
            parent.update.call(this);
            // TODO: Consider how the gameObjectManager can provide general methods here
            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.startChangeDirectionListener(this);
            this.gameObjectsManager.movePlayer(this.player);
            // Check for collision: TODO in the game-3-objects-manager.js
            this.gameObjectsManager.manageCollisions(this, this.player, this.gameObjects);
        }
    });

    return game3;
}(require('./game.js')));
