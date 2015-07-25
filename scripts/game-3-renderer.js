var game3Renderer = (function (parent) {
    var game3Renderer = Object.create(parent);
    // Consider declaring here a private variable to hold your Canvas Context or SVG element.

    Object.defineProperty(game3Renderer, 'clearStage', {
        value: function () {
            //TODO: Implement this method to clear the Canvas. If you are using SVG, you can leave this method empty. Your choice :)

            //Delete this line!
            parent.clearStage.call(this);
        }
    });

    Object.defineProperty(game3Renderer, 'render', {
        value: function (gameObject) {
            //TODO: Implement this method to render the game objects.

            //Delete this line!
            parent.render.call(this, gameObject);
        }
    });

    return game3Renderer;
}(renderer));