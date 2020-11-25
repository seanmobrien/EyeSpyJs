/*
 * POST image feed.
 */
import express = require('express');
import debug = require('debug');

import { analyzeImage, detectObjects, VisualFeature, ICongnitiveRequest, describeImage, areaOfInterest, tagImage } from '../ms-vision/';

const router = express.Router();

import secrets = require('../secrets.json');


type ServiceCallback = (request: ICongnitiveRequest) => Promise<any>;


function passThroughService(req: express.Request, res: express.Response, callService: ServiceCallback) {
    const files = req['files'];
    if (!files || Object.keys(files).length === 0) {
        res.send(<any>{
            status: false,
            message: 'No file uploaded'
        });
        return Promise.reject();
    } else {
        var keys = Object.keys(files);
        if (keys.length === 0) {
            res.send(<any>{
                status: false,
                message: 'No file uploaded'
            });
            return Promise.reject();
        } else {
            // Extract the first uploaded file 
          const frame = files[keys[0]];          
            // Pass to callService callback
          return callService({ data: frame.data as number[] })
                // Process fail by default
                .catch((err) => { res.status(err.statusCode).send(err); });
        }
    }
}

router.get('/', (req: any, res: express.Response) => {
  res.send(<string>'Feed server is active');
});


router.post('/frame', (req: any, res: express.Response) => {
  passThroughService(req, res, (r: ICongnitiveRequest) => {
        return analyzeImage({
            data: r.data,
            visualFeatures: [
                VisualFeature.Categories,
                VisualFeature.Description,
                VisualFeature.Objects,
                VisualFeature.Faces
            ]
        });
    }).then((result) => {
        res.send(<any>{
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    }).catch((err) => {
        debug("error!" + err);
    });
});

router.post('/detect', (req: any, res: express.Response) => {
  passThroughService(req, res, detectObjects).then((result) => {
        res.send(<any>{
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    });
});

router.post('/describe', (req: any, res: express.Response) => {
  passThroughService(req, res, (r: ICongnitiveRequest) => {
    return describeImage({
      data: r.data,
      maxCandidates: 3
    });
  }).then((result) => {
    res.send(<any>{
      status: true,
      message: 'Successfully scraped frame',
      data: result
    });
  }).catch((err) => {
    debug("error!" + err);
  });
});

router.post('/area-of-interest', (req: any, res: express.Response) => {
  passThroughService(req, res, areaOfInterest)
    .then((result) => {
      res.send(<any>{
        status: true,
        message: 'Successfully scraped frame',
        data: result
      });
  }).catch((err) => {
    debug("error!" + err);
  });
});


router.post('/tag', (req: any, res: express.Response) => {
  passThroughService(req, res, tagImage).then((result) => {
    res.send(<any>{
      status: true,
      message: 'Successfully scraped frame',
      data: result
    });
  }).catch((err) => {
    debug("error!" + err);
  });
});



export default router;