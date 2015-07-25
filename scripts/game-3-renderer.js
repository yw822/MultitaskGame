var game3Renderer = (function (parent) {
    var game3Renderer = Object.create(parent),
        stage = new Kinetic.Stage({
            container:  document.getElementById('game-3'),
            width: 300,
            height: 200
        });

    Object.defineProperty(game3Renderer, 'clearStage', {
        value: function () {
            stage.removeChildren()
            //Delete this line!
            // parent.clearStage.call(this);
        }
    });   

    Object.defineProperty(game3Renderer, 'renderPlayer', {
        value: function (playerShape) {
            var playerLayer = new Kinetic.Layer(),
                playerFigure = new Kinetic.Line({
                    points: [playerShape.xCoordinateA, playerShape.yCoordinateA, playerShape.xCoordinateB, playerShape.yCoordinateB, playerShape.xCoordinateC, playerShape.yCoordinateC],
                    stroke: playerShape.stroke,
                    fill: playerShape.fill,
                    strokeWidth: playerShape.strokeWidth,
                    closed: true,
                    tension: 0.4
                });

            playerLayer.add(playerFigure);
            stage.add(playerLayer);

            //Delete this line!
            //parent.render.call(this, gameObject);
        }
    });

    Object.defineProperty(game3Renderer, 'renderEnemies', {
        value: function (enemyObjectCollection) {
            var enemyLayer = new Kinetic.Layer();
            enemyObjectCollection.forEach(function (enemy) {
                var enemyFigure = new Kinetic.Rect({
                    stroke: enemy.stroke,
                    fill: enemy.fill,
                    x: enemy.xCoordinate,
                    y: enemy.yCoordinate,
                    width: enemy.width,
                    height: enemy.height
                });

                enemyLayer.add(enemyFigure);
            });
                
            stage.add(enemyLayer);

            //Delete this line!
            //parent.render.call(this, gameObject);
        }
    });

    return game3Renderer;
}(renderer));