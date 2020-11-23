import debug = require("debug");
import _ = require("lodash");
const secrets = require("../secrets.json");
const superagent = require('superagent');
import { Dictionary } from "express-serve-static-core";



function makeVisionApi(api: string, args: { [key: string]: string; } = null) {
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

export interface analyzeImageOptions {
  data: Array<number>,
  visualFeatures: Array<string>
}

export async function analyzeImage(ops: analyzeImageOptions) {
  try {
    var reqParams: { [key: string]: string; } = {};

    if (ops.visualFeatures && ops.visualFeatures.length) {
      let f = "";
      for (let i = 0; i < ops.visualFeatures.length; i++) {
        f += (ops.visualFeatures[i] + ",");
      }
      reqParams.visualFeatures = f.substr(0, f.length - 1);
    }

    const uri = makeVisionApi("vision/v3.1/analyze", reqParams);
    debug('about to post uploaded image to ' + uri);

    const resp = await superagent.post(uri)
      .set("Content-Type", "application/octet-stream")
      .set("Ocp-Apim-Subscription-Key", secrets.msVision.key)
      .send(ops.data);
   
    return resp.body;
  } catch (err) {
    console.log('ruh roh!', err)
    throw err;
  }
}

