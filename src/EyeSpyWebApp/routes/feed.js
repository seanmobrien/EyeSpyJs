"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * POST image feed.
 */
const express = require("express");
const debug = require("debug");
const ms_vision_1 = require("../ms-vision/");
const router = express.Router();
function passThroughService(req, res, callService) {
    const files = req['files'];
    if (!files || Object.keys(files).length === 0) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
        return Promise.reject();
    }
    else {
        var keys = Object.keys(files);
        if (keys.length === 0) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
            return Promise.reject();
        }
        else {
            // Extract the first uploaded file 
            const frame = files[keys[0]];
            // Pass to callService callback
            return callService(frame.data)
                // Process fail by default
                .catch((err) => { res.status(err.statusCode).send(err); });
        }
    }
}
router.get('/', (req, res) => {
    res.send('Feed server is active');
});
router.post('/frame', (req, res) => {
    passThroughService(req, res, (data) => {
        return ms_vision_1.analyzeImage({
            data: data,
            visualFeatures: [
                ms_vision_1.VisualFeature.Categories,
                ms_vision_1.VisualFeature.Description,
                ms_vision_1.VisualFeature.Objects,
                ms_vision_1.VisualFeature.Faces
            ]
        });
    }).then((result) => {
        res.send({
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    }).catch((err) => {
        debug("error!" + err);
    });
});
router.post('/detect', (req, res) => {
    passThroughService(req, res, (data) => ms_vision_1.detectObjects(data)).then((result) => {
        res.send({
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    });
});
exports.default = router;
//# sourceMappingURL=feed.js.map