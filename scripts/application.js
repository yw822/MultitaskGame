(function () {
    var gameOver = false,
        game_1 = Object.create(game1).init(),
        game_2 = Object.create(game2).init(),
        game_3 = Object.create(game3).init(),
        game_4 = Object.create(game4).init(),
        games = [game_1, game_2, game_3, game_4];

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

    animate();
}());