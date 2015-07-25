//TODO: make a gameObjectFactory
var gameObject = (function () {
    var gameObject = {};

    Object.defineProperty(gameObject, 'init', {
        value: function (xCoordinate, yCoordinate, fill, stroke, strokeWidth) {
            this.xCoordinate = xCoordinate;
            this.yCoordinate = yCoordinate;
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

    Object.defineProperty(gameObject, 'update', {
        value: function () {
            throw new NotImplementedError('Your game object needs to implement the "abstract" method update (change coordinates, state, etc...)');
        }
    });

    return gameObject;
}());