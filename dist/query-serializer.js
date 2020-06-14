"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function encodeUriQuery(val, pctEncodeSpaces) {
    if (pctEncodeSpaces === void 0) { pctEncodeSpaces = false; }
    return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}
function forEachSorted(obj, iterator, context) {
    if (context === void 0) { context = undefined; }
    var keys = Object.keys(obj).sort();
    for (var i = 0; i < keys.length; i++) {
        iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
}
function serializeValue(v) {
    if (typeof v === 'object')
        return JSON.stringify(v);
    return v.toString();
}
function encodeKeyValue(key, value) {
    return encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(value));
}
function aggregateHttpSerializer(params) {
    if (!params)
        return '';
    var parts = [];
    forEachSorted(params, function (value, key) {
        if (value === null || typeof value === 'undefined')
            return;
        if (Array.isArray(value)) {
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var v = value_1[_i];
                parts.push(encodeKeyValue(key, v));
            }
        }
        else {
            parts.push(encodeKeyValue(key, value));
        }
    });
    return parts.join('&');
}
exports.default = aggregateHttpSerializer;
