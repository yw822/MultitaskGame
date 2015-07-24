var circle = (function (parent) {
    var circle = Object.create(parent);

    Object.defineProperty(circle, 'init', {
        value: function (xCoordinate, yCoordinate, radius, fill, stroke) {
            parent.init.call(this, xCoordinate, yCoordinate, fill, stroke);
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

    Object.defineProperty(circle, 'update', {
        value: function () {
            // TODO: Implement this method to move your circle

            // Delete this line!
            parent.update.call(this);
        }
    });

    return circle;
}(gameObject));
