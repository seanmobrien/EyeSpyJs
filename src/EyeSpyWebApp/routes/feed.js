"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * POST image feed.
 */
const express = require("express");
const ms_vision_1 = require("../ms-vision/");
const router = express.Router();
router.get('/', (req, res) => {
    res.send("Feed server is active");
});
router.post('/frame', (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        }
        else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let frame = req.files.frame;
            ms_vision_1.analyzeImage({
                data: frame.data,
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
            });
            ;
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
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
exports.default = router;
//# sourceMappingURL=feed.js.map