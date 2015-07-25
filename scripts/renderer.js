module.exports = (function() {
    var renderer = {},
        gameError = require('./game-errors.js');

    Object.defineProperty(renderer, 'clearStage', {
        value: function () {
            throw new gameError.NotImplementedError('Your renderer needs to implement the "abstract" method clearStage');
        }
    });

    Object.defineProperty(renderer, 'render', {
        value: function (gameObject) {
            throw new gameError.NotImplementedError('Your renderer needs to implement the "abstract" method render');
        }
    });

    return renderer;
}());