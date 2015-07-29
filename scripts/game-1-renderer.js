module.exports = (function (parent) {
    var game1Renderer = Object.create(parent),
        constants = require('./constants.js'),
        circle = require('./circle.js'),
        stage = new Kinetic.Stage({
            container: document.getElementById('game-1'),
            width: constants.CANVAS_WIDTH,
            height: constants.CANVAS_HEIGHT
        }),
        layer = new Kinetic.Layer({ width: 300, height: 200});

    Object.defineProperty(game1Renderer, 'clearStage', {
        value: function () {
            layer.removeChildren();
        }
    });

    Object.defineProperty(game1Renderer, 'render', {
        value: function (gameObject, rotationAngle) {
            var figure;
            if (circle.isPrototypeOf(gameObject)) {
                figure = new Kinetic.Circle({
                    x: gameObject.xCoordinate,
                    y: gameObject.yCoordinate,
                    radius: gameObject.radius,
                    fill: gameObject.fill,
                    stroke: gameObject.stroke,
                    strokeWidth: gameObject.strokeWidth
                });
            }
            else {
                figure = new Kinetic.Line({
                    points: gameObject.getCoordinatesAsArray(),
                    stroke: gameObject.stroke,
                    fill: gameObject.fill,
                    strokeWidth: gameObject.strokeWidth,
                    closed: true
                });
            }           

            layer.add(figure);
            var w = layer.getWidth(),
                h = layer.getHeight();
            layer.setOffset({x:w / 2,y:h / 2});
            layer.setPosition({ x: w / 2, y: h / 2 });
            layer.rotateDeg(rotationAngle);
            stage.add(layer);
        }
    });

    return game1Renderer;
}(require('./renderer.js')));