"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var cuts_1 = require("./cuts");
var Cell = /** @class */ (function () {
    function Cell(cube, cuts) {
        this.cube = cube;
        this.cuts = cuts.map(function (prop) { return cuts_1.cut_from_aggregate_result(cube, prop); });
    }
    Cell.prototype.slice = function (new_cut) {
        var cuts = [];
        var new_cut_pushed = false;
        for (var _i = 0, _a = this.cuts; _i < _a.length; _i++) {
            var cut = _a[_i];
            if (cut.dimension === new_cut.dimension) {
                cuts.push(new_cut.toCellProps());
                new_cut_pushed = true;
            }
            else {
                cuts.push(cut.toCellProps());
            }
        }
        if (!new_cut_pushed) {
            cuts.push(new_cut.toCellProps());
        }
        return new Cell(this.cube, cuts);
    };
    Cell.prototype.cut_for_dimension = function (name) {
        return utils_1.find(this.cuts, function (cut) { return cut.dimension.name === name; });
    };
    Cell.prototype.toString = function () {
        return (this.cuts || []).map(function (cut) { return cut.toString(); })
            .join(cuts_1.CUT_STRING_SEPARATOR_CHAR);
    };
    return Cell;
}());
exports.Cell = Cell;
function cell_from_string(cube, cut_param_value) {
    return new Cell(cube, cuts_1.cuts_from_string(cube, cut_param_value).map(function (cut) { return cut.toCellProps(); }));
}
exports.cell_from_string = cell_from_string;
