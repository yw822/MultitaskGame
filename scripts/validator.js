var validator = (function () {
    var validator = {},
        defaultValueName = 'Value';

    function isRealNumber(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
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

    Object.defineProperty(validator, 'validateIfString', {
        value: function (value, valueName) {
            valueName = valueName || defaultValueName;

            if (typeof value !== 'string') {
                throw new Error(valueName + ' must be a string');
            }
        }
    });

    return validator;
}());