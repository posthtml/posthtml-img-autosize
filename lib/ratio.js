module.exports = function (target, source) {
    var output = { width: null, height: null };

    ['width', 'height'].forEach(side => {
        // If the target side does not exist, do nothing
        if (isEmpty(target[side])) {
            return;
        }

        // If the side is a pixel value, use it
        if (isPixel(target[side])) {
            output[side] = target[side];
            return;
        }

        // If the side is a percentage, convert it to a pixel value
        // Also convert the target dimension, as we may want to use this value
        // E.g.: 50% of 500 => 250
        if (isPercent(target[side])) {
            output[side] = source[side] * getPercent(target[side]);
            target[side] = output[side];
            return;
        }
    });

    ['width', 'height'].forEach(side => {
        // If the side is an auto value
        if (isAuto(target[side])) {
            // If both sides are auto, use source values
            if (isAuto(target[adjacent(side)])) {
                output[side] = source[side];
                return;
            }

            if (isEmpty(target[adjacent(side)])) {
                output[side] = source[side];
                return;
            }

            output[side] = source[side] * (target[adjacent(side)] / source[adjacent(side)]);
            return;
        }
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
    return value.match(/^(100|\d{1,2})%$/) != null;
}

function getPercent(value) {
    const matches = value.match(/^(100|\d{1,2})%$/);
    return parseInt(matches[1]) / 100;
}

function isPixel(value) {
    return parseInt(value) == value;
}
