module.exports = (function (parent) {
    var game4ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js');

    // Will be different, the 'obstacles' will not move, must have some timer to count and end game if no collision is detected
    Object.defineProperty(game4ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
            // TODO:
        }
    });

    // This will be the same as game 3, except we'll listen for the W/A/S/D keys being pressed
    Object.defineProperty(game4ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            // TODO:
        }
    });

    // This will be similar to game3
    Object.defineProperty(game4ObjectsManager, 'movePlayer', {
        value: function (player) {
            // TODO:
        }
    });

    // This will be different, if collision is detected the 'obstacle' must be deleted, its timer stopped
    // so no game over occurs.
    Object.defineProperty(game4ObjectsManager, 'manageCollisions', {
        value: function (game, player, obstacles) {
            // TODO:
        }
    });

    return game4ObjectsManager;
}(require('./game-object-manager.js')));