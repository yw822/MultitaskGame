module.exports = (function (parent) {
    var game4 = Object.create(parent);

    // When the game is over, please set game4.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game4, 'init', {
        value: function (renderer, player, gameObjects) {
            parent.init.call(this, renderer, player, gameObjects);

            return this;
        }
    });

    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game4, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.render(this.player.shape);
            this.gameObjects.forEach(this.renderer.render);
            // Move gameObjects
            // Check for collision
        }
    });

    return game4;
}(require('./game.js')));