"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cell_1 = require("./cell");
var AggregateResult = /** @class */ (function () {
    function AggregateResult(cube, props) {
        this.cell = new cell_1.Cell(cube, props.cell);
        this.summary = props.summary;
        this.cells = props.cells;
        this.total_cell_count = props.total_cell_count;
        this.aggregates = props.aggregates;
        this.levels = props.levels;
        this.attributes = props.attributes;
        this.has_split = props.has_split;
    }
    return AggregateResult;
}());
exports.AggregateResult = AggregateResult;
