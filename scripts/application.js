module.exports = function () {
    var initializator = require('./initializator.js'),
        games = initializator.initiateGames(),
        engine = require('./mainEngine.js');

    // This will be linked to an event here.
    engine.runGames(games);
};