module.exports = (function (parent) {
    var game3Renderer = Object.create(parent),
        stage = new Kinetic.Stage({
            //TODO: extract this hardcoded values in constants width, height.
            container:  document.getElementById('game-3'),
            width: 300,
            height: 201
        }),
        layer = new Kinetic.Layer();

    Object.defineProperty(game3Renderer, 'clearStage', {
        value: function () {
            layer.removeChildren();
            //Delete this line!
            // parent.clearStage.call(this);
        }
    });   

    Object.defineProperty(game3Renderer, 'render', {
        value: function (gameObject) {
            var figure = new Kinetic.Line({
                    points: gameObject.getCoordinatesAsArray(),
                    stroke: gameObject.stroke,
                    fill: gameObject.fill,
                    strokeWidth: gameObject.strokeWidth,
                    closed: true,
                //TODO: extract this hardcoded value tension
                    //tension: 0.4
                });

            layer.add(figure);
            stage.add(layer);

            //Delete this line!
            //parent.render.call(this, gameObject);
        }
    });

    return game3Renderer;
}(require('./renderer.js')));
