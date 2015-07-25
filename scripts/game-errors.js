module.exports = (function() {
    var gameError = {
        NotImplementedError: function (message) {
            this.name = "NotImplementedError";
            this.message = (message || "");
        }
    };

    gameError.NotImplementedError.prototype = Error.prototype;

    return gameError;
}());