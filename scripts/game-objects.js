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

///Really not sure if the circle should be in this file and if it should look like this - please check.
/// I will not proceed with rectangle and triangle until someone verifies the below code. This is in order to minimize the "refactoring" of what I've written so far.
var circle = (function (parent) {
    var circle = Object.create(parent);

    // not sure exactly what this should be doing - please check it
    Object.defineProperty(circle, 'init', {
        value: function () {
            //I suppose it should take values from the games somehow
            parent.init.call(this);

            return this;
        }
    });

    Object.defineProperty(circle, 'update', {
        value: function () {
            //?? code to update the position of the circle ??
        }
    });

    //?? I suppose we should be checking somehow if the coordinates are where they should be
    //on the canvas, and within the game logic ??

    return circle;
}(gameObject));
