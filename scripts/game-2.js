var game2 = (function (parent) {
    var game2 = Object.create(parent);

    // When the game is over, please set game1.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game2, 'init', {
        value: function () {
            parent.init.call(this);

            return this;
        }
    });

    Object.defineProperty(game2, 'update', {
        value: function () {
            // TODO: Implement this method to redraw your canvas/svg

            // Delete this line!
            parent.update.call(this);
        }
    });

    return game2;
}(game));