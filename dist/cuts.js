"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dimension_1 = require("./dimension");
var hierarchy_1 = require("./hierarchy");
var paths = require("./paths");
var utils = require("./utils");
exports.CUT_INVERSION_CHAR = '!';
exports.RANGE_CUT_SEPARATOR_CHAR = '-';
exports.SET_CUT_SEPARATOR_CHAR = ';';
exports.CUT_STRING_SEPARATOR_CHAR = '|';
exports.CUT_STRING_SEPARATOR = /\|/g;
exports.RANGE_CUT_SEPARATOR = /-/g;
exports.SET_CUT_SEPARATOR = /;/g;
exports.CUT_PARSE_REGEXP = new RegExp('^(' + exports.CUT_INVERSION_CHAR + '?)(\\w+)(?:' + hierarchy_1.HIERARCHY_PREFIX_CHAR + '(\\w+))?' + dimension_1.DIMENSION_STRING_SEPARATOR_CHAR + '(.*)$');
var SerializedCut = /** @class */ (function () {
    function SerializedCut() {
    }
    SerializedCut.prototype.toString = function (cube) {
        var invert = this.invert ? '!' : '';
        var dimParts = cube.dimensionParts(this.dimension);
        var cutDim = dimParts.dimension.name + (dimParts.hierarchy.name !== 'default' ? '@' + dimParts.hierarchy.name : '');
        return invert + cutDim + ':' + this.value;
    };
    SerializedCut.prototype.toCut = function (cube) {
        return cut_from_string(cube, serializedCutToString(cube, this));
    };
    return SerializedCut;
}());
exports.SerializedCut = SerializedCut;
var PointCut = /** @class */ (function () {
    function PointCut(dimension, hierarchy, path, invert, level_depth) {
        this.type = 'point';
        this.dimension = dimension;
        this.hierarchy = dimension.hierarchies[hierarchy] || dimension.default_hierarchy;
        this.path = path;
        this.level_depth = level_depth;
        this.invert = !!invert;
        this.level = this.hierarchy.levels[level_depth - 1];
    }
    PointCut.prototype.toString = function () {
        var path_str = paths.string_from_path(this.path);
        return (this.invert ? exports.CUT_INVERSION_CHAR : '') +
            this.dimension.toString() +
            (this.hierarchy.toString() || '') +
            dimension_1.DIMENSION_STRING_SEPARATOR_CHAR +
            path_str;
    };
    PointCut.prototype.toCellProps = function () {
        return {
            type: 'point',
            dimension: this.dimension.name,
            hierarchy: this.hierarchy.name,
            path: this.path,
            level_depth: this.level_depth,
            invert: this.invert
        };
    };
    return PointCut;
}());
exports.PointCut = PointCut;
var SetCut = /** @class */ (function () {
    function SetCut(dimension, hierarchy, path_set, invert, level_depth) {
        this.type = 'set';
        this.dimension = dimension;
        this.hierarchy = dimension.hierarchies[hierarchy] || dimension.default_hierarchy;
        this.paths = path_set;
        this.level_depth = level_depth;
        this.invert = !!invert;
        this.level = this.hierarchy.levels[level_depth - 1];
    }
    SetCut.prototype.toString = function () {
        var path_str = this.paths.map(paths.string_from_path).join(exports.SET_CUT_SEPARATOR_CHAR);
        return (this.invert ? exports.CUT_INVERSION_CHAR : '') +
            this.dimension.toString() +
            (this.hierarchy.toString() || '') +
            dimension_1.DIMENSION_STRING_SEPARATOR_CHAR +
            path_str;
    };
    SetCut.prototype.toCellProps = function () {
        return {
            type: 'point',
            dimension: this.dimension.name,
            hierarchy: this.hierarchy.name,
            paths: this.paths,
            level_depth: this.level_depth,
            invert: this.invert
        };
    };
    return SetCut;
}());
exports.SetCut = SetCut;
var RangeCut = /** @class */ (function () {
    function RangeCut(dimension, hierarchy, from_path, to_path, invert, level_depth) {
        this.type = 'range';
        this.dimension = dimension;
        this.hierarchy = dimension.hierarchies[hierarchy] || dimension.default_hierarchy;
        if (from_path === null && to_path === null) {
            throw 'Either from_path or to_path must be defined for RangeCut';
        }
        this.from_path = from_path;
        this.to_path = to_path;
        this.level_depth = level_depth;
        this.invert = !!invert;
    }
    RangeCut.prototype.toString = function () {
        var path_str = paths.string_from_path(this.from_path) +
            exports.RANGE_CUT_SEPARATOR_CHAR +
            paths.string_from_path(this.to_path);
        return (this.invert ? exports.CUT_INVERSION_CHAR : '') +
            this.dimension.toString() +
            (this.hierarchy.toString() || '') +
            dimension_1.DIMENSION_STRING_SEPARATOR_CHAR +
            path_str;
    };
    RangeCut.prototype.toCellProps = function () {
        return {
            type: 'point',
            dimension: this.dimension.name,
            hierarchy: this.hierarchy.name,
            from_path: this.from_path,
            to_path: this.to_path,
            level_depth: this.level_depth,
            invert: this.invert
        };
    };
    return RangeCut;
}());
exports.RangeCut = RangeCut;
function cut_from_aggregate_result(cube, cut) {
    var dim = cube.dimension(cut.dimension);
    switch (cut.type) {
        case 'point':
            return new PointCut(dim, cut.hierarchy, cut.path, cut.invert, cut.level_depth);
        case 'set':
            return new SetCut(dim, cut.hierarchy, cut.paths, cut.invert, cut.level_depth);
        case 'range':
            return new RangeCut(dim, cut.hierarchy, cut.from_path, cut.to_path, cut.invert, cut.level_depth);
        default:
            return undefined;
    }
}
exports.cut_from_aggregate_result = cut_from_aggregate_result;
function cut_from_string(cube, cut_string) {
    // parse out invert, dim_name, hierarchy, and path thingy
    var match = exports.CUT_PARSE_REGEXP.exec(cut_string);
    if (!match) {
        return null;
    }
    var invert = !!(match[1]), dim_name = match[2], hierarchy = match[3] || null, path_thingy = match[4];
    var dimension = cube.dimension(dim_name);
    // if path thingy splits on set separator, make a SetCut.
    var splits = utils._split_with_negative_lookbehind(path_thingy, exports.SET_CUT_SEPARATOR, '\\');
    if (splits.length > 1) {
        var _paths = splits.map(function (ss) { return paths.path_from_string(ss); });
        return new SetCut(dimension, hierarchy, _paths, invert, _paths[0].length);
    }
    // else if path thingy splits into two on range separator, make a RangeCut.
    splits = utils._split_with_negative_lookbehind(path_thingy, exports.RANGE_CUT_SEPARATOR, '\\');
    if (splits.length === 2) {
        var from_path = splits[0] ? paths.path_from_string(splits[0]) : null;
        var to_path = splits[1] ? paths.path_from_string(splits[1]) : null;
        return new RangeCut(dimension, hierarchy, from_path, to_path, invert, from_path.length);
    }
    // else it's a PointCut.
    var path = paths.path_from_string(path_thingy);
    return new PointCut(dimension, hierarchy, path, invert, path.length);
}
exports.cut_from_string = cut_from_string;
function cuts_from_string(cube, cut_param_value) {
    var cut_strings = utils._split_with_negative_lookbehind(cut_param_value, exports.CUT_STRING_SEPARATOR, '\\');
    return (cut_strings || []).map(function (e) { return cut_from_string(cube, e); });
}
exports.cuts_from_string = cuts_from_string;
function serializedCutToString(cube, e) {
    var invert = e.invert ? '!' : '';
    var dimParts = cube.dimensionParts(e.dimension);
    var cutDim = dimParts.dimension.name + (dimParts.hierarchy.name !== 'default' ? '@' + dimParts.hierarchy.name : '');
    return invert + cutDim + ':' + e.value;
}
exports.serializedCutToString = serializedCutToString;
function cutFromSerializedCut(cube, serializedCut) {
    return cut_from_string(cube, serializedCutToString(cube, serializedCut));
}
exports.cutFromSerializedCut = cutFromSerializedCut;
