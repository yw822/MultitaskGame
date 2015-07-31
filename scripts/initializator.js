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
        game1ObjectsManagerProto = require('./game-1-Objects-Manager.js'),        
        game2ObjectsManagerProto = require('./game-2-Objects-Manager.js'),
        game3ObjectsManagerProto = require('./game-3-Objects-Manager.js'),
        game4ObjectsManagerProto = require('./game-4-Objects-Manager.js'),
        player = require('./player.js');

    function initializeGame1() {
        var playerShape = gameObjectFactory.getRectangle(constants.GAME1_BOARD_TOP_LEFT_POINT_X, constants.GAME1_BOARD_TOP_LEFT_POINT_Y,
                constants.GAME1_BOARD_WIDTH, constants.GAME1_BOARD_HEIGHT, constants.GAME1_BOARD_FILL,
                constants.GAME1_BOARD_STROKE, constants.GAME1_BOARD_STROKE_WIDTH),
            ball = gameObjectFactory.getCircle(constants.GAME1_BALL_START_X, constants.GAME1_BALL_START_Y, constants.GAME1_BALL_RADIUS,
                constants.GAME1_BALL_FILL, constants.GAME1_BALL_STROKE, constants.GAME1_BALL_STROKE_WIDTH),
            renderer = Object.create(game1RendererProto),
            somePlayer = Object.create(player).init(playerShape, 'none'),
            gameObjectsManager = Object.create(game1ObjectsManagerProto),
            game1;
        
        game1 = Object.create(game1Prototype).init(renderer, somePlayer, [ball], gameObjectsManager, constants.GAME1_INITIAL_ROTATION_ANGLE);

        return game1;
    }

    function initializeGame2() {
        var playerShape = gameObjectFactory.getRectangle(constants.GAME2_PLAYER_TOP_LEFT_POINT_X, constants.GAME2_PLAYER_TOP_LEFT_POINT_Y,
                constants.GAME2_PLAYER_WIDTH, constants.GAME2_PLAYER_HEIGHT, constants.GAME2_PLAYER_FILL, constants.GAME2_PLAYER_STROKE, constants.GAME2_PLAYER_STROKE_WIDTH),
            rightPointingObstacle = gameObjectFactory.getTriangle(constants.GAME2_RP_OBSTACLE_START_POINT_A_X, constants.GAME2_RP_OBSTACLE_START_POINT_A_Y,
                constants.GAME2_RP_OBSTACLE_START_POINT_B_X, constants.GAME2_RP_OBSTACLE_START_POINT_B_Y, constants.GAME2_RP_OBSTACLE_START_POINT_C_X,
                constants.GAME2_RP_OBSTACLE_START_POINT_C_Y, constants.GAME2_RP_OBSTACLE_FILL, constants.GAME2_RP_OBSTACLE_STROKE, constants.GAME2_RP_OBSTACLE_STROKE_WIDTH),
            leftPointingObstacle = gameObjectFactory.getTriangle(constants.GAME2_LP_OBSTACLE_START_POINT_A_X, constants.GAME2_LP_OBSTACLE_START_POINT_A_Y,
                constants.GAME2_LP_OBSTACLE_START_POINT_B_X, constants.GAME2_LP_OBSTACLE_START_POINT_B_Y, constants.GAME2_LP_OBSTACLE_START_POINT_C_X,
                constants.GAME2_LP_OBSTACLE_START_POINT_C_Y, constants.GAME2_LP_OBSTACLE_FILL, constants.GAME2_LP_OBSTACLE_STROKE, constants.GAME2_LP_OBSTACLE_STROKE_WIDTH),
            renderer = Object.create(game2RendererProto),
            somePlayer = Object.create(player).init(playerShape, 'none'),
            gameObjectsManager = Object.create(game2ObjectsManagerProto),
            game2,
            gameObstacles = [];

        rightPointingObstacle.id = 1;
        leftPointingObstacle.id = 2;
        gameObstacles.push(rightPointingObstacle, leftPointingObstacle);

        game2 = Object.create(game2Prototype).init(renderer, somePlayer, gameObstacles, gameObjectsManager);

        return game2;
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
        var playerShape = gameObjectFactory.getRectangle(constants.GAME4_PLAYER_TOP_LEFT_POINT_X, constants.GAME4_PLAYER_TOP_LEFT_POINT_Y,
            constants.GAME4_PLAYER_WIDTH, constants.GAME4_PLAYER_HEIGHT, constants.GAME4_PLAYER_FILL, constants.GAME4_PLAYER_STROKE, constants.GAME4_PLAYER_STROKE_WIDTH),
            renderer = Object.create(game4RendererProto),
            somePlayer = Object.create(player).init(playerShape, 'down'),
            gameObjectsManager = Object.create(game4ObjectsManagerProto),
            game4;

        game4 = Object.create(game4Prototype).init(renderer, somePlayer, [], gameObjectsManager);

        return game4;
    }   

    return {
        initiateGames: function () {
            var games = [],
                game1 = initializeGame1(),
                game2 = initializeGame2(),
                game3 = initializeGame3(),
                game4 = initializeGame4();

            games.push(game1,
                       game2,
                       game3,
                       game4
                       );

            return games;
        }
    };
}());