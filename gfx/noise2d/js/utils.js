let utils = {};

utils.clamp = function(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

utils.lerp = function(start, end, value) {
    value = utils.clamp(value, 0, 1);
    return ((end-start) * value) + start;
}

