var rectangle = (function (parent) {
    var rectangle = Object.create(parent);

    Object.defineProperty(rectangle, 'init', {
        value: function (xCoordinate, yCoordinate, width, height, fill, stroke, strokeWidth) {
            parent.init.call(this, xCoordinate, yCoordinate, fill, stroke, strokeWidth);
            this.width = width;
            this.height = height;

            return this;
        }
    });

    Object.defineProperty(rectangle, 'width', {
        get: function () {
            return this._width;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'width');
            this._width = value;
        }
    });

    Object.defineProperty(rectangle, 'height', {
        get: function () {
            return this._height;
        },
        set: function (value) {
            validator.validateIfPositiveNumber(value, 'height');
            this._height = value;
        }
    });

    // This method binds rectangle with canvas! The rectangle should not know how to draw itself!
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