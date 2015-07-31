module.exports = (function (parent) {
    var game2Renderer = Object.create(parent),
        constants = require('./constants.js'),
        triangle = require('./triangle.js'),
        svgContainer = document.getElementById('the-svg'),
        svgNs = 'http://www.w3.org/2000/svg',
        backgroundIsDrawn = false,
        isPlayerDrawn = false,
        playerRect = document.createElementNS(svgNs, 'rect'),
        firstObstacle = document.createElementNS(svgNs, 'path'),
        secondObstacle = document.createElementNS(svgNs, 'path'),
        obstaclesCount = 0;

    function drawBackground() {
        var i;

        for (i = 0; i < constants.GAME2_BACKGROUND_RECTS_COUNT; i += 1) {
            svgContainer.style.display = 'inline-block';
            var rect = document.createElementNS(svgNs, 'rect');
            rect.setAttribute('x', constants.GAME2_BACKGROUND_TOP_LEFT_X);
            rect.setAttribute('y', constants.GAME2_BACKGROUND_TOP_LEFT_Y + i*constants.GAME2_BACKGROUND_RECTS_HEIGHT);
            rect.setAttribute('width', constants.GAME2_BACKGROUND_RECTS_WIDTH);
            rect.setAttribute('height', constants.GAME2_BACKGROUND_RECTS_HEIGHT);
            rect.setAttribute('fill', constants.GAME2_BACKGROUND_RECTS_FILL);
            rect.setAttribute('stroke', constants.GAME2_BACKGROUND_RECTS_STROKE);
            rect.setAttribute('stroke-width', constants.GAME2_BACKGROUND_RECTS_STROKE_WIDTH);

            svgContainer.appendChild(rect);
        }
    }

    Object.defineProperty(game2Renderer, 'clearStage', {
        value: function () {
            
        }
    });

    Object.defineProperty(game2Renderer, 'render', {
        value: function (gameObject) {
            if (!backgroundIsDrawn) {
                backgroundIsDrawn = true;
                drawBackground();
            }

            if (triangle.isPrototypeOf(gameObject)) {
                if (obstaclesCount === 0) {
                    obstaclesCount += 1;
                    firstObstacle.setAttribute('d', 'M ' + gameObject.xCoordinateA + ' ' + gameObject.yCoordinateA
                        + ' L ' + gameObject.xCoordinateB + ' ' + gameObject.yCoordinateB
                        + ' L ' + gameObject.xCoordinateC + ' ' + gameObject.yCoordinateC + ' z');
                    firstObstacle.setAttribute('fill', 'black');

                    svgContainer.appendChild(firstObstacle);
                }
                else if (obstaclesCount === 1) {
                    obstaclesCount += 1;
                    secondObstacle.setAttribute('d', 'M ' + gameObject.xCoordinateA + ' ' + gameObject.yCoordinateA
                        + ' L ' + gameObject.xCoordinateB + ' ' + gameObject.yCoordinateB
                        + ' L ' + gameObject.xCoordinateC + ' ' + gameObject.yCoordinateC + ' z');
                    secondObstacle.setAttribute('fill', 'black');

                    svgContainer.appendChild(secondObstacle);
                }
                else {
                    if (gameObject.id === 1) {
                        firstObstacle.setAttribute('d', 'M ' + gameObject.xCoordinateA + ' ' + gameObject.yCoordinateA
                        + ' L ' + gameObject.xCoordinateB + ' ' + gameObject.yCoordinateB
                        + ' L ' + gameObject.xCoordinateC + ' ' + gameObject.yCoordinateC + ' z');
                    }
                    else if (gameObject.id === 2) {
                        secondObstacle.setAttribute('d', 'M ' + gameObject.xCoordinateA + ' ' + gameObject.yCoordinateA
                        + ' L ' + gameObject.xCoordinateB + ' ' + gameObject.yCoordinateB
                        + ' L ' + gameObject.xCoordinateC + ' ' + gameObject.yCoordinateC + ' z');
                    }
                }
            }
            else {
                playerRect.setAttribute('x', gameObject.xCoordinate);
                playerRect.setAttribute('y', gameObject.yCoordinate);
                playerRect.setAttribute('width', gameObject.width);
                playerRect.setAttribute('height', gameObject.height);
                playerRect.setAttribute('fill', gameObject.fill);
                playerRect.setAttribute('stroke', gameObject.stroke);
                playerRect.setAttribute('stroke-width', gameObject.strokeWidth);

                if (!isPlayerDrawn) {
                    isPlayerDrawn = true;                 

                    svgContainer.appendChild(playerRect);
                }
            }
        }
    });

    return game2Renderer;
}(require('./renderer.js')));