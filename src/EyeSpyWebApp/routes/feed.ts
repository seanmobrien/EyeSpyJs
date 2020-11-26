/*
 * POST image feed.
 */

import * as express from 'express';
import * as debugFactory from 'debug';

const debug = debugFactory('feed');

import * as msVis from '../ms-vision/';
import * as feedManager from '../feed-manager';

const router = express.Router();

type ServiceCallback = (request: msVis.ICognitiveRequest) => Promise<any>;


function passThroughService(req: express.Request, res: express.Response, callService: ServiceCallback) {
    const files = req['files'];

    if (!files || Object.keys(files).length === 0) {
        res.json(<any>{
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
          return callService({ data: frame.data as Uint8Array })
                // Process fail by default
                .catch((err) => {
                    debug('An unexpected failure occurred while processing a pass-through service request.', err);
                    res.status(err.statusCode).send(err);
                });
        }
    }
}

router.get('/', (req: any, res: express.Response) => {
  res.send(<any>'Feed server is active');
});


router.post('/frame', (req: any, res: express.Response) => {
    passThroughService(req, res, (r: msVis.ICognitiveRequest) => {
        return msVis.analyzeImage({
            data: r.data,
            visualFeatures: [
                msVis.VisualFeature.Categories,
                msVis.VisualFeature.Description,
                msVis.VisualFeature.Objects,
                msVis.VisualFeature.Faces
            ]
        });
    }).then((result) => {
        res.json(<any>{
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    }).catch((err) => {
        debug('error!', err);
    });
});

router.post('/queue', async (req: any, res: express.Response) => {
  const val = await feedManager.addFrame({ test: 'frame', data: 'here' });
  res.json({
    ok: true,
    value: val
  });
  
  /*
  passThroughService(req, res, msVis.detectObjects).then((result) => {
    res.json(<any>{
      status: true,
      message: 'Successfully scraped frame',
      data: result
    });
  });
  */
});



router.post('/detect', (req: any, res: express.Response) => {
    passThroughService(req, res, msVis.detectObjects).then((result) => {
        res.json(<any>{
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    });
});

router.post('/describe', (req: any, res: express.Response) => {
    passThroughService(req, res, (r: msVis.ICognitiveRequest) => {
    return msVis.describeImage({
      data: r.data,
      maxCandidates: 3
    });
  }).then((result) => {
      res.json(<any>{
      status: true,
      message: 'Successfully scraped frame',
      data: result
    });
  }).catch((err) => {
    debug('error!', err);
  });
});

router.post('/area-of-interest', (req: any, res: express.Response) => {
  passThroughService(req, res, msVis.areaOfInterest)
    .then((result) => {
        res.json(<any>{
        status: true,
        message: 'Successfully scraped frame',
        data: result
      });
  }).catch((err) => {
    debug('error!', err);
  });
});


router.post('/tag', (req: any, res: express.Response) => {
  passThroughService(req, res, msVis.tagImage).then((result) => {
    res.json(<any>{
      status: true,
      message: 'Successfully scraped frame',
      data: result
    });
  }).catch((err) => {
    debug('error!', err);
  });
});

router.get('/read/:id', (req: any, res: express.Response) => {

    msVis.getReadResult(req.params.id)
        .then((result) => {
            res.json(<any>{
                status: true,
                message: 'Successfully scraped frame',
                data: result
            });
        }).catch((err) => {
            debug('error!', err);
            res.send(<any>{
                status: false,
                message: 'Successfully uploaded image for further processing',
                data: err
            });
        });
});

router.post('/read', (req: any, res: express.Response) => {
    passThroughService(req, res, msVis.postReadResult).then((result) => {
        res.json(<any>{
            status: true,
            message: 'Successfully uploaded image for further processing',
            opId: result
        });
    }).catch((err) => {
        debug('error!', err);
    });
});






export default router;