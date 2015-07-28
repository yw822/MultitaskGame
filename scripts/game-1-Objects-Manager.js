module.exports = (function (parent) {
    var game1ObjectsManager = Object.create(parent),
        sat = require('sat'),
        constants = require('./constants.js');
    // Maybe some variable ballWeight which will deppend on where on the board it is
    // and will affect the speed of rotation of the board.

    // This will be different than the other games
    Object.defineProperty(game1ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
        }
    });

    // This will be similar to the others, except we'll listen for the left/right arrows being pressed
    Object.defineProperty(game1ObjectsManager, 'startChangeDirectionListener', {
        value: function (game) {
            // TODO:
        }
    });

    // Could be with rotation of the canvas
    Object.defineProperty(game1ObjectsManager, 'movePlayer', {
        value: function (player) {
            // TODO:
        }
    });
    
    Object.defineProperty(game1ObjectsManager, 'manageCollisions', {
        value: function (/**/) {
            // TODO: similar to the others, but when no collision - game over.
        }
    });

    return game1ObjectsManager;
}(require('./game-object-manager.js')));