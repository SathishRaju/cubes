"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
exports.PATH_PART_ESCAPE_PATTERN = /([\\!|:;,-])/g;
exports.PATH_PART_UNESCAPE_PATTERN = /\\([\\!|:;,-])/g;
exports.NULL_PART_STRING = '__null__';
exports.PATH_STRING_SEPARATOR_CHAR = ',';
exports.PATH_STRING_SEPARATOR = /,/g;
function _escape_path_part(part) {
    if (part == null) {
        return exports.NULL_PART_STRING;
    }
    return part.toString().replace(exports.PATH_PART_ESCAPE_PATTERN, function (match, b1) { return '\\' + b1; });
}
function _unescape_path_part(part) {
    if (part === exports.NULL_PART_STRING) {
        return null;
    }
    return part.replace(exports.PATH_PART_UNESCAPE_PATTERN, function (match, b1) { return b1; });
}
function string_from_path(path) {
    return (path || []).map(function (element) { return _escape_path_part(element); }).join(exports.PATH_STRING_SEPARATOR_CHAR);
}
exports.string_from_path = string_from_path;
function path_from_string(path_string) {
    var paths = utils._split_with_negative_lookbehind(path_string, exports.PATH_STRING_SEPARATOR, '\\');
    var parsed = (paths || []).map(function (e) { return _unescape_path_part(e); });
    return parsed;
}
exports.path_from_string = path_from_string;
