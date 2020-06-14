"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var level_1 = require("./level");
var hierarchy_1 = require("./hierarchy");
exports.DIMENSION_STRING_SEPARATOR_CHAR = ':';
exports.DIMENSION_STRING_SEPARATOR = /:/g;
exports.SPLIT_DIMENSION_STRING = '__within_split__';
var Dimension = /** @class */ (function () {
    function Dimension(md) {
        var _this = this;
        this.name = md.name;
        !md.label || (this.label = md.label);
        !md.description || (this.description = md.description);
        !md.default_hierarchy_name || (this.default_hierarchy_name = md.default_hierarchy_name);
        !md.info || (this.info = md.info);
        !md.role || (this.role = md.role);
        !md.cardinality || (this.cardinality = md.cardinality);
        !md.nonadditive || (this.nonadditive = md.nonadditive);
        !md.is_flat || (this.is_flat = md.is_flat);
        this.levels = [];
        if (md.levels) {
            this.levels = md.levels.map(function (level) { return new level_1.Level(_this.name, level); });
        }
        this.hierarchies = {};
        if (md.hierarchies) {
            for (var i in md.hierarchies) {
                var hier = new hierarchy_1.Hierarchy(md.hierarchies[i], this);
                this.hierarchies[hier.name] = hier;
            }
        }
        // if no default_hierarchy_name defined, use first hierarchy's name.
        if (!this.default_hierarchy_name && md.hierarchies
            && md.hierarchies.length > 0) {
            this.default_hierarchy_name = md.hierarchies[0].name;
        }
    }
    Object.defineProperty(Dimension.prototype, "default_hierarchy", {
        get: function () {
            return this.hierarchies[this.default_hierarchy_name];
        },
        enumerable: true,
        configurable: true
    });
    Dimension.prototype.level = function (name) {
        return utils_1.find(this.levels, function (level) { return level.name === name; });
    };
    Dimension.prototype.toString = function () {
        return this.name;
    };
    Object.defineProperty(Dimension.prototype, "display_label", {
        get: function () {
            return this.label || this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dimension.prototype, "isDateDimension", {
        get: function () {
            // Inform if a dimension is a date dimension and can be used as a date
            // filter (i.e. with date selection tool).
            return ((this.role === 'time') &&
                ((!('cv-datefilter' in this.info)) || (this.info['cv-datefilter'] === true)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dimension.prototype, "hierarchies_count", {
        get: function () {
            var _this = this;
            return Object.keys(this.hierarchies).reduce(function (count, hiename) {
                if (_this.hierarchies.hasOwnProperty(hiename))
                    return count + 1;
                return count;
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    return Dimension;
}());
exports.Dimension = Dimension;
exports.SPLIT_DIMENSION = new Dimension({
    name: exports.SPLIT_DIMENSION_STRING,
    label: 'Matches Filters',
    hierarchies: [{ name: 'default', levels: [exports.SPLIT_DIMENSION_STRING] }],
    levels: [{ name: exports.SPLIT_DIMENSION_STRING, attributes: [{ name: exports.SPLIT_DIMENSION_STRING }], label: 'Matches Filters' }]
});
