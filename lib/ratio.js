module.exports = function (target, source) {
    var output = { width: null, height: null };

    ['width', 'height'].forEach(side => {
        const adjacentSide = adjacent(side);

        // If the side is not auto, passthrough the value
        if (!isAuto(target[side])) {
            output[side] = target[side];
            return;
        }

        // All calculations are relative to the adjacent side

        // If the adjacent side is empty or auto, use the image size
        if (isEmpty(target[adjacentSide]) || isAuto(target[adjacentSide])) {
            output[side] = source[side];
            return;
        }

        // If the adjacent side is a percent, copy it
        if (isPercent(target[adjacentSide])) {
            output[side] = target[adjacentSide];
            return;
        }

        // If the adjacent side is a pixel value, use ratio aspect
        if (isPixel(target[adjacentSide])) {
            output[side] = source[side] * (target[adjacentSide] / source[adjacentSide]);
            return;
        }

        throw new Error('Unable to interpret ' + adjacentSide + ' attribute: ' + target[adjacentSide]);
    });

    return {
        width: output.width ? output.width.toString() : null,
        height: output.height ? output.height.toString() : null
    };
};

function adjacent(side) {
    return side == 'width' ? 'height' : 'width';
}

function isEmpty(value) {
    return value == null;
}

function isAuto(value) {
    return value == 'auto';
}

function isPercent(value) {
    return value.toString().match(/^(100|\d{1,2})%$/) != null;
}

function isPixel(value) {
    return parseInt(value) == value;
}
