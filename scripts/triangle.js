var triangle = (function (parent) {
    var triangle = Object.create(parent);

    Object.defineProperty(triangle, 'init', {
        value: function (xCoordinate, yCoordinate, fill, stroke) {
            parent.init.call(this, xCoordinate, yCoordinate, fill, stroke);

            return this;
        }
    });

    Object.defineProperty(triangle, 'update', {
        value: function () {
            // TODO: Implement this method to move your circle

            // Delete this line!
            parent.update.call(this);
        }
    });

    return triangle;
}(gameObject));
