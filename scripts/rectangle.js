var rectangle = (function (parent) {
    var rectangle = Object.create(parent);

    Object.defineProperty(rectangle, 'init', {
        value: function (xCoordinate, yCoordinate, fill, stroke) {
            parent.init.call(this, xCoordinate, yCoordinate, fill, stroke);

            return this;
        }
    });

    Object.defineProperty(rectangle, 'update', {
        value: function () {
            // TODO: Implement this method to move your circle

            // Delete this line!
            parent.update.call(this);
        }
    });

    Object.defineProperty(rectangle, 'draw', {
        value: function (width, height, canvas) {
            var canvas = canvas;
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
                ctx.fillRect(this.xCoordinate, this.yCoordinate, width, height);
                ctx.clearRect(this.xCoordinate, this.yCoordinate, width, height);
                ctx.strokeRect(this.xCoordinate, this.yCoordinate, width, height);
            }
        }
    });

    return rectangle;
}(gameObject));