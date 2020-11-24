"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * POST image feed.
 */
const express = require("express");
const ms_vision_1 = require("../ms-vision/");
const router = express.Router();
// import msVis = require('microsoft-computer-vision');
router.get('/', (req, res) => {
    res.send('Feed server is active');
});
router.post('/frame', (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        }
        else {
            var keys = Object.keys(req.files);
            if (keys.length === 0) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            }
            else {
                // Extract the first uploaded file regardless of its name
                let frame = req.files[keys[0]];
                ms_vision_1.analyzeImage({
                    data: frame.data,
                    visualFeatures: [
                        ms_vision_1.VisualFeature.Categories,
                        ms_vision_1.VisualFeature.Description,
                        ms_vision_1.VisualFeature.Objects,
                        ms_vision_1.VisualFeature.Faces
                    ]
                }).then((result) => {
                    res.send({
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
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
exports.default = router;
//# sourceMappingURL=feed.js.map