"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var transliteration_1 = require("transliteration");
var pinyin_1 = tslib_1.__importDefault(require("pinyin"));
var kuroshiro_1 = tslib_1.__importDefault(require("kuroshiro"));
var kuroshiro_analyzer_kuromoji_1 = tslib_1.__importDefault(require("kuroshiro-analyzer-kuromoji"));
var change_case_1 = require("change-case");
var utils_1 = require("./utils");
var PinyinStyle = {
    normal: pinyin_1.default.STYLE_NORMAL,
    tone: pinyin_1.default.STYLE_TONE,
    tone2: pinyin_1.default.STYLE_TONE2,
    to3ne: pinyin_1.default.STYLE_TO3NE,
    initials: pinyin_1.default.STYLE_INITIALS,
    firstLetter: pinyin_1.default.STYLE_FIRST_LETTER,
};
var core = {
    initialized: false,
    kuroshiro: {},
    analyzer: {},
};
/**
 * Supported post processes
 */
var getPostProcess = function (name) {
    switch (name) {
        case "normal":
        case "normalize":
        case "normalise":
            return function (input) { return transliteration_1.transliterate(input); };
        case "upper":
        case "uppercase":
            return function (input) { return input.toUpperCase(); };
        case "lower":
        case "lowercase":
            return function (input) { return input.toLowerCase(); };
        case "title":
        case "titlecase":
        case "capital":
        case "capitalcase":
            return function (input) { return change_case_1.capitalCase(input); };
    }
};
var translitro = function (input, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, from, to, _b, mode, _c, romajiSystem, _d, postProcess, output, _e, style_1, zhTransliterate, _f, convertOptions_1, jaTransliterate, postProcesses;
    return tslib_1.__generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = tslib_1.__assign({}, options), from = _a.from, to = _a.to, _b = _a.mode, mode = _b === void 0 ? "spaced" : _b, _c = _a.romajiSystem, romajiSystem = _c === void 0 ? "passport" : _c, _d = _a.postProcess, postProcess = _d === void 0 ? [] : _d;
                output = input;
                _e = from;
                switch (_e) {
                    case "zh": return [3 /*break*/, 1];
                    case "ja": return [3 /*break*/, 2];
                }
                return [3 /*break*/, 6];
            case 1:
                style_1 = to && Object.keys(PinyinStyle).includes(to)
                    ? utils_1.get(PinyinStyle, to)
                    : PinyinStyle.normal;
                zhTransliterate = function (i) {
                    return pinyin_1.default(i, {
                        style: style_1,
                    })
                        // Collapse letters within words
                        .map(function (word) { return word.join(""); })
                        // Join words with spaces
                        .join(" ")
                        .trim();
                };
                output = utils_1.applyFnTo(input, zhTransliterate);
                return [3 /*break*/, 7];
            case 2:
                if (!!core.initialized) return [3 /*break*/, 4];
                core.kuroshiro = new kuroshiro_1.default();
                core.analyzer = new kuroshiro_analyzer_kuromoji_1.default();
                _f = core;
                return [4 /*yield*/, core.kuroshiro
                        .init(core.analyzer)
                        .then(function () { return true; })];
            case 3:
                _f.initialized = _g.sent();
                _g.label = 4;
            case 4:
                convertOptions_1 = {
                    to: to || "romaji",
                };
                switch (convertOptions_1.to) {
                    case "romaji":
                        convertOptions_1.mode = mode || "spaced";
                        convertOptions_1.romajiSystem = romajiSystem || "passport";
                        break;
                    case "hiragana":
                    case "katakana":
                        convertOptions_1.mode = "normal";
                        break;
                }
                jaTransliterate = function (i) { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, core.kuroshiro.convert(i, convertOptions_1)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); };
                return [4 /*yield*/, utils_1.asyncApplyFnTo(input, jaTransliterate)];
            case 5:
                output = _g.sent();
                return [3 /*break*/, 7];
            case 6:
                output = utils_1.applyFnTo(input, transliteration_1.transliterate);
                return [3 /*break*/, 7];
            case 7:
                postProcesses = (postProcess instanceof Array
                    ? postProcess
                    : [postProcess])
                    .map(function (p) { return (typeof p === "string" ? getPostProcess(p) : p); })
                    .filter(function (p) { return p instanceof Function; });
                if (postProcesses.length) {
                    postProcesses.forEach(function (p) {
                        if (p) {
                            output = utils_1.applyFnTo(output, p);
                        }
                    });
                }
                return [2 /*return*/, Promise.resolve(output)];
        }
    });
}); };
exports.default = translitro;
//# sourceMappingURL=translitro.js.map