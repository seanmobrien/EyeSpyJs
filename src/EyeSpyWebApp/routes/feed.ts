/*
 * POST image feed.
 */
import express = require('express');

import { analyzeImage, analyzeImageOptions } from '../ms-vision/';

const router = express.Router();

import secrets = require('../secrets.json');
import msVis = require('microsoft-computer-vision');


router.get('/', (req: express.Request, res: express.Response) => {
  res.send("Feed server is active");
});

router.post('/frame', (req: /*express.Request*/any, res: express.Response) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let frame = req.files.frame;
      
      analyzeImage({
        data: <number[]>frame.data,
        visualFeatures: ['Categories', 'Description', 'Color']
      }).then((result) => {
        res.send({
          status: true,
          message: "Successfully scraped frame",
          data: {
            name: frame.name,
            mimetype: frame.mimetype,
            size: frame.size,
            bigsby: result
          }
        });
      }).catch((err) => {
        res.status(500).send(err.message);
      }); ;

      /*
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      msVis.analyzeImage({
        "Ocp-Apim-Subscription-Key": secrets.msVision.key,
        "content-type": "application/octet-stream",
        "body": frame.data,
        "visual-features": "Tags, Faces",
        "request-origin": secrets.msVision.origin
      }).then((result) => {
        try {
          res.send({
            status: true,
            message: "Successfully scraped frame",
            data: {
              name: frame.name,
              mimetype: frame.mimetype,
              size: frame.size,
              bigsby: result
            }
          });
        } catch (err) {
          res.status(500).send(err.message);
        }        
      }).catch((err) => {
        res.status(500).send(err.message);
      });     
      */

    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});



export default router;