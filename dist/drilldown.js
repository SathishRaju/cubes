"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dimension_1 = require("./dimension");
var hierarchy_1 = require("./hierarchy");
var cuts_1 = require("./cuts");
var utils = require("./utils");
exports.DRILLDOWN_PARSE_REGEXP = new RegExp('^(\\w+)(?:' + hierarchy_1.HIERARCHY_PREFIX_CHAR + '(\\w+))?(?:' + dimension_1.DIMENSION_STRING_SEPARATOR_CHAR + '(\\w+))?$');
var Drilldown = /** @class */ (function () {
    function Drilldown(dimension, hierarchy, level) {
        this.dimension = dimension;
        this.hierarchy = hierarchy ? dimension.hierarchies[hierarchy] : dimension.default_hierarchy;
        this.level = dimension.level(level) || this.hierarchy.levels[0];
        if (!this.hierarchy)
            throw 'Drilldown cannot recognize hierarchy ' + hierarchy + ' for dimension ' + dimension.toString();
        if (!this.level)
            throw 'Drilldown cannot recognize level ' + level + ' for dimension ' + dimension.toString();
    }
    Drilldown.prototype.toString = function () {
        return '' + this.dimension.toString() + this.hierarchy.toString() +
            dimension_1.DIMENSION_STRING_SEPARATOR_CHAR + this.level.toString();
    };
    Drilldown.prototype.keysInResultCell = function () {
        var _this = this;
        var saw_this_level = false;
        return this.hierarchy.levels
            .filter(function (level) { return (level.key === _this.level.key && (saw_this_level = true)) || (!saw_this_level); })
            .map(function (level) { return level.key.ref; });
    };
    Drilldown.prototype.labelsInResultCell = function () {
        var _this = this;
        var saw_this_level = false;
        return this.hierarchy.levels
            .filter(function (level) { return (level.key === _this.level.key && (saw_this_level = true)) || (!saw_this_level); })
            .map(function (level) { return level.label_attribute.ref; });
    };
    return Drilldown;
}());
exports.default = Drilldown;
function drilldown_from_string(cube, drilldown_string) {
    var match = exports.DRILLDOWN_PARSE_REGEXP.exec(drilldown_string);
    if (!match) {
        return null;
    }
    var dim_name = match[1], hierarchy = match[2] || null, level = match[3] || null;
    var dimension = cube.dimension(dim_name);
    if (!dimension)
        if (dim_name === dimension_1.SPLIT_DIMENSION_STRING)
            dimension = dimension_1.SPLIT_DIMENSION;
        else
            return null;
    return new Drilldown(dimension, hierarchy, level);
}
exports.drilldown_from_string = drilldown_from_string;
function drilldowns_from_string(cube, drilldown_param_value) {
    var dd_strings = utils._split_with_negative_lookbehind(drilldown_param_value, cuts_1.CUT_STRING_SEPARATOR, '\\');
    return (dd_strings || []).map(function (e) { return drilldown_from_string(cube, e); });
}
exports.drilldowns_from_string = drilldowns_from_string;
function drilldowns_to_string(drilldowns) {
    return drilldowns.map(function (d) { return d.toString(); }).join(cuts_1.CUT_STRING_SEPARATOR_CHAR);
}
exports.drilldowns_to_string = drilldowns_to_string;
