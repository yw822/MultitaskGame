module.exports = function () {
    console.log('application call');
    var initializator = require('./initializator.js'),
        games,
        engine = require('./mainEngine.js'),
        parentContainer = document.getElementById('game-table'),
        playButton = document.getElementById('play-button');

    playButton.addEventListener('click', function (e) {
        playButton.removeEventListener('click');

        parentContainer.className = 'table';
        playButton.className = 'hidden';

        games = initializator.initiateGames();
        engine.runGames(games);
    }, false);

}