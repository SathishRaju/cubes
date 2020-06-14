"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var commons_1 = require("./commons");
var DIMENSION_STRING_SEPARATOR_CHAR = ':';
var Level = /** @class */ (function () {
    function Level(dimension_name, props) {
        this.dimension_name = dimension_name;
        this.name = props.name;
        !props.label || (this.label = props.label);
        !props.description || (this.description = props.description);
        !props.info || (this.info = props.info);
        this._key = props.key;
        this._label_attribute = props.label_attribute;
        this._order_attribute = props.order_attribute;
        !props.role || (this.role = props.role);
        !props.cardinality || (this.cardinality = props.cardinality);
        this.nonadditive = props.nonadditive;
        this.attributes = [];
        if (props.attributes) {
            this.attributes = props.attributes.map(function (attr) { return new commons_1.Attribute(attr); });
        }
    }
    Object.defineProperty(Level.prototype, "key", {
        get: function () {
            var _this = this;
            return utils_1.find(this.attributes, function (attr) { return attr.name === _this._key; }) || this.attributes[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Level.prototype, "label_attribute", {
        get: function () {
            var _this = this;
            // Label attribute is either explicitly specified or it is second attribute if there are more
            // than one, otherwise it is first
            var the_attr = null;
            if (this._label_attribute) {
                the_attr = utils_1.find(this.attributes, function (attr) { return attr.name === _this._label_attribute; });
            }
            return the_attr || this.key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Level.prototype, "order_attribute", {
        get: function () {
            var _this = this;
            var the_attr = null;
            if (this._order_attribute) {
                the_attr = utils_1.find(this.attributes, function (attr) { return attr.name === _this._order_attribute; });
            }
            return the_attr || this.key;
        },
        enumerable: true,
        configurable: true
    });
    Level.prototype.toString = function () {
        return this.name;
    };
    Level.prototype.readCell = function (cell) {
        if (!(this.key.ref in cell))
            return null;
        var result = {
            key: cell[this.key.ref],
            label: cell[this.label_attribute.ref],
            orderValue: cell[this.order_attribute.ref],
            info: {}
        };
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attribute = _a[_i];
            result.info[attribute.ref] = cell[attribute.ref];
        }
        return result;
    };
    Object.defineProperty(Level.prototype, "display_name", {
        get: function () {
            return this.label || this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Level.prototype, "full_name", {
        get: function () {
            return this.dimension_name + commons_1.ATTRIBUTE_STRING_SEPARATOR_CHAR + this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Level.prototype, "full_name_for_drilldown", {
        get: function () {
            return this.dimension_name + DIMENSION_STRING_SEPARATOR_CHAR + this.name;
        },
        enumerable: true,
        configurable: true
    });
    return Level;
}());
exports.Level = Level;
