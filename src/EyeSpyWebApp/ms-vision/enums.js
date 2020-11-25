"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReadResultStatus = exports.LineDrawingType = exports.ClipartType = exports.AnalyzeDetail = exports.Language = exports.VisualFeature = exports.ContentType = exports.HttpHeader = void 0;
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
    /** Adult Content Detection */
    VisualFeature["Adult"] = "Adult";
    /** Brand Detection */
    VisualFeature["Brands"] = "Brands";
    /** Categorization */
    VisualFeature["Categories"] = "Categories";
    /** Color classification */
    VisualFeature["Color"] = "Color";
    /** Image Description */
    VisualFeature["Description"] = "Description";
    /** Face detection  */
    VisualFeature["Faces"] = "Faces";
    /** Image Type Detection  */
    VisualFeature["ImageType"] = "ImageType";
    /** Object Detection  */
    VisualFeature["Objects"] = "Objects";
    /** Image tagging  */
    VisualFeature["Tags"] = "Tags";
})(VisualFeature = exports.VisualFeature || (exports.VisualFeature = {}));
/**
 * Available Languages
 * @enum {string}
 */
var Language;
(function (Language) {
    /** English */
    Language["English"] = "en";
    /** Spanish */
    Language["Spanish"] = "es";
    /** Japanese */
    Language["Japanese"] = "ja";
    /** Portuguese */
    Language["Portuguese"] = "pt";
    /** SimplifiedChinese */
    Language["SimplifiedChinese"] = "zh";
})(Language = exports.Language || (exports.Language = {}));
/**
 * Analyze Details
 * @enum {string}
 */
var AnalyzeDetail;
(function (AnalyzeDetail) {
    /** Celebrity  */
    AnalyzeDetail["Celebrities"] = "Celebrities";
    /** Landmark */
    AnalyzeDetail["Landmarks"] = "Landmarks";
})(AnalyzeDetail = exports.AnalyzeDetail || (exports.AnalyzeDetail = {}));
/**
 * Type of clip art
 * @enum {number}
 */
var ClipartType;
(function (ClipartType) {
    /** Not clip art */
    ClipartType[ClipartType["NonClipart"] = 0] = "NonClipart";
    /** Unable to determine */
    ClipartType[ClipartType["Ambiguous"] = 1] = "Ambiguous";
    /** Passable as clip art */
    ClipartType[ClipartType["Normal"] = 2] = "Normal";
    /** High-quality clip art */
    ClipartType[ClipartType["Good"] = 3] = "Good";
})(ClipartType = exports.ClipartType || (exports.ClipartType = {}));
/**
 * Type of line drawing
 * @enum {number}
 */
var LineDrawingType;
(function (LineDrawingType) {
    /** Image is not a line drawing */
    LineDrawingType[LineDrawingType["NonLineDrawing"] = 0] = "NonLineDrawing";
    /** Image is a line drawing */
    LineDrawingType[LineDrawingType["LineDrawing"] = 1] = "LineDrawing";
})(LineDrawingType = exports.LineDrawingType || (exports.LineDrawingType = {}));
/**
 * Status of a Read operation
 * @enum {number}
 */
var GetReadResultStatus;
(function (GetReadResultStatus) {
    GetReadResultStatus["NotStarted"] = "notStarted";
    GetReadResultStatus["Running"] = "running";
    GetReadResultStatus["Failed"] = "failed";
    GetReadResultStatus["Succeeded"] = "succeeded";
})(GetReadResultStatus = exports.GetReadResultStatus || (exports.GetReadResultStatus = {}));
//# sourceMappingURL=enums.js.map