"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var commons_1 = require("./commons");
var dimension_1 = require("./dimension");
var Cube = /** @class */ (function () {
    function Cube(metadata) {
        this.name = metadata.name;
        this.label = metadata.label;
        this.description = metadata.description;
        this.key = metadata.key;
        this.info = metadata.info;
        this.category = metadata.category;
        this.features = metadata.features;
        this.measures = (metadata.measures || []).map(function (m) { return new commons_1.Measure(m); });
        this.aggregates = (metadata.aggregates || []).map(function (m) { return new commons_1.MeasureAggregate(m); });
        this.details = (metadata.details || []).map(function (m) { return new commons_1.Attribute(m); });
        this.dimensions = (metadata.dimensions || []).map(function (dim) { return new dimension_1.Dimension(dim); });
    }
    Cube.prototype.dimension = function (name) {
        // Return a dimension with given name
        return utils_1.find(this.dimensions, function (dim) { return dim.name === name; });
    };
    Cube.prototype.cvdim_dim = function (dimensionString) {
        // Get a dimension by name. Accepts dimension hierarchy and level in the input string.
        var dimname = dimensionString;
        if (dimensionString.indexOf('@') > 0) {
            dimname = dimensionString.split('@')[0];
        }
        else if (dimensionString.indexOf(':') > 0) {
            dimname = dimensionString.split(':')[0];
        }
        return this.dimension(dimname);
    };
    Cube.prototype.dimensionParts = function (dimensionString) {
        // Get a dimension info by name. Accepts dimension hierarchy and level in the input string.
        var dim = this.cvdim_dim(dimensionString);
        var hie = dim.default_hierarchy;
        if (dimensionString.indexOf('@') > 0) {
            var hierarchyName = dimensionString.split('@')[1].split(':')[0];
            hie = dim.hierarchies[hierarchyName];
        }
        var lev;
        var levelIndex = 0;
        if (dimensionString.indexOf(':') > 0) {
            var levelname = dimensionString.split(':')[1];
            lev = dim.level(levelname);
            for (levelIndex = 0; levelIndex < hie.levels.length && hie.levels[levelIndex] !== lev; levelIndex++)
                ;
        }
        else {
            lev = hie.levels[0];
        }
        var depth = null;
        for (var i = 0; i < hie.levels.length; i++) {
            if (lev.name === hie.levels[i].name) {
                depth = i + 1;
                break;
            }
        }
        return {
            dimension: dim,
            level: lev,
            levelIndex: levelIndex,
            depth: depth,
            hierarchy: hie,
            label: dim.label + (hie.name !== 'default' ? (' - ' + hie.label) : '') + (hie.levels.length > 1 ? (' / ' + lev.label) : ''),
            labelShort: (dim.label + (hie.levels.length > 1 ? (' / ' + lev.label) : '')),
            labelNoLevel: dim.label + (hie.name !== 'default' ? (' - ' + hie.label) : ''),
            fullDrilldownValue: dim.name + (hie.name !== 'default' ? ('@' + hie.name) : '') + ':' + lev.name,
            drilldownDimension: dim.name + '@' + hie.name + ':' + lev.name,
            drilldownDimensionPlus: (hie.levels.length > 1 && levelIndex < hie.levels.length - 1) ? (dim.name + '@' + hie.name + ':' + hie.levels[levelIndex + 1].name) : null,
            drilldownDimensionMinus: (hie.levels.length > 1 && levelIndex > 0) ? (dim.name + '@' + hie.name + ':' + hie.levels[levelIndex - 1].name) : null,
            cutDimension: dim.name + (hie.name !== 'default' ? '@' + hie.name : '')
        };
    };
    Cube.prototype.dimensionPartsFromCut = function (cut) {
        var parts = this.dimensionParts(cut.dimension);
        if (!parts)
            return null;
        var depth = (cut.value.split(';')[0].match(/,/g) || []).length + 1;
        var dimstring = parts.dimension.name + '@' + parts.hierarchy.name + ':' + parts.hierarchy.levels[depth - 1].name;
        return this.dimensionParts(dimstring);
    };
    Cube.prototype.measureAggregates = function (measureName) {
        return this.aggregates.filter(function (ia) { return measureName ? ia.measure === measureName : !ia.measure; });
    };
    Cube.prototype.aggregateFromName = function (aggregateName) {
        return utils_1.find(this.aggregates, function (ia) { return aggregateName ? ia.name === aggregateName : !ia.measure; });
    };
    Object.defineProperty(Cube.prototype, "dateDimensions", {
        get: function () {
            return this.dimensions.filter(function (d) { return d.isDateDimension; });
        },
        enumerable: true,
        configurable: true
    });
    return Cube;
}());
exports.Cube = Cube;
