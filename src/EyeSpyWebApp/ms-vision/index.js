"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagImage = exports.describeImage = exports.areaOfInterest = exports.detectObjects = exports.analyzeImage = exports.Language = exports.AnalyzeDetail = exports.VisualFeature = void 0;
// Import enum definitions
const enums_1 = require("./enums");
Object.defineProperty(exports, "VisualFeature", { enumerable: true, get: function () { return enums_1.VisualFeature; } });
Object.defineProperty(exports, "AnalyzeDetail", { enumerable: true, get: function () { return enums_1.AnalyzeDetail; } });
Object.defineProperty(exports, "Language", { enumerable: true, get: function () { return enums_1.Language; } });
const debug = require('debug');
const _ = require('lodash');
const secrets = require('../secrets.json');
const _sa = require('superagent');
function makeVisionApi(api, args = null) {
    let params = '?';
    if (args) {
        for (let key in args) {
            if (Object.prototype.hasOwnProperty.call(args, key)) {
                const value = args[key];
                // TODO: We should be uri encoding these....
                params += (key + '=' + value);
            }
        }
    }
    if (params.length === 1) {
        params = '';
    }
    return secrets.msVision.endpoint + api + params;
}
/**
 * Transforms a cognitive service error into our return value.
 * @param method
 * @param {Error} err
 * @returns { { statusCode: number, message: string } } Error object containing failure details.
 */
function handleCognitiveFail(method, err) {
    const res = err['response'] || { statusCode: -1, message: 'Unsupported error object detected.', err: err };
    const ret = _.merge({ statusCode: res.statusCode }, res.body);
    if (!ret['message']) {
        ret['message'] = err.message;
    }
    return ret;
}
/**
 * Calls a MS cognitive service REST api
 * @param {string} serviceUri Relative uri to the target service.
 * @param {number[]} data Byte array containing image to process.
 * @param {{[key: string]: string;}} reqParams
 */
function callCognitiveApi(serviceUri, data, reqParams = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = makeVisionApi(serviceUri, reqParams);
        return yield _sa.post(uri)
            .set(enums_1.HttpHeader.ContentType, enums_1.ContentType.OctetStream)
            .set(enums_1.HttpHeader.MsApiSubscription, secrets.msVision.key)
            .send(data);
    });
}
/**
 * This operation extracts a rich set of visual features based on the image content.
 * @param {IAnalyzeImageRequest} ops Image analyze options
 * @returns {IAnalyzeImageResponseData} Structured data extracted from image.
 */
function analyzeImage(ops) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqParams = {};
            if (ops.visualFeatures && Object.keys(ops.visualFeatures).length) {
                reqParams['visualFeatures'] = _.join(ops.visualFeatures, ',');
            }
            if (ops.details && Object.keys(ops.details).length) {
                reqParams['details'] = _.join(ops.details, ',');
            }
            if (ops.language) {
                reqParams['language'] = ops.language.toString();
            }
            const resp = yield callCognitiveApi('vision/v3.1/analyze', ops.data, reqParams);
            return resp.body;
        }
        catch (err) {
            throw handleCognitiveFail('analyze-image', err);
        }
    });
}
exports.analyzeImage = analyzeImage;
/**
 * This operation Performs object detection on the specified image.
 * @param {ICongnitiveRequest} request Image data.
 * @returns {IDetectObjectsResponseData} Structured data extracted from image.
 */
function detectObjects(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield callCognitiveApi('vision/v3.0/detect', request.data);
            return resp.body;
        }
        catch (err) {
            throw handleCognitiveFail('detectObjects', err);
        }
    });
}
exports.detectObjects = detectObjects;
/**
 * This operation returns a bounding box around the most important area of the image.
 * @param {ICongnitiveRequest} request Image data.
 * @returns {IAreaOfInterestResponseData} Structured data extracted from image.
 */
function areaOfInterest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield callCognitiveApi('vision/v3.0/areaOfInterest', request.data);
            return resp.body;
        }
        catch (err) {
            throw handleCognitiveFail('areaOfInterest', err);
        }
    });
}
exports.areaOfInterest = areaOfInterest;
/**
 * This operation generates a description of an image in human readable language with complete sentences. The description is based on a collection of content tags, which are also returned by the operation. More than one description can be generated for each image. Descriptions are ordered by their confidence score. All descriptions are in English
 * @param {IDescribeImageRequest} ops Image analyze options
 * @returns {IDescribeImageResponseData} Structured data extracted from image.
 */
function describeImage(ops) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqParams = {};
            if (ops.maxCandidates && ops.maxCandidates > 0) {
                reqParams['maxCandidates'] = ops.maxCandidates.toString();
            }
            if (ops.language) {
                reqParams['language'] = ops.language.toString();
            }
            const resp = yield callCognitiveApi('vision/v3.0/describe', ops.data, reqParams);
            return resp.body;
        }
        catch (err) {
            throw handleCognitiveFail('analyze-image', err);
        }
    });
}
exports.describeImage = describeImage;
/**
 * This operation extracts a rich set of visual features based on the image content.
 * @param {IAnalyzeImageRequest} ops Image analyze options
 * @returns {IAnalyzeImageResponseData} Structured data extracted from image.
 */
function tagImage(ops) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqParams = {};
            if (ops.language) {
                reqParams['language'] = ops.language.toString();
            }
            const resp = yield callCognitiveApi('vision/v3.0/tag', ops.data, reqParams);
            return resp.body;
        }
        catch (err) {
            throw handleCognitiveFail('analyze-image', err);
        }
    });
}
exports.tagImage = tagImage;
//# sourceMappingURL=index.js.map