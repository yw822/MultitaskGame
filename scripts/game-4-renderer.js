module.exports = (function (parent) {
    var game4Renderer = Object.create(parent),
        constants = require('./constants.js'),
        rectWithText = require('./rectangle-with-text.js'),
        stage = new Kinetic.Stage({
            container: document.getElementById('game-4'),
            width: constants.CANVAS_WIDTH,
            height: constants.CANVAS_HEIGHT
        }),
        layer = new Kinetic.Layer();

    Object.defineProperty(game4Renderer, 'clearStage', {
        value: function () {
            layer.removeChildren();
        }
    });

    Object.defineProperty(game4Renderer, 'render', {
        value: function (gameObject) {
            var figure = new Kinetic.Line({
                points: gameObject.getCoordinatesAsArray(),
                fill: gameObject.fill,
                stroke: gameObject.stroke,
                strokeWidth: gameObject.strokeWidth,
                closed: true
            });

            layer.add(figure);

            if (rectWithText.isPrototypeOf(gameObject)) {
                var text = new Kinetic.Text({
                    x: gameObject.xCoordinate + 10,
                    y: gameObject.yCoordinate + 5,
                    text: gameObject.text.toString(),
                    fontSize: 25,
                    fontFamily: 'Calibri',
                    fill: 'white'
                });

                layer.add(text);
            }

            stage.add(layer);
        }
    });

    return game4Renderer;
}(require('./renderer.js')));