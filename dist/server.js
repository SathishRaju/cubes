"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cube_1 = require("./cube");
var query_serializer_1 = require("./query-serializer");
function getJSON(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(function (reason) { throw reason; })
        .then(function (response) { return response.json(); });
}
var Server = /** @class */ (function () {
    function Server(baseUrl) {
        this.baseUrl = baseUrl;
        this._cube_list = [];
        this._cubes = {};
    }
    Server.prototype.query = function (query, cube_name, args, options) {
        var query_args = query_serializer_1.default(args);
        var url = this.baseUrl + "cube/" + cube_name + "/" + query;
        if (query_args.length > 0)
            url += '?' + query_args;
        return getJSON(url);
    };
    Server.prototype.connect = function () {
        var _this = this;
        var cubeInfoPromise = getJSON(this.baseUrl + '/info');
        return cubeInfoPromise.then(function (info) {
            _this.server_version = info.cubes_version;
            _this.cubes_version = info.cubes_version;
            _this.api_version = info.api_version;
            _this.info = info;
            return _this.load_cube_list();
        }, function (err) { throw err; });
    };
    Server.prototype.load_cube_list = function () {
        var _this = this;
        var cubesListPromise = getJSON(this.baseUrl + '/cubes');
        return cubesListPromise.then(function (cubes_list) {
            _this._cube_list = cubes_list;
            return cubes_list;
        }, function (err) { throw err; });
    };
    Server.prototype.get_cube = function (name) {
        var _this = this;
        if (name in this._cubes)
            return Promise.resolve(this._cubes[name]);
        var cubePromise = getJSON(this.baseUrl + '/cube/' + encodeURI(name) + '/model');
        return cubePromise.then(function (cube_props) {
            _this._cubes[name] = new cube_1.Cube(cube_props);
            return _this._cubes[name];
        }, function (err) { throw err; });
    };
    return Server;
}());
exports.Server = Server;
