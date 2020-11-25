// External libraries
//import * as _ from 'lodash';
const _ = require('lodash');
//import * as _sa from 'superagent';
const _sa = require('superagent');
// Import/Export enums
import * as visEnums from './enums';
export * from './enums';
// Import/Export interfaces
import * as visTypes from './ifaces';
export * from './ifaces';
// Secrets
const secrets = require('../secrets.json');

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
async function callCognitiveApi(serviceUri: string, data: Uint8Array, reqParams: { [key: string]: string; } = { }) {
    const uri = makeVisionApi(serviceUri, reqParams);

    return await _sa.post(uri)
        .set(visEnums.HttpHeader.ContentType, visEnums.ContentType.OctetStream)
        .set(visEnums.HttpHeader.MsApiSubscription, secrets.msVision.key)
        .send(data);
}


/**
 * This operation extracts a rich set of visual features based on the image content.
 * @param {visTypes.IAnalyzeImageRequest} ops Image analyze options
 * @returns {visTypes.IAnalyzeImageResponseData} Structured data extracted from image.
 */
export async function analyzeImage(ops: visTypes.IAnalyzeImageRequest) {
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
        return resp.body as visTypes.IAnalyzeImageResponseData;
    } catch (err) {
        throw handleCognitiveFail('analyze-image', err);
    }
}

/**
 * This operation Performs object detection on the specified image.
 * @param {visTypes.ICognitiveRequest} request Image data.
 * @returns {visTypes.IDetectObjectsResponseData} Structured data extracted from image.
 */
export async function detectObjects(request: visTypes.ICognitiveRequest) {
    try {
        const resp = await callCognitiveApi('vision/v3.0/detect', request.data);
        return resp.body as visTypes.IDetectObjectsResponseData;
    } catch (err) {
        throw handleCognitiveFail('detectObjects', err);
    }
}

/**
 * This operation returns a bounding box around the most important area of the image.
 * @param {visTypes.ICognitiveRequest} request Image data.
 * @returns {visTypes.IAreaOfInterestResponseData} Structured data extracted from image.
 */
export async function areaOfInterest(request: visTypes.ICognitiveRequest) {
  try {
    const resp = await callCognitiveApi('vision/v3.0/areaOfInterest', request.data);
    return resp.body as visTypes.IAreaOfInterestResponseData;
  } catch (err) {
    throw handleCognitiveFail('areaOfInterest', err);
  }
}

/**
 * This operation generates a description of an image in human readable language with complete sentences. The description is based on a collection of content tags, which are also returned by the operation. More than one description can be generated for each image. Descriptions are ordered by their confidence score. All descriptions are in English
 * @param {visTypes.IDescribeImageRequest} ops Image analyze options
 * @returns {visTypes.IDescribeImageResponseData} Structured data extracted from image.
 */
export async function describeImage(ops: visTypes.IDescribeImageRequest) {
  try {
    const reqParams: { [key: string]: string; } = {};

    if (ops.maxCandidates && ops.maxCandidates > 0) {
      reqParams['maxCandidates'] = ops.maxCandidates.toString();
    }
    if (ops.language) {
      reqParams['language'] = ops.language.toString();
    }

    const resp = await callCognitiveApi('vision/v3.0/describe', ops.data, reqParams);
    return resp.body as visTypes.IDescribeImageResponseData;
  } catch (err) {
    throw handleCognitiveFail('analyze-image', err);
  }
}

/**
 * This operation extracts a rich set of visual features based on the image content.
 * @param {visTypes.IAnalyzeImageRequest} ops Image analyze options
 * @returns {visTypes.IAnalyzeImageResponseData} Structured data extracted from image.
 */
export async function tagImage(ops: visTypes.ITagImageRequest) {
  try {
    const reqParams: { [key: string]: string; } = {};

    if (ops.language) {
      reqParams['language'] = ops.language.toString();
    }
    const resp = await callCognitiveApi('vision/v3.0/tag', ops.data, reqParams);
    return resp.body as visTypes.ITagImageResponseData;
  } catch (err) {
    throw handleCognitiveFail('analyze-image', err);
  }
}
/**
 * This operation checks for the result of an earlier uploaded Read operation.
 * @param {string} operationId The operation id returned when the operation began.
 * @returns {visTypes.IReadResponseData} Structured data extracted from image.
 */
export async function getReadResult(operationId: string) {
    try {
        const resp = await _sa.get(makeVisionApi('vision/v3.0/read/analyzeResults/' + operationId))
            .set(visEnums.HttpHeader.MsApiSubscription, secrets.msVision.key);
        return resp.body as visTypes.IReadResponseData;
    } catch (err) {
        throw handleCognitiveFail('analyze-image', err);
    }
}
/**
 * This operation checks for the result of an earlier uploaded Read operation.
 * @param {visTypes.ITagImageRequest} ops The operation id returned when the operation began.
 * @returns {string} Structured data extracted from image.
 */
export async function postReadResult(ops: visTypes.ITagImageRequest) {
    try {
        const reqParams: { [key: string]: string; } = {};

        if (ops.language) {
            reqParams['language'] = ops.language.toString();
        }
        const resp = await callCognitiveApi('vision/v3.0/read/analyze', ops.data, reqParams);
        return resp.headers['apim-request-id'] as string;
    } catch (err) {
        throw handleCognitiveFail('analyze-image', err);
    }
}
