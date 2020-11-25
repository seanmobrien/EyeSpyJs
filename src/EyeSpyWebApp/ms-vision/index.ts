// Import enum definitions

import { VisualFeature, AnalyzeDetail, Language, HttpHeader, ContentType } from './enums';
// re-export enums needed to call apis
export { VisualFeature, AnalyzeDetail, Language };
// Import interface definitions
import { IDetectObjectsResponseData, ICongnitiveRequest, IAnalyzeImageRequest, IAnalyzeImageResponseData, IDescribeImageRequest, IDescribeImageResponseData, IAreaOfInterestResponseData, ITagImageRequest, ITagImageResponseData } from './ifaces';
// re-export enums needed to call apis
export { ICongnitiveRequest, IDetectObjectsResponseData, IAnalyzeImageRequest, IAnalyzeImageResponseData, IDescribeImageRequest, IDescribeImageResponseData, IAreaOfInterestResponseData, ITagImageRequest, ITagImageResponseData };

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
 * This operation extracts a rich set of visual features based on the image content.
 * @param {IAnalyzeImageRequest} ops Image analyze options
 * @returns {IAnalyzeImageResponseData} Structured data extracted from image.
 */
export async function analyzeImage(ops: IAnalyzeImageRequest) {
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
        const resp = await callCognitiveApi('vision/v3.1/analyze', ops.data, reqParams);
        return resp.body as IAnalyzeImageResponseData;
    } catch (err) {
        throw handleCognitiveFail('analyze-image', err);
    }
}

/**
 * This operation Performs object detection on the specified image.
 * @param {ICongnitiveRequest} request Image data.
 * @returns {IDetectObjectsResponseData} Structured data extracted from image.
 */
export async function detectObjects(request: ICongnitiveRequest) {
    try {
      const resp = await callCognitiveApi('vision/v3.0/detect', request.data);
        return resp.body as IDetectObjectsResponseData;
    } catch (err) {
        throw handleCognitiveFail('detectObjects', err);
    }
}

/**
 * This operation returns a bounding box around the most important area of the image.
 * @param {ICongnitiveRequest} request Image data.
 * @returns {IAreaOfInterestResponseData} Structured data extracted from image.
 */
export async function areaOfInterest(request: ICongnitiveRequest) {
  try {
    const resp = await callCognitiveApi('vision/v3.0/areaOfInterest', request.data);
    return resp.body as IAreaOfInterestResponseData;
  } catch (err) {
    throw handleCognitiveFail('areaOfInterest', err);
  }
}

/**
 * This operation generates a description of an image in human readable language with complete sentences. The description is based on a collection of content tags, which are also returned by the operation. More than one description can be generated for each image. Descriptions are ordered by their confidence score. All descriptions are in English
 * @param {IDescribeImageRequest} ops Image analyze options
 * @returns {IDescribeImageResponseData} Structured data extracted from image.
 */
export async function describeImage(ops: IDescribeImageRequest) {
  try {
    const reqParams: { [key: string]: string; } = {};

    if (ops.maxCandidates && ops.maxCandidates > 0) {
      reqParams['maxCandidates'] = ops.maxCandidates.toString();
    }
    if (ops.language) {
      reqParams['language'] = ops.language.toString();
    }

    const resp = await callCognitiveApi('vision/v3.0/describe', ops.data, reqParams);

    return resp.body as IDescribeImageResponseData;
  } catch (err) {
    throw handleCognitiveFail('analyze-image', err);
  }
}

/**
 * This operation extracts a rich set of visual features based on the image content.
 * @param {IAnalyzeImageRequest} ops Image analyze options
 * @returns {IAnalyzeImageResponseData} Structured data extracted from image.
 */
export async function tagImage(ops: ITagImageRequest) {
  try {
    const reqParams: { [key: string]: string; } = {};

    if (ops.language) {
      reqParams['language'] = ops.language.toString();
    }
    const resp = await callCognitiveApi('vision/v3.0/tag', ops.data, reqParams);
    return resp.body as ITagImageResponseData;
  } catch (err) {
    throw handleCognitiveFail('analyze-image', err);
  }
}