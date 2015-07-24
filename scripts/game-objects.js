/**
 * Created by Velitoo on 24/07/2015.
 */
var gameObject = (function () {
    var gameObject = {};

    Object.defineProperty(gameObject, 'init', {
        value: function (xCoordinate, yCoordinate, fill, stroke) {
            this.xCoordinate = 0;
            this.yCoordinate = 0;
            this.fill = "#32cd32";
            this.stroke = "#32cd32";

            return this;
        }
    });

    Object.defineProperty(gameObject, 'xCoordinate', {
        get: function () {
            return this._xCoordinate;
        },
        set: function (value) {
            validator.validateIfNumber(value, 'xCoordinate');
            this._xCoordinate = value;
        }
    });

    Object.defineProperty(gameObject, 'yCoordinate', {
        get: function () {
            return this._yCoordinate;
        },
        set: function (value) {
            validator.validateIfNumber(value, 'yCoordinate');
            this._yCoordinate = value;
        }
    });

    Object.defineProperty(gameObject, 'fill', {
        get: function () {
            return this._fill;
        },
        set: function (value) {
            validator.validateIfHexColor(value, 'fill');
            this._fill = value;
        }
    });

    Object.defineProperty(gameObject, 'stroke', {
        get: function () {
            return this._stroke;
        },
        set: function (value) {
            validator.validateIfHexColor(value, 'stroke');
            this._stroke = value;
        }
    });

    //I am not sure for this. :(
    Object.defineProperty(gameObject, 'update', {
        value: function () {
            throw new NotImplementedError('You need to implement the "abstract" method update');
        }
    });

    return gameObject;
}());
