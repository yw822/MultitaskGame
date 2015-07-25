var game3 = (function (parent) {
    var game3 = Object.create(parent),
        self;

    // Magic numbers --> constants in the constants.js

    // Enemies logic
    function maintainSpecifiedNumberOfEnemies(enemies) {
        var index = 0,
            randomYCoord;
        if (enemies.length === 0) {
            randomYCoord = Math.random() * 150;
            var newEnemy = gameObjectFactory.getRectangle(300, randomYCoord, 15, 50, 'black', 'none', 1);
            self.addGameObject(newEnemy);
        }

        if (enemies.some(
                function (enemy) {
            return enemy.xCoordinate === 120;
        })) {
            randomYCoord = Math.random() * 150;
            var newEnemy = gameObjectFactory.getRectangle(300, randomYCoord, 15, 50, 'black', 'none', 1);
            self.addGameObject(newEnemy);
        }

        if (enemies.some(
                function (enemy, index) {
            return enemy.xCoordinate === 0;
             })) {
            self.removeGameObject(enemies[index]);
        }
    }

    function moveEnemyObjects(enemies) {
        enemies.forEach(function (enemy) {
            enemy.xCoordinate -= 1; // some variable called speed.
        });
    }

    function manageEnemyObjects(enemies) {
        moveEnemyObjects(enemies);
        maintainSpecifiedNumberOfEnemies(enemies);
    }

    // Player logic
    function movePlayer(player) {
        if (player.shape.yCoordinateA < 180 && player.direction === 'down') {
            player.shape.yCoordinateA += 1; // some variable called speed.
            player.shape.yCoordinateB += 1; // some variable called speed.
            player.shape.yCoordinateC += 1; // some variable called speed.
        }
        
        if (player.shape.yCoordinateA >= 0 && player.direction === 'up') {
            player.shape.yCoordinateA -= 1; // some variable called speed.
            player.shape.yCoordinateB -= 1; // some variable called speed.
            player.shape.yCoordinateC -= 1; // some variable called speed.
        }
    }

    // Events to change the player direction
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 32 ) {
            e.preventDefault();
            self.player.direction = 'up';
        }
    }, false);

    window.addEventListener('keyup', function (e) {
        if (e.keyCode === 32) {
            e.preventDefault();
            self.player.direction = 'down';
        }
    }, false);

    // When the game is over, please set game3.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game3, 'init', {
        value: function () {
            var playerShape = gameObjectFactory.getTriangle(50, 180, 50, 200, 65, 190, 'azure', 'purple', 2),
                renderer = Object.create(game3Renderer),
                somePlayer = Object.create(player).init(playerShape, 'down');

            parent.init.call(this, renderer, somePlayer, []);
            self = this;
            return this;
        }
    });

    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game3, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.renderPlayer(this.player.shape);
            this.renderer.renderEnemies(this.gameObjects);
            // Move gameObjects
            manageEnemyObjects(this.gameObjects);
            movePlayer(this.player);
            // Check for collision: TODO
        }
    });

    return game3;
}(game));