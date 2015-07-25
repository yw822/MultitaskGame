var renderer = (function() {
    var renderer = {};

    Object.defineProperty(renderer, 'clearStage', {
        value: function () {
            throw new NotImplementedError('Your renderer needs to implement the "abstract" method clearStage');
        }
    });

    Object.defineProperty(renderer, 'render', {
        value: function (gameObject) {
            throw new NotImplementedError('Your renderer needs to implement the "abstract" method render');
        }
    });

    return renderer;
}());