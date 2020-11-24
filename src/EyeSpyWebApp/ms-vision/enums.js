"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineDrawingType = exports.ClipartType = exports.AnalyzeDetail = exports.Language = exports.VisualFeature = exports.ContentType = exports.HttpHeader = void 0;
/**
 * Available visual features for analysis
 * @enum {string}
 */
var HttpHeader;
(function (HttpHeader) {
    HttpHeader["ContentType"] = "Content-Type";
    HttpHeader["MsApiSubscription"] = "Ocp-Apim-Subscription-Key";
})(HttpHeader = exports.HttpHeader || (exports.HttpHeader = {}));
/**
 * Available request content types
 * @enum {string}
 */
var ContentType;
(function (ContentType) {
    ContentType["OctetStream"] = "application/octet-stream";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
/**
 * Available visual features for analysis
 * @enum {string}
 */
var VisualFeature;
(function (VisualFeature) {
    /** @var */
    VisualFeature["Adult"] = "Adult";
    VisualFeature["Brands"] = "Brands";
    VisualFeature["Categories"] = "Categories";
    VisualFeature["Color"] = "Color";
    VisualFeature["Description"] = "Description";
    VisualFeature["Faces"] = "Faces";
    VisualFeature["ImageType"] = "ImageType";
    VisualFeature["Objects"] = "Objects";
    VisualFeature["Tags"] = "Tags";
})(VisualFeature = exports.VisualFeature || (exports.VisualFeature = {}));
/**
 * Available Languages
 * @enum {string}
 */
var Language;
(function (Language) {
    Language["English"] = "en";
    Language["Spanish"] = "es";
    Language["Japanese"] = "ja";
    Language["Portuguese"] = "pt";
    Language["SimplifiedChinese"] = "zh";
})(Language = exports.Language || (exports.Language = {}));
/**
 * Analyze Details
 * @enum {string}
 */
var AnalyzeDetail;
(function (AnalyzeDetail) {
    AnalyzeDetail["Celebrities"] = "Celebrities";
    AnalyzeDetail["Landmarks"] = "Landmarks";
})(AnalyzeDetail = exports.AnalyzeDetail || (exports.AnalyzeDetail = {}));
/**
 * Type of clip art
 * @enum {number}
 */
var ClipartType;
(function (ClipartType) {
    ClipartType[ClipartType["NonClipart"] = 0] = "NonClipart";
    ClipartType[ClipartType["Ambiguous"] = 1] = "Ambiguous";
    ClipartType[ClipartType["Normal"] = 2] = "Normal";
    ClipartType[ClipartType["Good"] = 3] = "Good";
})(ClipartType = exports.ClipartType || (exports.ClipartType = {}));
/**
 * Type of line drawing
 * @enum {number}
 */
var LineDrawingType;
(function (LineDrawingType) {
    LineDrawingType[LineDrawingType["NonLineDrawing"] = 0] = "NonLineDrawing";
    LineDrawingType[LineDrawingType["LineDrawing"] = 1] = "LineDrawing";
})(LineDrawingType = exports.LineDrawingType || (exports.LineDrawingType = {}));
//# sourceMappingURL=enums.js.map