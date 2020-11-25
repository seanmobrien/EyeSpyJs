"use strict";
/*
 * POST image feed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const debugFactory = require("debug");
const debug = debugFactory('feed');
const msVis = require("../ms-vision/");
const router = express.Router();
function passThroughService(req, res, callService) {
    const files = req['files'];
    if (!files || Object.keys(files).length === 0) {
        res.json({
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
            return callService({ data: frame.data })
                // Process fail by default
                .catch((err) => {
                debug('An unexpected failure occurred while processing a pass-through service request.', err);
                res.status(err.statusCode).send(err);
            });
        }
    }
}
router.get('/', (req, res) => {
    res.send('Feed server is active');
});
router.post('/frame', (req, res) => {
    passThroughService(req, res, (r) => {
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
        res.json({
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    }).catch((err) => {
        debug('error!', err);
    });
});
router.post('/detect', (req, res) => {
    passThroughService(req, res, msVis.detectObjects).then((result) => {
        res.json({
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    });
});
router.post('/describe', (req, res) => {
    passThroughService(req, res, (r) => {
        return msVis.describeImage({
            data: r.data,
            maxCandidates: 3
        });
    }).then((result) => {
        res.json({
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    }).catch((err) => {
        debug('error!', err);
    });
});
router.post('/area-of-interest', (req, res) => {
    passThroughService(req, res, msVis.areaOfInterest)
        .then((result) => {
        res.json({
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    }).catch((err) => {
        debug('error!', err);
    });
});
router.post('/tag', (req, res) => {
    passThroughService(req, res, msVis.tagImage).then((result) => {
        res.json({
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    }).catch((err) => {
        debug('error!', err);
    });
});
router.get('/read/:id', (req, res) => {
    msVis.getReadResult(req.params.id)
        .then((result) => {
        res.json({
            status: true,
            message: 'Successfully scraped frame',
            data: result
        });
    }).catch((err) => {
        debug('error!', err);
        res.send({
            status: false,
            message: 'Successfully uploaded image for further processing',
            data: err
        });
    });
});
router.post('/read', (req, res) => {
    passThroughService(req, res, msVis.postReadResult).then((result) => {
        res.json({
            status: true,
            message: 'Successfully uploaded image for further processing',
            opId: result
        });
    }).catch((err) => {
        debug('error!', err);
    });
});
exports.default = router;
//# sourceMappingURL=feed.js.map