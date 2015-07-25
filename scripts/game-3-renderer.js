var game3Renderer = (function (parent) {
    var game3Renderer = Object.create(parent);
    // Consider declaring here a private variable to hold your Canvas Context or SVG element.

    function renderGameObject(gameObject) {
        // You can use this helper function to draw game objects.
        // Hint! player.shape is a game object and gameObjects is an array of game objects.
    }

    Object.defineProperty(game3Renderer, 'clearStage', {
        value: function () {
            //TODO: Implement this method to clear the Canvas. If you are using SVG, you can leave this method empty. Your choice :)

            //Delete this line!
            parent.clearStage.call(this);
        }
    });

    Object.defineProperty(game3Renderer, 'renderPlayer', {
        value: function (player) {
            //TODO: Implement this method to render the player.

            //Delete this line!
            parent.renderPlayer.call(this, player);
        }
    });

    Object.defineProperty(game3Renderer, 'renderGameObjects', {
        value: function (gameObjects) {
            //TODO: Implement this method to render the game objects.

            //Delete this line!
            parent.renderGameObjects.call(this, gameObjects);
        }
    });

    return game3Renderer;
}(renderer));