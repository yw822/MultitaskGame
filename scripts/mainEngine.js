module.exports = (function () {    
    var engine = {},
        games,
        gameOver = false;
    
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

    function animate() {
        updateGames();
        checkGameOver();
        if (!gameOver) {
            requestAnimationFrame(animate);
        }
    }

    Object.defineProperty(engine, 'runGames', {
        value: function (gamesList) {
            games = gamesList;
            animate();
        }
    });

    return engine;
}());