module.exports = function () {
    var initializator = require('./initializator.js'),
        games,
        engine = require('./mainEngine.js'),
        parentContainer = document.getElementById('game-table'),
        playButton = document.getElementById('play-button');

    function onClickPlayButton() {
        playButton.removeEventListener('click', onClickPlayButton);

        parentContainer.className = 'table';
        playButton.className = 'hidden';

        games = initializator.initiateGames();
        engine.runGames(games);
    }

    playButton.addEventListener('click', onClickPlayButton);
}