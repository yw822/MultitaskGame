var circle = (function (parent) {
    var circle = Object.create(parent);

    Object.defineProperty(circle, 'init', {
        value: function (xCoordinate, yCoordinate, radius, collisionProfile, fill, stroke, strokeWidth) {
            parent.init.call(this, xCoordinate, yCoordinate, collisionProfile, fill, stroke, strokeWidth);
            this.radius = radius;

            return this;
        }
    });

    Object.defineProperty(gameObject, 'radius', {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'radius');
            this._radius = value;
        }
    });

    return circle;
}(gameObject));
