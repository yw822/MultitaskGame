var circle = (function (parent) {
    var circle = Object.create(parent);

    Object.defineProperty(circle, 'init', {
        value: function (xCoordinate, yCoordinate, fill, stroke) {
            parent.init.call(this, xCoordinate, yCoordinate, fill, stroke);

            return this;
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
