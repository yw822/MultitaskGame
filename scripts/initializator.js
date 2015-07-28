module.exports = (function () {
    var constants = require('./constants.js'),
        game1Prototype = require('./game-1.js'),
        game2Prototype = require('./game-2.js'),
        game3Prototype = require('./game-3.js'),
        game4Prototype = require('./game-4.js'),
        gameObjectFactory = require('./game-object-factory.js'),
        game1RendererProto = require('./game-1-renderer.js'),
        game2RendererProto = require('./game-2-renderer.js'),
        game3RendererProto = require('./game-3-renderer.js'),
        game4RendererProto = require('./game-4-renderer.js'),
        //game1ObjectsManagerProto = require('./game-1-Objects-Manager.js'),        
        //game2ObjectsManagerProto = require('./game-2-Objects-Manager.js'),
        game3ObjectsManagerProto = require('./game-3-Objects-Manager.js'),
        //game4ObjectsManagerProto = require('./game-4-Objects-Manager.js'),
        player = require('./player.js');

    // Lots of constants - in the constants.js

    function initializeGame1() {
        //TODO: complete
    }

    function initializeGame2() {
        //TODO: complete
    }

    function initializeGame3() {
        var playerShape = gameObjectFactory.getTriangle(constants.GAME3_PLAYER_TOP_LEFT_POINT_X,constants.GAME3_PLAYER_TOP_LEFT_POINT_Y,
                constants.GAME3_PLAYER_BOTTOM_LEFT_POINT_X,constants.GAME3_PLAYER_BOTTOM_LEFT_POINT_Y,constants.GAME3_PLAYER_RIGHT_POINT_X,
                constants.GAME3_PLAYER_RIGHT_POINT_Y, constants.GAME3_PLAYER_FILL, constants.GAME3_PLAYER_STROKE, constants.GAME3_PLAYER_STROKE_WIDTH),
            renderer = Object.create(game3RendererProto),
            somePlayer = Object.create(player).init(playerShape, 'down'),
            gameObjectsManager = Object.create(game3ObjectsManagerProto),
            game3;

        game3 = Object.create(game3Prototype).init(renderer, somePlayer, [], gameObjectsManager);

        return game3;
    }

    function initializeGame4() {
        //TODO: complete
    }   

    return {
        initiateGames: function () {
            var games = [],
                game1 = initializeGame1(),
                game2 = initializeGame2(),
                game3 = initializeGame3(),
                game4 = initializeGame4();

            games.push(/*game1, game2,*/ game3/*, game4*/);

            return games;
        }
    };
}());