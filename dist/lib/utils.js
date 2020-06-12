"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncApplyFnTo = exports.applyFnTo = exports.isPojo = exports.get = void 0;
var tslib_1 = require("tslib");
/**
 * Get around TS error
 */
exports.get = function (obj, key) {
    return obj.hasOwnProperty(key) ? obj[key] : undefined;
};
/**
 * Checks if input is a plain old JavaScript object (POJO).
 */
exports.isPojo = function (obj) {
    if (obj === null || typeof obj !== "object") {
        return false;
    }
    return Object.getPrototypeOf(obj) === Object.prototype;
};
/**
 * Applies a function to the input.
 *
 * If the input is an array or a POJO (plain old JavaScript object) then
 * it will apply the function to its child values/properties, going as
 * deep until it hits a primitive non-object type.
 */
exports.applyFnTo = function (input, fn) {
    var props = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        props[_i - 2] = arguments[_i];
    }
    if (input instanceof Array) {
        return input.map(function (i) { return exports.applyFnTo.apply(void 0, tslib_1.__spreadArrays([i, fn], props)); });
    }
    else if (exports.isPojo(input)) {
        var output_1 = {};
        Object.entries(input).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            output_1[key] = exports.applyFnTo.apply(void 0, tslib_1.__spreadArrays([value, fn], props));
        });
        return output_1;
    }
    else {
        return fn.apply(void 0, tslib_1.__spreadArrays([input], props));
    }
};
/**
 * Same as applyFnTo, but handles asynchronise functions and returns as promises.
 */
exports.asyncApplyFnTo = function (input, fn) {
    var props = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        props[_i - 2] = arguments[_i];
    }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var output_2, awaitAll;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(input instanceof Array)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all(input.map(function (i) { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, exports.asyncApplyFnTo.apply(void 0, tslib_1.__spreadArrays([i, fn], props))];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!exports.isPojo(input)) return [3 /*break*/, 4];
                    output_2 = {};
                    awaitAll = Object.entries(input).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, exports.asyncApplyFnTo.apply(void 0, tslib_1.__spreadArrays([value, fn], props)).then(function (o) {
                                            output_2[key] = o;
                                        })];
                                    case 1: return [2 /*return*/, _b.sent()];
                                }
                            });
                        });
                    });
                    return [4 /*yield*/, Promise.all(awaitAll)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, output_2];
                case 4: return [4 /*yield*/, fn.apply(void 0, tslib_1.__spreadArrays([input], props))];
                case 5: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
//# sourceMappingURL=utils.js.map