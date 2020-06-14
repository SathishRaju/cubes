"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ENonAdditivity;
(function (ENonAdditivity) {
    ENonAdditivity[ENonAdditivity["None"] = 0] = "None";
    ENonAdditivity[ENonAdditivity["Time"] = 1] = "Time";
    ENonAdditivity[ENonAdditivity["All"] = 2] = "All";
})(ENonAdditivity || (ENonAdditivity = {}));
var Measure = /** @class */ (function () {
    function Measure(props) {
        this.name = props.name;
        this.label = props.label;
        this.order = props.order;
        this.info = (props.info || {});
        this.description = props.description;
        this.format = props.format;
        this.missing_value = props.missing_value;
        switch (props.nonadditive) {
            case 'none':
                this.nonadditive = ENonAdditivity.None;
                break;
            case 'time':
                this.nonadditive = ENonAdditivity.Time;
                break;
            case 'all':
                this.nonadditive = ENonAdditivity.All;
                break;
        }
        this.expression = props.expression;
        if (props.aggregates) {
            this.aggregates = props.aggregates;
        }
    }
    return Measure;
}());
exports.Measure = Measure;
var MeasureAggregate = /** @class */ (function () {
    function MeasureAggregate(props) {
        this.name = props.name;
        this.ref = props.ref;
        this.label = props.label;
        this.order = props.order;
        this.info = (props.info || {});
        this.description = props.description;
        this.format = props.format;
        this.missing_value = props.missing_value;
        this.nonadditive = props.nonadditive;
        this.function = props.function;
        this.formula = props.formula;
        this.expression = props.expression;
        this.measure = props.measure;
    }
    return MeasureAggregate;
}());
exports.MeasureAggregate = MeasureAggregate;
var DetailAttribute = /** @class */ (function () {
    function DetailAttribute(props) {
        this.ref = props.ref;
        this.name = props.name;
        this.label = props.label;
        this.order = props.order;
        this.info = (props.info || {});
        this.description = props.description;
        this.format = props.format;
        this.missing_value = props.missing_value;
        this.locales = props.locales;
    }
    return DetailAttribute;
}());
exports.DetailAttribute = DetailAttribute;
exports.ATTRIBUTE_STRING_SEPARATOR_CHAR = '.';
var Attribute = /** @class */ (function () {
    function Attribute(props) {
        this.ref = props.ref;
        this.name = props.name;
        this.label = props.label;
        this.order = props.order;
        this.info = (props.info || {});
        this.description = props.description;
        this.format = props.format;
        this.missing_value = props.missing_value;
        this.locales = props.locales;
    }
    return Attribute;
}());
exports.Attribute = Attribute;
