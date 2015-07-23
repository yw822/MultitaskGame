var validator = (function () {
    var validator = {};

    Object.defineProperty(validator, 'validateBoolean', {
        value: function (value, valueName) {
            if (typeof value !== 'boolean') {
                throw new TypeError(valueName + ' must be a boolean');
            }
        }
    });

    return validator;
}());