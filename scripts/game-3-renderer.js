module.exports = (function (parent) {
    var game3Renderer = Object.create(parent),
        constants = require('./constants.js'),
        stage = new Kinetic.Stage({
            container:  document.getElementById('game-3'),
            width: constants.CANVAS_WIDTH,            
            height: constants.CANVAS_HEIGHT
        }),
        layer = new Kinetic.Layer();

    Object.defineProperty(game3Renderer, 'clearStage', {
        value: function () {
            layer.removeChildren();
        }
    });   

    Object.defineProperty(game3Renderer, 'render', {
        value: function (gameObject) {
            var figure = new Kinetic.Line({
                    points: gameObject.getCoordinatesAsArray(),
                    stroke: gameObject.stroke,
                    fill: gameObject.fill,
                    strokeWidth: gameObject.strokeWidth,
                    closed: true
                });

            layer.add(figure);
            stage.add(layer);
        }
    });

    return game3Renderer;
}(require('./renderer.js')));
