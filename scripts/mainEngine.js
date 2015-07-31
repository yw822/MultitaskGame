module.exports = (function () {    
    var engine = {},
        games,
        gameOver = false,
        restart = require('./application.js'),
        parentContainer = document.getElementById('game-table'),
        score = 0,
        scoreInterval = setInterval(changeScore, 1000),
        scoreButton = document.getElementById('score-button');

    function changeScore() {
        score += 1;
    }

    function onScoreButtonClicked() {
        scoreButton.removeEventListener('click', onScoreButtonClicked);
        scoreButton.className = 'hidden';
        window.location.reload(true);
    }

    function onGameOver() {
        document.getElementById('game-1').innerHTML = '';
        document.getElementById('game-2').innerHTML = '';
        document.getElementById('game-3').innerHTML = '';
        document.getElementById('game-4').innerHTML = '';
        clearInterval(scoreInterval);
        scoreButton.className = 'visible';
        scoreButton.innerHTML = 'Score: ' + score;
        parentContainer.className = 'game-over';

        scoreButton.addEventListener('click', onScoreButtonClicked);
    }

    function updateGames() {
        games.forEach(function (game) {
            game.update();
        });
    }

    function checkGameOver() {
        gameOver = games.some(function (game) {
            return game.over;
        });
    }

    function runGames() {
        updateGames();
        checkGameOver();
        if (!gameOver) {
            requestAnimationFrame(runGames);
        }
        else {
            onGameOver();
        }
    }

    Object.defineProperty(engine, 'runGames', {
        value: function (gamesList) {
            games = gamesList
            runGames();
        }
    });

    return engine;
}());