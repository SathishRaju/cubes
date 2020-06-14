"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _split_with_negative_lookbehind(str, regex, lb) {
    var splits = [];
    for (var match = regex.exec(str); match != null; match = regex.exec(str)) {
        if (str.substr(match.index - lb.length, lb.length) !== lb) {
            splits.push(str.substring(0, match.index));
            str = str.substring(Math.min(match.index + match[0].length, str.length));
            regex.lastIndex = 0;
        }
        else {
            // match has the lookbehind, must exclude
        }
    }
    splits.push(str);
    return splits;
}
exports._split_with_negative_lookbehind = _split_with_negative_lookbehind;
function find(arr, fn) {
    var result = arr.filter(fn);
    if (result.length > 0)
        return result[0];
    return undefined;
}
exports.find = find;
function pick(obj, keys) {
    var result = {};
    for (var k in obj) {
        result[k] = obj[k];
    }
    return result;
}
exports.pick = pick;
