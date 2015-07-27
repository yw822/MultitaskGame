module.exports = (function (parent) {
    var game3ObjectsManager = Object.create(parent);

    // Magic numbers --> constants in the constants.js

    // Obstacles logic
    function maintainSpecifiedNumberOfEnemies(obstacles) {
        var index = 0,
            randomYCoord,
            gameObjectFactory = require('./game-object-factory.js'),
            newObstacle;

        if (obstacles.length === 0) {
            randomYCoord = Math.random() * 150;
            newObstacle = gameObjectFactory.getRectangle(300, randomYCoord, 15, 50, 'black', 'none', 1);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle) {
            return obstacle.xCoordinate === 140;
        })) {
            randomYCoord = Math.random() * 150;
            newObstacle = gameObjectFactory.getRectangle(300, randomYCoord, 15, 50, 'black', 'none', 1);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle, index) {
            return obstacle.xCoordinate === 0;
        })) {
            obstacles.splice(index, 1);
        }
    }       

    function moveEnemyObjects(obstacles) {
        //TODO: use gameObjectManager (<-- the parent) method move, because it moves the collision profile with the figure.
        obstacles.forEach(
        //    function (obstacle) {
        //    obstacle.xCoordinate -= 1; // some variable called speed.
        //}
            function (obstacle) {
                parent.move(obstacle, -1, 0);
            }
        );
    }

    Object.defineProperty(game3ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
            moveEnemyObjects(obstacles);
            maintainSpecifiedNumberOfEnemies(obstacles);
        }
    });

    Object.defineProperty(game3ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            document.addEventListener('keydown', downpressHandle);
            document.addEventListener('keyup', upHandle);

            function downpressHandle(key) {
                if (key.keyCode === 32) {
                    game.player.direction = 'up';
                    document.removeEventListener('keydown', downpressHandle);
                }
            }
            function upHandle(key) {
                if (key.keyCode === 32) {
                    game.player.direction = 'down';
                    document.removeEventListener('keyup', upHandle);
                }
            }
        }
    });    

    Object.defineProperty(game3ObjectsManager, 'movePlayer', {
        //TODO: use gameObjectManager (<-- the parent) method move, because it moves the collision profile with the figure.
        value: function (player) {
            if (player.shape.yCoordinateA < 180 && player.direction === 'down') {
                player.shape.yCoordinateA += 1; // some variable called speed.
                player.shape.yCoordinateB += 1; // some variable called speed.
                player.shape.yCoordinateC += 1; // some variable called speed.
            }

            if (player.shape.yCoordinateA >= 0 && player.direction === 'up') {
                player.shape.yCoordinateA -= 1; // some variable called speed.
                player.shape.yCoordinateB -= 1; // some variable called speed.
                player.shape.yCoordinateC -= 1; // some variable called speed.
            }
        }
    });

    Object.defineProperty(game3ObjectsManager, 'manageCollisions', {
        value: function (player, obstacles) {
            // TODO: implement collision logic
        }
    });

    return game3ObjectsManager;
}(require('./game-object-manager.js')));