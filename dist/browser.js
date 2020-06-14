"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var cell_1 = require("./cell");
var Browser = /** @class */ (function () {
    function Browser(server, cube) {
        this.server = server;
        this.cube = cube;
    }
    Browser.prototype.full_cube = function () {
        return new cell_1.Cell(this.cube, []);
    };
    Browser.prototype.aggregate = function (args) {
        return this.server.query('aggregate', this.cube.name, utils_1.pick(args || {}, [
            'cut', 'measure', 'drilldown', 'split', 'order', 'page', 'pagesize'
        ]), {});
    };
    return Browser;
}());
exports.Browser = Browser;
