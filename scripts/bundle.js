(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// TODO: separate the game initialization logic in another script.
module.exports = function () {
    var gameOver = false,
        game1 = require('./game-1.js'),
        game2 = require('./game-2.js'),
        game3 = require('./game-3.js'),
        game4 = require('./game-4.js'),
        //game_1 = Object.create(game1).init(),
        //game_2 = Object.create(game2).init(),
        game_3 = Object.create(game3).init(),
        //game_4 = Object.create(game4).init(),
        games = [/*game_1, game_2,*/ game_3, /*game_4*/];

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
    console.log('in application');

    animate();
}
},{"./game-1.js":5,"./game-2.js":7,"./game-3.js":10,"./game-4.js":12}],2:[function(require,module,exports){
module.exports = (function (parent) {
    var circle = Object.create(parent),
        validator = require('./validator.js');

    Object.defineProperty(circle, 'init', {
        value: function (xCoordinate, yCoordinate, radius, collisionProfile, fill, stroke, strokeWidth) {
            parent.init.call(this, xCoordinate, yCoordinate, collisionProfile, fill, stroke, strokeWidth);
            this.radius = radius;

            return this;
        }
    });

    Object.defineProperty(circle, 'radius', {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'radius');
            this._radius = value;
        }
    });

    return circle;
}(require('./game-object.js')));

},{"./game-object.js":15,"./validator.js":24}],3:[function(require,module,exports){
module.exports = (function() {
    var CONSTANTS = {};

    Object.defineProperty(CONSTANTS, 'DEFAULT_VALUE_NAME', {
        value: 'Value',
        configurable: false,
        writable: false,
        enumerable: true
    });
    return CONSTANTS;
}());
},{}],4:[function(require,module,exports){
module.exports = (function (parent) {
    var game1Renderer = Object.create(parent);
    // Consider declaring here a private variable to hold your Canvas Context or SVG element.

    Object.defineProperty(game1Renderer, 'clearStage', {
        value: function () {
            //TODO: Implement this method to clear the Canvas. If you are using SVG, you can leave this method empty. Your choice :)

            //Delete this line!
            parent.clearStage.call(this);
        }
    });

    Object.defineProperty(game1Renderer, 'render', {
        value: function (gameObject) {
            //TODO: Implement this method to render the game objects.

            //Delete this line!
            parent.render.call(this, gameObject);
        }
    });

    return game1Renderer;
}(require('./renderer.js')));
},{"./renderer.js":21}],5:[function(require,module,exports){
module.exports = (function (parent) {
    var game1 = Object.create(parent);

    // When the game is over, please set game1.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game1, 'init', {
        value: function (renderer, player, gameObjects, gameObjectsManager) {
            parent.init.call(this, renderer, player, gameObjects, gameObjectsManager);

            return this;
        }
    });

    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game1, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.render(this.player.shape);
            this.gameObjects.forEach(this.renderer.render);
            // Move gameObjects
            // Check for collision
        }
    });

    return game1;
}(require('./game.js')));
},{"./game.js":16}],6:[function(require,module,exports){
module.exports = (function (parent) {
    var game2Renderer = Object.create(parent);
    // Consider declaring here a private variable to hold your Canvas Context or SVG element.

    Object.defineProperty(game2Renderer, 'clearStage', {
        value: function () {
            //TODO: Implement this method to clear the Canvas. If you are using SVG, you can leave this method empty. Your choice :)

            //Delete this line!
            parent.clearStage.call(this);
        }
    });

    Object.defineProperty(game2Renderer, 'render', {
        value: function (gameObject) {
            //TODO: Implement this method to render the game objects.

            //Delete this line!
            parent.render.call(this, gameObject);
        }
    });

    return game2Renderer;
}(require('./renderer.js')));
},{"./renderer.js":21}],7:[function(require,module,exports){
module.exports = (function (parent) {
    var game2 = Object.create(parent);

    // When the game is over, please set game2.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game2, 'init', {
        value: function (renderer, player, gameObjects, gameObjectsManager) {
            parent.init.call(this, renderer, player, gameObjects, gameObjectsManager);

            return this;
        }
    });

    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game2, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.render(this.player.shape);
            this.gameObjects.forEach(this.renderer.render);
            // Move gameObjects
            // Check for collision
        }
    });

    return game2;
}(require('./game.js')));
},{"./game.js":16}],8:[function(require,module,exports){
module.exports = (function () {
    var game3ObjectsManager = {};

    // Magic numbers --> constants in the constants.js

    // Obstacles logic
    function maintainSpecifiedNumberOfEnemies(obstacles) {
        var index = 0,
            randomYCoord,
            gameObjectFactory = require('./game-object-factory.js'),
            newObstacle;

        if (obstacles.length === 0) {
            randomYCoord = Math.random() * 150;
            newObstacle = gameObjectFactory.getRectangle(300, randomYCoord, 15, 50, 'collisionProfile', 'black', 'none', 1);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle) {
            return obstacle.xCoordinate === 140;
        })) {
            randomYCoord = Math.random() * 150;
            newObstacle = gameObjectFactory.getRectangle(300, randomYCoord, 15, 50, 'collisionProfile', 'black', 'none', 1);
            obstacles.push(newObstacle);
        }

        if (obstacles.some(
                function (obstacle, index) {
            return obstacle.xCoordinate === 0;
        })) {
            obstacles.splice(index, 1);
        }
    }       

    function moveEnemyObjects(obstacles) {
        obstacles.forEach(function (obstacle) {
            obstacle.xCoordinate -= 1; // some variable called speed.
        });
    }

    Object.defineProperty(game3ObjectsManager, 'manageObstacles', {
        value: function (obstacles) {
            moveEnemyObjects(obstacles);
            maintainSpecifiedNumberOfEnemies(obstacles);
        }
    });

    Object.defineProperty(game3ObjectsManager, 'movePlayer', {
        value: function (player) {
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

            // Events to change the player direction
            window.addEventListener('keydown', function (e) {
                if (e.keyCode === 32) {
                    e.preventDefault();
                    player.direction = 'up';
                }
            }, false);

            window.addEventListener('keyup', function (e) {
                if (e.keyCode === 32) {
                    e.preventDefault();
                    player.direction = 'down';
                }
            }, false);
        }
    });

    Object.defineProperty(game3ObjectsManager, 'manageCollisions', {
        value: function (player, obstacles) {
            // TODO: implement collision logic
        }
    });

    return game3ObjectsManager;
}());
},{"./game-object-factory.js":14}],9:[function(require,module,exports){
module.exports = (function (parent) {
    var game3Renderer = Object.create(parent),
        stage = new Kinetic.Stage({
            //TODO: extract this hardcoded values in constants width, height.
            container:  document.getElementById('game-3'),
            width: 300,
            height: 200
        }),
        layer = new Kinetic.Layer();

    Object.defineProperty(game3Renderer, 'clearStage', {
        value: function () {
            layer.removeChildren();
            //Delete this line!
            // parent.clearStage.call(this);
        }
    });   

    Object.defineProperty(game3Renderer, 'render', {
        value: function (gameObject) {
            var figure = new Kinetic.Line({
                    points: gameObject.getCoordinatesAsArray(),
                    stroke: gameObject.stroke,
                    fill: gameObject.fill,
                    strokeWidth: gameObject.strokeWidth,
                    closed: true,
                //TODO: extract this hardcoded value tension
                    tension: 0.4
                });

            layer.add(figure);
            stage.add(layer);

            //Delete this line!
            //parent.render.call(this, gameObject);
        }
    });

    return game3Renderer;
}(require('./renderer.js')));

},{"./renderer.js":21}],10:[function(require,module,exports){
module.exports = (function (parent) {
    var game3 = Object.create(parent);

    // When the game is over, please set game3.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game3, 'init', {
        value: function () {
            //TODO: This vars must be provided, and not hardcoded here. Move them in the initializator.
            var gameObjectFactory = require('./game-object-factory.js'),
                game3Renderer = require('./game-3-renderer.js'),
                player = require('./player.js'),
                game3ObjectsManager = require('./game-3-Objects-Manager.js'),
                playerShape = gameObjectFactory.getTriangle(50, 180, 50, 200, 65, 190, 'collisionProfile', 'azure', 'purple', 2),
                renderer = Object.create(game3Renderer),
                somePlayer = Object.create(player).init(playerShape, 'down'),
                gameObjectsManager = Object.create(game3ObjectsManager);

            parent.init.call(this, renderer, somePlayer, [], gameObjectsManager);
            return this;
        }
    });

    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game3, 'update', {
        value: function () {
            parent.update.call(this);
            // Move gameObjects
            // TODO: Consider how the gameObjectManager can provide one general method here
            this.gameObjectsManager.manageObstacles(this.gameObjects);
            this.gameObjectsManager.movePlayer(this.player);
            // Check for collision: TODO in the game-3-objects-manager.js
            this.gameObjectsManager.manageCollisions(this.player, this.gameObjects);
        }
    });

    return game3;
}(require('./game.js')));

},{"./game-3-Objects-Manager.js":8,"./game-3-renderer.js":9,"./game-object-factory.js":14,"./game.js":16,"./player.js":18}],11:[function(require,module,exports){
module.exports = (function (parent) {
    var game4Renderer = Object.create(parent);
    // Consider declaring here a private variable to hold your Canvas Context or SVG element.

    Object.defineProperty(game4Renderer, 'clearStage', {
        value: function () {
            //TODO: Implement this method to clear the Canvas. If you are using SVG, you can leave this method empty. Your choice :)

            //Delete this line!
            parent.clearStage.call(this);
        }
    });

    Object.defineProperty(game4Renderer, 'render', {
        value: function (gameObject) {
            //TODO: Implement this method to render the game objects.

            //Delete this line!
            parent.render.call(this, gameObject);
        }
    });

    return game4Renderer;
}(require('./renderer.js')));
},{"./renderer.js":21}],12:[function(require,module,exports){
module.exports = (function (parent) {
    var game4 = Object.create(parent);

    // When the game is over, please set game4.over = true;

    // If you need to initialize the state of your game, please use this property. Otherwise feel free to
    // remove it from the code. The parent.init will be called due to the prototype chain.
    Object.defineProperty(game4, 'init', {
        value: function (renderer, player, gameObjects) {
            parent.init.call(this, renderer, player, gameObjects);

            return this;
        }
    });

    //TODO: check if it is possible to move this logic to parent
    Object.defineProperty(game4, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.render(this.player.shape);
            this.gameObjects.forEach(this.renderer.render);
            // Move gameObjects
            // Check for collision
        }
    });

    return game4;
}(require('./game.js')));
},{"./game.js":16}],13:[function(require,module,exports){
module.exports = (function() {
    var gameError = {
        NotImplementedError: function (message) {
            this.name = "NotImplementedError";
            this.message = (message || "");
        }
    };

    gameError.NotImplementedError.prototype = Error.prototype;

    return gameError;
}());
},{}],14:[function(require,module,exports){
module.exports = (function () {
    var rectangle = require('./rectangle.js'),
        rectangleWithText = require('./rectangle-with-text.js'),
        triangle = require('./triangle.js'),
        circle = require('./circle.js');

    return {
        getRectangle: function (xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth) {
            return Object.create(rectangle).init(xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth);
        },
        getRectangleWithText: function (xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth, text) {
            return Object.create(rectangleWithText).init(xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth, text);
        },
        getTriangle: function (xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, collisionProfile, fill, stroke, strokeWidth) {
            return Object.create(triangle).init(xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, collisionProfile, fill, stroke, strokeWidth);
        },
        getCircle: function (xCoordinate, yCoordinate, radius, collisionProfile, fill, stroke, strokeWidth) {
            return Object.create(circle).init(xCoordinate, yCoordinate, radius, collisionProfile, fill, stroke, strokeWidth);
        }
    };
}());
},{"./circle.js":2,"./rectangle-with-text.js":19,"./rectangle.js":20,"./triangle.js":23}],15:[function(require,module,exports){
//TODO: make a gameObjectFactory
module.exports = (function () {
    var gameObject = {},
        validator = require('./validator.js');

    Object.defineProperty(gameObject, 'init', {
        value: function (xCoordinate, yCoordinate, collisionProfile, fill, stroke, strokeWidth) {
            this.xCoordinate = xCoordinate;
            this.yCoordinate = yCoordinate;
            this.collisionProfile = collisionProfile;
            this.fill = fill;
            this.stroke = stroke;
            this.strokeWidth = strokeWidth;

            return this;
        }
    });

    Object.defineProperty(gameObject, 'xCoordinate', {
        get: function () {
            return this._xCoordinate;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, 'xCoordinate');
            this._xCoordinate = value;
        }
    });

    Object.defineProperty(gameObject, 'yCoordinate', {
        get: function () {
            return this._yCoordinate;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, 'yCoordinate');
            this._yCoordinate = value;
        }
    });

    Object.defineProperty(gameObject, 'collisionProfile', {
        get: function () {
            return this._collisionProfile;
        },
        set: function (value) {
            //validator.validateIfCollisionProfile(value, 'collisionProfile');
            this._collisionProfile = value;
        }
    });

    Object.defineProperty(gameObject, 'fill', {
        get: function () {
            return this._fill;
        },
        set: function (value) {
            validator.validateIfString(value, 'fill');
            this._fill = value;
        }
    });

    Object.defineProperty(gameObject, 'stroke', {
        get: function () {
            return this._stroke;
        },
        set: function (value) {
            validator.validateIfString(value, 'stroke');
            this._stroke = value;
        }
    });

    Object.defineProperty(gameObject, 'strokeWidth', {
        get: function () {
            return this._strokeWidth;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'strokeWidth');
            this._strokeWidth = value;
        }
    });

    Object.defineProperty(gameObject, 'getCoordinatesAsArray', {
        value: function () {
            return [this.xCoordinate, this.yCoordinate];
        }
    });

    return gameObject;
}());
},{"./validator.js":24}],16:[function(require,module,exports){
module.exports = (function () {
    var game = {},
        validator = require('./validator.js');

    Object.defineProperty(game, 'init', {
        value: function (renderer, player, gameObjects, gameObjectsManager) { //TODO: provide collisionDetector
            this.renderer = renderer;
            this.player = player;
            this.gameObjects = gameObjects || [];
            this.gameObjectsManager = gameObjectsManager;
            this.over = false;

            return this;
        }
    });

    Object.defineProperty(game, 'renderer', {
        get: function () {
            return this._renderer;
        },
        set: function (value) {
            //validator.validateIfRenderer(value, 'renderer');
            this._renderer = value;
        }
    });

    Object.defineProperty(game, 'player', {
        get: function () {
            return this._player;
        },
        set: function (value) {
            //validator.validateIfPlayer(value, 'player');
            this._player = value;
        }
    });

    Object.defineProperty(game, 'gameObjects', {
        get: function () {
            return this._gameObjects;
        },
        set: function (value) {
            //validator.validateIfArray(value, 'gameObjects');
            //value.forEach(function (val) {
            //    validator.validateIfGameObject(val, 'Each value in gameObjects');
            //});
            this._gameObjects = value;
        }
    });

    Object.defineProperty(game, 'gameObjectsManager', {
        get: function () {
            return this._gameObjectsManager;
        },
        set: function (value) {
            //TODO: Add validation or meybe not before circular dependency is understood.
            this._gameObjectsManager = value;
        }
    });

    Object.defineProperty(game, 'over', {
        get: function () {
            return this._over;
        },
        set: function (value) {
            validator.validateIfBoolean(value, 'over');
            this._over = value;
        }
    });

    Object.defineProperty(game, 'update', {
        value: function () {
            this.renderer.clearStage();
            this.renderer.render(this.player.shape);
            this.gameObjects.forEach(this.renderer.render);
            // Move game objects
            // Check for collision

            //throw new gameError.NotImplementedError('Your game needs to implement the "abstract" method update');
        }
    });

    Object.defineProperty(game, 'addGameObject', {
        value: function (value) {
            //validator.validateIfGameObject(value, 'gameObject');
            this.gameObjects.push(value);
        }
    });

    Object.defineProperty(game, 'removeGameObject', {
        value: function (value) {
            var index,
                removedGameObject;

            //validator.validateIfGameObject(value, 'gameObject');

            index = this.gameObjects.indexOf(value);

            this.gameObjects.splice(index, 1);

            //if (index >= 0) {
            //    removedGameObject = this.gameObjects.splice(index, 1)[0];
            //} else {
            //    removedGameObject = null;
            //}

            //return removedGameObject;
        }
    });

    Object.defineProperty(game, 'removeGameObjectByIndex', {
        value: function (index) {
            var removedGameObject;

            validator.validateIfInteger(index, 'index');

            removedGameObject = this.gameObjects.splice(index, 1)[0];

            return removedGameObject;
        }
    });

    return game;
}());
},{"./validator.js":24}],17:[function(require,module,exports){
module.exports = (function() {
    var initializator = {};
    Object.defineProperty(initializator, 'initializeGame1', {
        value: function () {
            //TODO: complete
        }
    });

    Object.defineProperty(initializator, 'initializeGame2', {
        value: function () {
            //TODO: complete
        }
    });

    Object.defineProperty(initializator, 'initializeGame3', {
        value: function () {
            //TODO: complete
        }
    });

    Object.defineProperty(initializator, 'initializeGame4', {
        value: function () {
            //TODO: complete
        }
    });
    return initializator;
}());
},{}],18:[function(require,module,exports){
module.exports = (function() {
    var player = {},
        validator = require('./validator.js');

    Object.defineProperty(player, 'init', {
        value: function (shape, direction) {
            this.shape = shape;
            this.direction = direction;

            return this;
        }
    });

    Object.defineProperty(player, 'shape', {
        get: function () {
            return this._shape;
        },
        set: function (value) {
            //validator.validateIfGameObject(value, 'shape');
            this._shape = value;
        }
    });

    Object.defineProperty(player, 'direction', {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            validator.validateIfString(value, 'direction'); // Maybe better validation here;
            this._direction = value;
        }
    });

    return player;
}());
},{"./validator.js":24}],19:[function(require,module,exports){
module.exports = (function(parent) {
    var rectangleWithText = Object.create(parent),
        validator = require('./validator.js');

    Object.defineProperty(rectangleWithText, 'init', {
        value: function (xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth, text) {
            parent.init.call(this, xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth);
            this.text = text;

            return this;
        }
    });

    Object.defineProperty(rectangleWithText, 'text', {
        get: function () {
            return this._text;
        },
        set: function (value) {
            validator.validateIfString(value, 'text');
            this._text = value;
        }
    });

    return rectangleWithText;
}(require('./rectangle.js')));
},{"./rectangle.js":20,"./validator.js":24}],20:[function(require,module,exports){
module.exports = (function (parent) {
    var rectangle = Object.create(parent),
        validator = require('./validator.js');

    Object.defineProperty(rectangle, 'init', {
        value: function (xCoordinate, yCoordinate, width, height, collisionProfile, fill, stroke, strokeWidth) {
            parent.init.call(this, xCoordinate, yCoordinate, collisionProfile, fill, stroke, strokeWidth);
            this.width = width;
            this.height = height;

            return this;
        }
    });

    Object.defineProperty(rectangle, 'width', {
        get: function () {
            return this._width;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'width');
            this._width = value;
        }
    });

    Object.defineProperty(rectangle, 'height', {
        get: function () {
            return this._height;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'height');
            this._height = value;
        }
    });

    Object.defineProperty(rectangle, 'getCoordinatesAsArray', {
        value: function () {
            var coordinatesAsArray = parent.getCoordinatesAsArray.call(this),
                bX = this.xCoordinate,
                bY = this.yCoordinate + this.height,
                cX = this.xCoordinate + this.width,
                cY = this.yCoordinate + this.height,
                dX = this.xCoordinate + this.width,
                dY = this.yCoordinate;

            coordinatesAsArray = coordinatesAsArray.concat([bX, bY, cX, cY, dX, dY]);
            return coordinatesAsArray;
        }
    });

    return rectangle;
}(require('./game-object.js')));
},{"./game-object.js":15,"./validator.js":24}],21:[function(require,module,exports){
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
},{"./game-errors.js":13}],22:[function(require,module,exports){
var run = require('./application.js');
run();
},{"./application.js":1}],23:[function(require,module,exports){
module.exports = (function (parent) {
    var triangle = Object.create(parent),
        validator = require('./validator.js');

    Object.defineProperty(triangle, 'init', {
        value: function (xCoordinateA, yCoordinateA, xCoordinateB, yCoordinateB, xCoordinateC, yCoordinateC, collisionProfile, fill, stroke, strokeWidth) {
            parent.init.call(this, xCoordinateA, yCoordinateA, collisionProfile, fill, stroke, strokeWidth);
            this.xCoordinateB = xCoordinateB;
            this.yCoordinateB = yCoordinateB;
            this.xCoordinateC = xCoordinateC;
            this.yCoordinateC = yCoordinateC;

            return this;
        }
    });

    // Triangle's xCoordinate and yCoordinate are the coordinates of its point A.
    Object.defineProperty(triangle, 'xCoordinateA', {
        get: function () {
            return this.xCoordinate;
        },
        set: function (value) {
            this.xCoordinate = value;
        }
    });

    Object.defineProperty(triangle, 'yCoordinateA', {
        get: function () {
            return this.yCoordinate;
        },
        set: function (value) {
            this.yCoordinate = value;
        }
    });

    Object.defineProperty(triangle, 'xCoordinateB', {
        get: function () {
            return this._xCoordinateB;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, "xCoordinateB");
            this._xCoordinateB = value;
        }
    });

    Object.defineProperty(triangle, 'yCoordinateB', {
        get: function () {
            return this._yCoordinateB;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, "yCoordinateB");
            this._yCoordinateB = value;
        }
    });

    Object.defineProperty(triangle, 'xCoordinateC', {
        get: function () {
            return this._xCoordinateC;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, "xCoordinateC");
            this._xCoordinateC = value;
        }
    });

    Object.defineProperty(triangle, 'yCoordinateC', {
        get: function () {
            return this._yCoordinateC;
        },
        set: function (value) {
            validator.validateIfRealNumber(value, "yCoordinateC");
            this._yCoordinateC = value;
        }
    });

    Object.defineProperty(triangle, 'getCoordinatesAsArray', {
        value: function () {
            var coordinatesAsArray = parent.getCoordinatesAsArray.call(this);
            coordinatesAsArray = coordinatesAsArray.concat([this.xCoordinateB, this.yCoordinateB, this.xCoordinateC, this.yCoordinateC]);
            return coordinatesAsArray;
        }
    });

    return triangle;
}(require('./game-object.js')));

},{"./game-object.js":15,"./validator.js":24}],24:[function(require,module,exports){
module.exports = (function () {
    var validator = {},
        CONSTANTS = require('./constants.js');
        //gameObject = require('./game-object.js'),
        //player = require('./player.js'),
        //renderer = require('./renderer.js'),
        //SAT = require('sat');

    function isRealNumber(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    function isInteger(number) {
        return number === parseInt(number, 10);
    }

    Object.defineProperty(validator, 'validateNotNullAndUndefined', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (value == undefined) {
                throw new TypeError(valueName + ' cannot be null and undefined.');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfBoolean', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (typeof value !== 'boolean') {
                throw new TypeError(valueName + ' must be a boolean');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfRealNumber', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (isRealNumber(value) === false) {
                throw new TypeError(valueName + ' must be a real number');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfPositiveNumber', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateIfRealNumber(value, valueName);

            if (value <= 0) {
                throw new RangeError(valueName + ' must be a positive number');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfInteger', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (isInteger(value) === false) {
                throw new TypeError(valueName + ' must be an integer');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfString', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (typeof value !== 'string') {
                throw new TypeError(valueName + ' must be a string');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfArray', {
        value: function (value, valueName) {
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            if (!(value instanceof Array)) {
                throw new TypeError(valueName + ' must be an array');
            }
        }
    });

    //Object.defineProperty(validator, 'validateIfGameObject', {
    //    value: function (value, valueName) {
    //        valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;
    //
    //        this.validateNotNullAndUndefined(value, valueName);
    //
    //        if (!gameObject.isPrototypeOf(value)) {
    //            throw new TypeError(valueName + ' must be a gameObject');
    //        }
    //    }
    //});
    //
    //Object.defineProperty(validator, 'validateIfPlayer', {
    //    value: function (value, valueName) {
    //        valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;
    //
    //        this.validateNotNullAndUndefined(value, valueName);
    //
    //        if (!player.isPrototypeOf(value)) {
    //            throw new TypeError(valueName + ' must be a player');
    //        }
    //    }
    //});
    //
    //Object.defineProperty(validator, 'validateIfRenderer', {
    //    value: function (value, valueName) {
    //        valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;
    //
    //        this.validateNotNullAndUndefined(value, valueName);
    //
    //        if (!renderer.isPrototypeOf(value)) {
    //            throw new TypeError(valueName + ' must be a renderer');
    //        }
    //    }
    //});
    //
    //Object.defineProperty(validator, 'validateIfCollisionProfile', {
    //    value: function (value, valueName) {
    //        valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;
    //
    //        this.validateNotNullAndUndefined(value, valueName);
    //
    //        if (!((value instanceof SAT.Circle) || (value instanceof SAT.Polygon))) {
    //            throw new TypeError(valueName + ' must be a SAT.Circle or SAT.Polygon');
    //        }
    //    }
    //});

    return validator;
}());
},{"./constants.js":3}]},{},[3,13,24,15,2,23,20,19,14,18,21,4,6,9,11,8,16,5,7,10,12,17,1,22]);
