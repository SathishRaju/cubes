"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
exports.HIERARCHY_PREFIX_CHAR = '@';
var Hierarchy = /** @class */ (function () {
    function Hierarchy(attrs, dimension) {
        this.name = attrs.name;
        this.label = attrs.label;
        this.description = attrs.description;
        this.info = attrs.info;
        var level_names = attrs.levels || [];
        this.levels = level_names.map(function (name) { return dimension.level(name); });
    }
    Hierarchy.prototype.toString = function () {
        return exports.HIERARCHY_PREFIX_CHAR + this.name;
    };
    Hierarchy.prototype.display_label = function () {
        return this.label || this.name;
    };
    Hierarchy.prototype.level_index = function (level) {
        return this.levels.indexOf(utils_1.find(this.levels, function (lvl) { return lvl.name === level.name; }));
    };
    Hierarchy.prototype.readCell = function (cell, level_limit) {
        var result = [];
        for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
            var level = _a[_i];
            var info = level.readCell(cell);
            if (info !== null)
                result.push(info);
            if (level_limit && level_limit.name === level.name)
                break;
        }
        return result;
    };
    return Hierarchy;
}());
exports.Hierarchy = Hierarchy;
