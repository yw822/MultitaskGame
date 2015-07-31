module.exports = (function (parent) {
    var game2ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js'),
        isUpArrowKeyPressed = false,
        isDownArowKeyPressed = false,
        possibleYCoordsForObstacles = [55, 75, 95, 115, 135],
        len = possibleYCoordsForObstacles.length,
        randomFirstYCoord,
        randomSecondYCoord;

    function moveEnemyObjects(obstacles) {
        var rightPointingObstacle = obstacles[0],
            leftPointingObstacle = obstacles[1];

        parent.move(rightPointingObstacle, constants.GAME2_OBSTACLES_STEP, 0);
        parent.move(leftPointingObstacle, -constants.GAME2_OBSTACLES_STEP, 0);
    }

    function maintainObstaclesNumber(obstacles) {
        var dx,
            dy;

        if (obstacles[0].xCoordinateA >= constants.GAME2_POINT_TO_RESET_RP_OBSTACLE_X) {
            dx = - 205;
            randomFirstYCoord = possibleYCoordsForObstacles[Math.round(Math.random() * (len - 1))];
            dy = -(obstacles[0].yCoordinateA - randomFirstYCoord);
            parent.move(obstacles[0], dx, dy);
        }

        if (obstacles[1].xCoordinateA <= constants.GAME2_POINT_TO_RESET_LP_OBSTACLE_X) {
            dx = 200;
            randomSecondYCoord = possibleYCoordsForObstacles[Math.round(Math.random() * (len - 1))];
            dy = -(obstacles[1].yCoordinateA - randomSecondYCoord);
            parent.move(obstacles[1], dx, dy);  
        }
    }

    Object.defineProperty(game2ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
            moveEnemyObjects(obstacles);
            maintainObstaclesNumber(obstacles);
        }
    });

    Object.defineProperty(game2ObjectsManager, 'startChangeDirectionListener', {
        value: function () {
            document.addEventListener('keydown', downpressHandle);
            document.addEventListener('keyup', upHandle);

            function downpressHandle(key) {
                if (key.keyCode === 38) {
                    isUpArrowKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 40) {
                    isDownArowKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
            }

            function upHandle(key) {
                if (key.keyCode === 38) {
                    isUpArrowKeyPressed = false;
                    document.removeEventListener('keyup', upHandle);
                }
                if (key.keyCode === 40) {
                    isDownArowKeyPressed = false;
                    document.removeEventListener('keyup', upHandle);
                }
            }
        }
    });

    Object.defineProperty(game2ObjectsManager, 'movePlayer', {
        value: function (player) {
            if (player.shape.yCoordinate === constants.GAME2_PLAYER_MIN_Y) {
                if (isUpArrowKeyPressed) {
                    isUpArrowKeyPressed = false;
                    parent.move(player.shape, 0, 0);
                }
                if (isDownArowKeyPressed) {
                    isDownArowKeyPressed = false;
                    parent.move(player.shape, 0, constants.GAME2_PLAYER_STEP);
                }                
            }

            if (player.shape.yCoordinate === constants.GAME2_PLAYER_MAX_Y) {
                if (isDownArowKeyPressed) {
                    isDownArowKeyPressed = false;
                    parent.move(player.shape, 0, 0);
                }
                if (isUpArrowKeyPressed) {
                    isUpArrowKeyPressed = false;
                    parent.move(player.shape, 0, -constants.GAME2_PLAYER_STEP);
                }
            }

            if (isUpArrowKeyPressed && isDownArowKeyPressed) {
                isUpArrowKeyPressed  = false;
                isDownArowKeyPressed = false;
                return;
            }

            if (isUpArrowKeyPressed) {     
                isUpArrowKeyPressed = false;
                parent.move(player.shape, 0, -constants.GAME2_PLAYER_STEP);
            }

            if (isDownArowKeyPressed) {
                isDownArowKeyPressed = false;
                parent.move(player.shape, 0, constants.GAME2_PLAYER_STEP);
            }
        }
    });

    Object.defineProperty(game2ObjectsManager, 'manageState', {
        value: function (game, player, obstacles) {
            var collisionHappened = obstacles.some(function (obstacle) {
                return sat.testPolygonPolygon(obstacle.collisionProfile, player.shape.collisionProfile);
            });

            if (collisionHappened) {
                game.over = true;
            }
        }
    });

    return game2ObjectsManager;
}(require('./game-object-manager.js')));