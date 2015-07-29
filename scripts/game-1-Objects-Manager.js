module.exports = (function (parent) {
    var game1ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js'),
        keyPressed = false,
        rotationDirection,
        ball;

    Object.defineProperty(game1ObjectsManager, 'manageBall', {
        value: function (game) {
            ball = game.gameObjects[0];
            ball.xCoordinate += constants.GAME1_BALL_STEP * game.boardRotationAngle;
        }
    });
    
    Object.defineProperty(game1ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            document.addEventListener('keydown', downpressHandle);
            document.addEventListener('keyup', upHandle);

            function downpressHandle(key) {
                if (key.keyCode === 37) {
                    rotationDirection = 'left';
                    keyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
                if (key.keyCode === 39) {
                    rotationDirection = 'right';
                    keyPressed = true;
                    document.removeEventListener('keydown', downpressHandle);
                }
            }

            function upHandle(key) {
                if (key.keyCode === 37) {
                    keyPressed = false;
                    document.removeEventListener('keyup', upHandle);
                }
                if (key.keyCode === 39) {
                    keyPressed = false;
                    document.removeEventListener('keyup', upHandle);
                }
            }
        }
    });

    Object.defineProperty(game1ObjectsManager, 'movePlayer', {
        value: function (game) {
            var randomChoiceOfDirection,
                ballXCoord = game.gameObjects[0].xCoordinate;

            if (!keyPressed) {
                if ((ballXCoord - constants.GAME1_BALL_MIN_X) > constants.GAME1_BOARD_WIDTH / 2) {
                    game.boardRotationAngle =
                        constants.GAME1_ROTATION_ANGLE_STEP
                        + (ballXCoord - constants.GAME1_BALL_START_X) / constants.GAME1_ROT_ANGLE_STEP_MODIFIER;
                }
                else if ((ballXCoord - constants.GAME1_BALL_MIN_X) < constants.GAME1_BOARD_WIDTH / 2) {
                    game.boardRotationAngle =
                        -constants.GAME1_ROTATION_ANGLE_STEP
                        + (ballXCoord - constants.GAME1_BALL_START_X) / constants.GAME1_ROT_ANGLE_STEP_MODIFIER;
                }
                else {
                    randomChoiceOfDirection = Math.random();
                game.boardRotationAngle = randomChoiceOfDirection < 0.5 ? -constants.GAME1_ROTATION_ANGLE_STEP 
                                                                        : constants.GAME1_ROTATION_ANGLE_STEP;
                }
            }
            else {
                if (rotationDirection === 'left') {
                    game.boardRotationAngle -=
                        constants.GAME1_ROTATION_ANGLE_STEP_WHEN_PRESSED
                        - Math.abs(ballXCoord - constants.GAME1_BALL_START_X) / constants.GAME1_ROT_ANGLE_STEP_MODIFIER_WHEN_PRESSED;
                }
                else if (rotationDirection === 'right') {
                    game.boardRotationAngle +=
                        constants.GAME1_ROTATION_ANGLE_STEP_WHEN_PRESSED
                        - Math.abs(ballXCoord - constants.GAME1_BALL_START_X) / constants.GAME1_ROT_ANGLE_STEP_MODIFIER_WHEN_PRESSED;
                }
            }
        }
    });

    Object.defineProperty(game1ObjectsManager, 'manageState', {
        value: function (game) {
            ball = game.gameObjects[0];

            if (ball.xCoordinate < constants.GAME1_BALL_MIN_X || ball.xCoordinate > constants.GAME1_BALL_MAX_X) {
                // Uncomment this line to enable game over condition
                // game.over = true;
            }
        }
    });

    return game1ObjectsManager;
}(require('./game-object-manager.js')));