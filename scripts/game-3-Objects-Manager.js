var game3ObjectsManager = (function () {
    var game3ObjectsManager = {};

    // Magic numbers --> constants in the constants.js

    // Obstacles logic
    function maintainSpecifiedNumberOfEnemies(obstacles) {
        var index = 0,
            randomYCoord;
        if (obstacles.length === 0) {
            randomYCoord = Math.random() * 150;
            var newObstacle = gameObjectFactory.getRectangle(300, randomYCoord, 15, 50, 'black', 'none', 1);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle) {
            return obstacle.xCoordinate === 140;
        })) {
            randomYCoord = Math.random() * 150;
            var newObstacle = gameObjectFactory.getRectangle(300, randomYCoord, 15, 50, 'black', 'none', 1);
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
        obstacles.forEach(function (obstacle) {
            obstacle.xCoordinate -= 1; // some variable called speed.
        });
    }

    Object.defineProperty(game3ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
            moveEnemyObjects(obstacles);
            maintainSpecifiedNumberOfEnemies(obstacles);
        }
    });

    Object.defineProperty(game3ObjectsManager, 'movePlayer', {
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

            // Events to change the player direction
            window.addEventListener('keydown', function (e) {
                if (e.keyCode === 32) {
                    e.preventDefault();
                    player.direction = 'up';
                }
            }, false);

            window.addEventListener('keyup', function (e) {
                if (e.keyCode === 32) {
                    e.preventDefault();
                    player.direction = 'down';
                }
            }, false);
        }
    });

    Object.defineProperty(game3ObjectsManager, 'manageCollisions', {
        value: function (player, obstacles) {
            // TODO: implement collision logic
        }
    });

    return game3ObjectsManager;
}());