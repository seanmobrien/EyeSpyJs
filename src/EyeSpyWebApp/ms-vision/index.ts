// Import enum definitions
import { VisualFeature, AnalyzeDetail, Language, HttpHeader, ContentType } from './enums';
// re-export enums needed to call apis
export { VisualFeature, AnalyzeDetail, Language };
// Import interface definitions
import { IAnalyzeImageResponseData, IDetectObjectsResponseData  } from './ifaces';
// re-export enums needed to call apis
export { IAnalyzeImageResponseData, IDetectObjectsResponseData };

const debug = require('debug');
const _ = require('lodash');
const secrets = require('../secrets.json');
const _sa = require('superagent');

function makeVisionApi(api: string, args: { [key: string]: string; } = null) {
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
function handleCognitiveFail(method: string, err: Error) {
    const res = err['response'] || { statusCode: -1, message: 'Unsupported error object detected.', err: err};
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
async function callCognitiveApi(serviceUri: string, data: number[], reqParams: { [key: string]: string; } = { }) {
    const uri = makeVisionApi(serviceUri, reqParams);

    return await _sa.post(uri)
        .set(HttpHeader.ContentType, ContentType.OctetStream)
        .set(HttpHeader.MsApiSubscription, secrets.msVision.key)
        .send(data);
}


/**
 * 
 * @param {IAnalyzeImageOptions} ops Image analyze options
 * @returns {IAnalyzeImageResponseData} Structured data extracted from image.
 */
export async function analyzeImage(ops: {
    /**
     * Image data
     * @var {number[]} 
     */
    data: number[];
    /**
     * Array of visual features to process.
     * @var {VisualFeatures[]} 
     */
    visualFeatures?: VisualFeature[];
    /**
     * Array of optional domain-specific details
     * @var {AnalyzeDetails[]}
     */
    details?: AnalyzeDetail[];
    /**
     * Array of optional domain-specific details
     * @var {AnalyzeDetails[]}
     */
    language?: Language;
}) {
    try {
        const reqParams: { [key: string]: string; } = {};
        
        if (ops.visualFeatures && Object.keys(ops.visualFeatures).length) {
            reqParams['visualFeatures'] = _.join(ops.visualFeatures, ',');
        }
        if (ops.details && Object.keys(ops.details).length) {
            reqParams['details'] = _.join(ops.details, ',');
        }
        if (ops.language) {
            reqParams['language'] = ops.language.toString();
        }
        /*
        const uri = makeVisionApi('vision/v3.1/analyze', reqParams);

        const resp = await _sa.post(uri)
            .set(HttpHeader.ContentType, ContentType.OctetStream)
            .set(HttpHeader.MsApiSubscription, secrets.msVision.key)
            .send(ops.data);
        */
        const resp = await callCognitiveApi('vision/v3.1/analyze', ops.data, reqParams);

        return resp.body as IAnalyzeImageResponseData;
    } catch (err) {
        throw handleCognitiveFail('analyze-image', err);
    }
}

/**
 * @function Detects objects within an image.
 * @param {number[]} data Array of bytes containing image binary data.
 * @returns {IDetectObjectsResponseData} Structured data extracted from image.
 */
export async function detectObjects(data: number[]) {
    try {
        const resp = await callCognitiveApi('vision/v3.0/detect', data);
        return resp.body as IDetectObjectsResponseData;
    } catch (err) {
        throw handleCognitiveFail('detectObjects', err);
    }
}
