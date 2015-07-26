module.exports = (function () {
    var validator = {},
        CONSTANTS = require('./constants.js');

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

    Object.defineProperty(validator, 'validateIfGameObject', {
        value: function (value, valueName) {
            var gameObject = require('./game-object.js');

            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateNotNullAndUndefined(value, valueName);

            if (!gameObject.isPrototypeOf(value)) {
                throw new TypeError(valueName + ' must be a gameObject');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfPlayer', {
        value: function (value, valueName) {
            var player = require('./player.js');
            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateNotNullAndUndefined(value, valueName);

            if (!player.isPrototypeOf(value)) {
                throw new TypeError(valueName + ' must be a player');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfRenderer', {
        value: function (value, valueName) {
            var renderer = require('./renderer.js'),

                valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateNotNullAndUndefined(value, valueName);

            if (!renderer.isPrototypeOf(value)) {
                throw new TypeError(valueName + ' must be a renderer');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfCollisionProfile', {
        value: function (value, valueName) {
            var SAT = require('sat');

            valueName = valueName || CONSTANTS.DEFAULT_VALUE_NAME;

            this.validateNotNullAndUndefined(value, valueName);

            if (!((value instanceof SAT.Circle) || (value instanceof SAT.Polygon))) {
                throw new TypeError(valueName + ' must be a SAT.Circle or SAT.Polygon');
            }
        }
    });

    return validator;
}());