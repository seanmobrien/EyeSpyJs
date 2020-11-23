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
exports.analyzeImage = void 0;
const debug = require("debug");
const secrets = require("../secrets.json");
const superagent = require('superagent');
function makeVisionApi(api, args = null) {
    let params = '?';
    if (args) {
        for (let key in args) {
            let value = args[key];
            // TODO: We should be uri encoding these....
            params += (key + "=" + value);
        }
    }
    if (params.length === 1) {
        params = "";
    }
    return secrets.msVision.endpoint + api + params;
}
function analyzeImage(ops) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var reqParams = {};
            if (ops.visualFeatures && ops.visualFeatures.length) {
                let f = "";
                for (let i = 0; i < ops.visualFeatures.length; i++) {
                    f += (ops.visualFeatures[i] + ",");
                }
                reqParams.visualFeatures = f.substr(0, f.length - 1);
            }
            const uri = makeVisionApi("vision/v3.1/analyze", reqParams);
            debug('about to post uploaded image to ' + uri);
            const resp = yield superagent.post(uri)
                .set("Content-Type", "application/octet-stream")
                .set("Ocp-Apim-Subscription-Key", secrets.msVision.key)
                .send(ops.data);
            /*
            const resp = await tiny.post({
              url: makeVisionApi("vision/v3.1/analyze", reqParams),
              headers: {
                "Ocp-Apim-Subscription-Key": secrets.msVision.key,
                "ContentType", "application/octet-stream"
              }
            });
            */
            return resp.body;
        }
        catch (err) {
            console.log('ruh roh!', err);
            throw err;
        }
    });
}
exports.analyzeImage = analyzeImage;
//# sourceMappingURL=index.js.map