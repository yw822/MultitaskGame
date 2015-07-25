var validator = (function () {
    var validator = {},
        defaultValueName = 'Value';

    function isRealNumber(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    function isInteger(number) {
        return number === parseInt(number, 10);
    }

    Object.defineProperty(validator, 'validateNotNullAndUndefined', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            if (value == undefined) {
                throw new TypeError(valueName + ' cannot be null and undefined.');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfBoolean', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            if (typeof value !== 'boolean') {
                throw new TypeError(valueName + ' must be a boolean');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfRealNumber', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            if (isRealNumber(value) === false) {
                throw new TypeError(valueName + ' must be a real number');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfPositiveNumber', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            this.validateIfRealNumber(value, valueName);

            if (value <= 0) {
                throw new RangeError(valueName + ' must be a positive number');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfInteger', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            if (isInteger(value) === false) {
                throw new TypeError(valueName + ' must be an integer');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfString', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            if (typeof value !== 'string') {
                throw new TypeError(valueName + ' must be a string');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfArray', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            if (!(value instanceof Array)) {
                throw new TypeError(valueName + ' must be an array');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfGameObject', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            this.validateNotNullAndUndefined(value, valueName);

            if (!gameObject.isPrototypeOf(value)) {
                throw new TypeError(valueName + ' must be a gameObject');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfPlayer', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            this.validateNotNullAndUndefined(value, valueName);

            if (!player.isPrototypeOf(value)) {
                throw new TypeError(valueName + ' must be a player');
            }
        }
    });

    return validator;
}());