module.exports = (function (parent) {
    var game3ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js');

    // Obstacles logic
    function maintainSpecifiedNumberOfEnemies(obstacles) {
        var index = 0,
            randomYCoord,
            gameObjectFactory = require('./game-object-factory.js'),
            newObstacle;

        if (obstacles.length === 0) {
            randomYCoord = Math.random() * constants.GAME3_OBSTACLE_MAX_Y;
            newObstacle = gameObjectFactory.getRectangle(constants.GAME3_OBSTACLE_START_POINT_X, randomYCoord,
                constants.GAME3_OBSTACLE_WIDTH, constants.GAME3_OBSTACLE_HEIGHT, constants.GAME3_OBSTACLE_FILL,
                constants.GAME3_OBSTACLE_STROKE, constants.GAME3_OBSTACLE_STROKE_WIDTH);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle) {
            return obstacle.xCoordinate === constants.GAME3_POINT_TO_RELEASE_NEW_OBSTACLE_X;
        })) {
            randomYCoord = Math.random() * constants.GAME3_OBSTACLE_MAX_Y;
            newObstacle = gameObjectFactory.getRectangle(constants.GAME3_OBSTACLE_START_POINT_X, randomYCoord,
                constants.GAME3_OBSTACLE_WIDTH, constants.GAME3_OBSTACLE_HEIGHT, constants.GAME3_OBSTACLE_FILL,
                constants.GAME3_OBSTACLE_STROKE, constants.GAME3_OBSTACLE_STROKE_WIDTH);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle, index) {
            return obstacle.xCoordinate === constants.GAME3_POINT_TO_REMOVE_OBSTACLE_X;
        })) {
            obstacles.splice(index, 1);
        }
    }       

    function moveEnemyObjects(obstacles) {
        obstacles.forEach(function (obstacle) {
            parent.move(obstacle, -constants.GAME3_OBSTACLE_STEP, 0);
            });
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
        value: function (player) {
            if (player.shape.yCoordinateA < constants.GAME3_PLAYER_MAX_Y && player.direction === 'down') {
                parent.move(player.shape, 0, constants.GAME3_PLAYER_STEP);
            }

            if (player.shape.yCoordinateA >= constants.GAME3_PLAYER_MIN_Y && player.direction === 'up') {
                parent.move(player.shape, 0, -constants.GAME3_PLAYER_STEP);
            }
        }
    });

    Object.defineProperty(game3ObjectsManager, 'manageCollisions', {
        value: function (game, player, obstacles) {
            var collisionHappened = obstacles.some(function(obstacle){
                return sat.testPolygonPolygon(obstacle.collisionProfile, player.shape.collisionProfile);
            });
            
            if (collisionHappened) {
                // Uncomment this to have a game over condition.
                // game.over = true;
            }
        }
    });

    return game3ObjectsManager;
}(require('./game-object-manager.js')));