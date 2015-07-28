module.exports = (function (parent) {
    var game2ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js');
    
    // Could be done in a similar way to game 3
    Object.defineProperty(game2ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
            // TODO:
        }
    });

    // This will be the same as game 3, except we'll listen for the up/down arrows being pressed
    Object.defineProperty(game2ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            // TODO:
        }
    });

    // This will be similar to game3
    Object.defineProperty(game2ObjectsManager, 'movePlayer', {
        value: function (player) {
            // TODO:
        }
    });

    // this will be the same as game 3
    Object.defineProperty(game2ObjectsManager, 'manageCollisions', {
        value: function (game, player, obstacles) {
            var collisionHappened = obstacles.some(function (obstacle) {
                return sat.testPolygonPolygon(obstacle.collisionProfile, player.shape.collisionProfile);
            });

            if (collisionHappened) {
                // Uncomment this to have a game over condition.
                // game.over = true;
            }
        }
    });

    return game2ObjectsManager;
}(require('./game-object-manager.js')));