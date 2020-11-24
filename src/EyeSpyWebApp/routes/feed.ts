/*
 * POST image feed.
 */
import express = require('express');

import { analyzeImage, VisualFeature } from '../ms-vision/';

const router = express.Router();

import secrets = require('../secrets.json');
// import msVis = require('microsoft-computer-vision');


router.get('/', (req: express.Request, res: express.Response) => {
  res.send(<string>'Feed server is active');
});

router.post('/frame', (req: /*express.Request*/any, res: express.Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.send(<any>{
        status: false,
        message: 'No file uploaded'
      });
    } else {
        var keys = Object.keys(req.files);
        if (keys.length === 0) {
            res.send(<any>{
                status: false,
                message: 'No file uploaded'
            });
        } else {
            // Extract the first uploaded file regardless of its name
            let frame = req.files[keys[0]];
            analyzeImage({
                data: <number[]>frame.data,
                visualFeatures: [
                    VisualFeature.Categories,
                    VisualFeature.Description,
                    VisualFeature.Objects,
                    VisualFeature.Faces
                ]
            }).then((result) => {
                res.send(<any>{
                    status: true,
                    message: 'Successfully scraped frame',
                    data: {
                        name: frame.name,
                        mimetype: frame.mimetype,
                        size: frame.size,
                        bigsby: result
                    }
                });
            }).catch((err) => {
                res.status(err.response.statusCode).send(err.response.body);
            }); 
        }
       
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});



export default router;