var validator = (function () {
    var validator = {};

    Object.defineProperty(validator, 'validateBoolean', {
        value: function (value, valueName) {
            if (typeof value !== 'boolean') {
                throw new TypeError(valueName + ' must be a boolean');
            }
        }
    });

    Object.defineProperty(validator, 'validateIfNumber', {
        value: function (value, valueName) {
            if (typeof value !== 'number') {
                throw new Error(valueName + ' must be a number');
            }
        }
    });

    //I am not sure for this :(
    Object.defineProperty(validator, 'validateIfHexColor', {
        value: function (value, valueName) {
            var checkHexFormat  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/;
            if (checkHexFormat.(value) == false) {
                throw new Error(valueName + ' must be a HEX color');
            }
        }
    });

    return validator;
}());