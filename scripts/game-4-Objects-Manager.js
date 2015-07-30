module.exports = (function (parent) {
    var game4ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js'),
        gameObjectFactory = require('./game-object-factory.js'),
        wKeyPressed = false,
        aKeyPressed = false,
        sKeyPressed = false,
        dKeyPressed = false,
        createNewObstacleInterval,
        changeTextInterval,
        obstaclesCreatedWithInterval = [];

    // Create and add new obstacle every GAME4_OBSTACLE_CREATION_INTERVAL milliseconds
    function addNewObstacleAfterInterval(obstacleCollection) {
        obstacleCollection.push(createObstacle());
    }

    function startObstacleCreationBetweenInterval(interval) {
        createNewObstacleInterval = setInterval(addNewObstacleAfterInterval, interval, obstaclesCreatedWithInterval);
    };

    startObstacleCreationBetweenInterval(constants.GAME4_OBSTACLE_CREATION_INTERVAL);

    // decrease the counter inside every obstacle rectangle with 1
    function changeRectText() {
        arguments[0].text -= 1;
    }

    function createObstacle() {
        var newObstacle,
            randXCoord = Math.random() * constants.GAME4_OBSTACLE_MAX_X,
            randYCoord = Math.random() * constants.GAME4_OBSTACLE_MAX_Y;

        newObstacle = gameObjectFactory.getRectangleWithText(randXCoord, randYCoord, constants.GAME4_OBSTACLE_WIDTH, constants.GAME4_OBSTACLE_HEIGHT,
            constants.GAME4_OBSTACLE_FILL, constants.GAME4_OBSTACLE_STROKE, constants.GAME4_OBSTACLE_STROKE_WIDTH, constants.GAME4_OBSTACLE_COUNTER_START_VALUE);
        changeTextInterval = setInterval(changeRectText, constants.GAME4_OBSTACLE_COUNTER_STEP, newObstacle);

        return newObstacle;
    }

    Object.defineProperty(game4ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {

            if (obstaclesCreatedWithInterval.length > 0) {
                obstacles.push(obstaclesCreatedWithInterval[0]);
                obstaclesCreatedWithInterval.splice(0, 1);
            }
        }
    });

    Object.defineProperty(game4ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            document.addEventListener('keydown', downpressHandle);
            document.addEventListener('keyup', upHandle);

            function downpressHandle(key) {
                if (key.keyCode === 87) {
                    wKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 65) {
                    aKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 83) {
                    sKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 68) {
                    dKeyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
            }

            function upHandle(key) {
                if (key.keyCode === 87) {
                    wKeyPressed = false;
                    document.removeEventListener('keyup', downpressHandle);
                }
                if (key.keyCode === 65) {
                    aKeyPressed = false;
                    document.removeEventListener('keyup', downpressHandle);
                }
                if (key.keyCode === 83) {
                    sKeyPressed = false;
                    document.removeEventListener('keyup', downpressHandle);
                }
                if (key.keyCode === 68) {
                    dKeyPressed = false;
                    document.removeEventListener('keyup', downpressHandle);
                }
            }
        }
    });

    Object.defineProperty(game4ObjectsManager, 'movePlayer', {
        value: function (player) {
            var dx = 0,
                dy = 0;

            if (player.shape.xCoordinate < constants.GAME4_PLAYER_MIN_X) {
                dx = 1;
            }
            else if (player.shape.xCoordinate > constants.GAME4_PLAYER_MAX_X) {
                dx = -1;
            }
            else {
                if (aKeyPressed && dKeyPressed) {
                    dx = 0;
                }
                if (aKeyPressed && !dKeyPressed) {
                    dx = -constants.GAME4_PLAYER_STEP;
                }
                if (!aKeyPressed && dKeyPressed) {
                    dx = constants.GAME4_PLAYER_STEP;
                }
            }

            if (player.shape.yCoordinate < constants.GAME4_PLAYER_MIN_Y) {
                dy = 1;
            }
            else if (player.shape.yCoordinate > constants.GAME4_PLAYER_MAX_Y) {
                dy = -1;
            }
            else {
                if (wKeyPressed && sKeyPressed) {
                    dy = 0;
                }
                if (wKeyPressed && !sKeyPressed) {
                    dy = -constants.GAME4_PLAYER_STEP;
                }
                if (!wKeyPressed && sKeyPressed) {
                    dy = constants.GAME4_PLAYER_STEP;
                }
            }

            parent.move(player.shape, dx, dy);
        }
    });

    Object.defineProperty(game4ObjectsManager, 'manageState', {
        value: function (game, player, obstacles) {
            var index = -1,
                collisionHappened = obstacles.some(function (obstacle) {
                    index += 1;
                    return sat.testPolygonPolygon(obstacle.collisionProfile, player.shape.collisionProfile);
                });

            if (collisionHappened) {
                obstacles.splice(index, 1);
            }

            if (obstacles.some(function (obstacle) {
                    return obstacle.text === 0;
                })) {
                game.over = true;
            }
        }
    });

    return game4ObjectsManager;
}(require('./game-object-manager.js')));