
import { VisualFeature, AnalyzeDetail, Language, HttpHeader, ContentType } from './enums';
// re-export enums needed to call apis
export { VisualFeature, AnalyzeDetail, Language };

const debug = require('debug');
const _ = require('lodash');
const secrets = require('../secrets.json');
const _sa = require('superagent');



/**
 * Interface shared by tagged data.
 * @interface {IImageTag}
 */
export interface IImageTag {
    /** @var {string} text Caption text */
    name: string;
    /** @var {confidence} score Probability this caption is applicable */
    confidence: number;
}
/**
 * Rectangle
 * @interface 
 */
export interface IRectangle {
    /**
     * Leftmost point
     * @var {number}
     */
    left: number;
    /**
     * topmost point
     * @var {number}
     */
    top: number;
    /**
     * width 
     * @var {number}
     */
    width: number;
    /**
     * height
     * @var {number}
     */
    height: number;
}

/** @interface IImageCategory<TDetail> contains an abstract image category result. */
export interface IImageCategory<TDetail> {
    /** @var {string} name Category Name */
    name: string;
    /** @var {number} score Probability for this category */
    score: number;
    /** @var {TDetail} category detail */
    detail?: TDetail;
}

export interface IImageCelebrity extends IImageTag {
    /**
     * Rectangle containing celebrity face.
     * @var {IFaceRectangle} 
     */
    faceRectangle: IRectangle;
}

/** @interface IImageCategoryDetailPeoplePortrait contains people portrait category data. */
export interface IImageCategoryDetailPeoplePortrait {
    /**
     * Recognized faces
     * @var {IImageCelebrity[]}
     */
    celebrities: IImageCelebrity[];
    /**
     * Recognized landmarks
     * @var {IImageTag[]}
     */
    landmarks: IImageTag[];
}


/** @interface IAnalyzeImageResponseData describes analyzeImage return value. */
export interface IAnalyzeImageResponseData {
    /** Adult content @var {IImageCategory<any>[]} */
    adult?: {
        /**
         * If this is adult content
         * @var {boolean}
         */
        isAdultContent: boolean;
        /**
         * If this is racy content
         * @var {boolean}
         */
        isRacyContent: boolean;
        /**
         * If this is gory content
         * @var {boolean}
         */
        isGoryContent: boolean;
        /**
         * Probability the image contains adult content
         * @var {number}
         */
        adultScore: number;
        /**
         * Probability the image contains racy content
         * @var {number}
         */
        racyScore: number;
        /**
         * Probability the image contains gorey content
         * @var {number}
         */
        goreScore: number;
    };
    categories?: IImageCategory<any>[];
    color?: {
        /** @var {string} dominantColorForeground The dominant color of the foreground */
        dominantColorForeground: string;
        /** @var {string} dominantColorBackground The dominant color of the background */
        dominantColorBackground: string;
        /** @var {string[]} dominantColors Array containing the most dominant colors in the image */
        dominantColors: string[];
        /** @var {string} accentColor The image accent color in the image */
        accentColor: string;
        /** @var {boolean} isBwImg Is the image black and white? */
        isBwImg: boolean;
        /** @var {boolean} isBWImg Is the image capital black and white?  */
        isBWImg: boolean;
    };
    description?: {
        /** @var {string[]} tags Array of tags describing the image */
        tags?: string[];
        /** @var {IImageCaption} Image captions */
        captions?: {
            /** @var {string} text Caption text */
            text: string;
            /** @var {confidence} score Probability this caption is applicable */
            confidence: number;
        }[];
    };
    tags?: IImageTag[];
    requestId: string;
    faces?: {
        /** @var {number} persons age */
        age: number;
        /** @var {number} persons gender*/
        gender: string;
        /** @var {number} bounding rectangle */
        faceRectangle: IRectangle;
    }[];
    metadata?: {
        width: number;
        height: number;
        format: string;
    };
    objects?: {
        rectangle: {
            /**
             * Left-most point
             * @var {number}
             */
            x: number;
            /**
             * Top-most point
             * @var {number}
             */
            y: number;
            /**
             * Width
             * @var {number}
             */
            w: number;
            /**
             * Height
             * @var {number}
             */
            h: number;
        };
        /**
         * Object name
         * @var {string}
         */
        object: string;
        /**
         * Probability match is correct
         * @var {number}
         */
        confidence: number;
    }[];
}


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
 * 
 * @param {IAnalyzeImageOptions} ops Image analyze options
 * @returns {IAnalyzeImageResponseData} Structured data extracted from image.
 */
export async function analyzeImage(ops: {
    /**
     * Image data
     * @var {number[]} 
     */
    data: number[];
    /**
     * Array of visual features to process.
     * @var {VisualFeatures[]} 
     */
    visualFeatures?: VisualFeature[];
    /**
     * Array of optional domain-specific details
     * @var {AnalyzeDetails[]}
     */
    details?: AnalyzeDetail[];
    /**
     * Array of optional domain-specific details
     * @var {AnalyzeDetails[]}
     */
    language?: Language;
}) {
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
        const uri = makeVisionApi('vision/v3.1/analyze', reqParams);
        debug('about to post uploaded image to ' + uri);

        const resp = await _sa.post(uri)
            .set(HttpHeader.ContentType, ContentType.OctetStream)
            .set(HttpHeader.MsApiSubscription, secrets.msVision.key)
            .send(ops.data);

        return resp.body;
    } catch (err) {
        debug('ruh roh!', err);
        throw err;
    }
}

