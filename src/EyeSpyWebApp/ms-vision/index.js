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
exports.analyzeImage = exports.Language = exports.AnalyzeDetail = exports.VisualFeature = void 0;
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
 *
 * @param {IAnalyzeImageOptions} ops Image analyze options
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
            const uri = makeVisionApi('vision/v3.1/analyze', reqParams);
            debug('about to post uploaded image to ' + uri);
            const resp = yield _sa.post(uri)
                .set(enums_1.HttpHeader.ContentType, enums_1.ContentType.OctetStream)
                .set(enums_1.HttpHeader.MsApiSubscription, secrets.msVision.key)
                .send(ops.data);
            return resp.body;
        }
        catch (err) {
            debug('ruh roh!', err);
            throw err;
        }
    });
}
exports.analyzeImage = analyzeImage;
//# sourceMappingURL=index.js.map