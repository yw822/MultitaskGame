var renderer = (function() {
    var renderer = {};

    Object.defineProperty(renderer, 'clearStage', {
        value: function () {
            throw new NotImplementedError('Your renderer needs to implement the "abstract" method clearStage');
        }
    });

    Object.defineProperty(renderer, 'renderPlayer', {
        value: function (player) {
            throw new NotImplementedError('Your renderer needs to implement the "abstract" method renderPlayer');
        }
    });

    Object.defineProperty(renderer, 'renderGameObjects', {
        value: function (gameObjects) {
            throw new NotImplementedError('Your renderer needs to implement the "abstract" method renderGameObjects');
        }
    });

    Object.defineProperty(renderer, 'renderAll', {
        value: function (player, gameObjects) {
            this.clearStage();
            this.renderPlayer(player);
            this.renderGameObjects(gameObjects);
        }
    });

    return renderer;
}());