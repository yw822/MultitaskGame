module.exports = (function() {
    var gameObjectManager = {},
        validator = require('./validator.js'),
        triangle = require('./triangle.js');

    Object.defineProperty(gameObjectManager, 'move', {
        value: function (gameObject, dx, dy) {
            validator.validateIfGameObject(gameObject, 'gameObject to move');
            validator.validateIfRealNumber(dx);
            validator.validateIfRealNumber(dy);

            gameObject.xCoordinate += dx;
            gameObject.yCoordinate += dy;

            gameObject.collisionProfile.pos.x += dx;
            gameObject.collisionProfile.pos.y += dy;

            if (triangle.isPrototypeOf(gameObject)) {
                gameObject.xCoordinateB += dx;
                gameObject.yCoordinateB += dy;

                gameObject.xCoordinateC += dx;
                gameObject.yCoordinateC += dy;
            }
        }
    });

    return gameObjectManager;
}());