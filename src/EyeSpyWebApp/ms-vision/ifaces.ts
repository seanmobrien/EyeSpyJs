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

/**
 * Basic image metadata
 * @interface IAnalyzeImageResponseData
 */
export interface IImageMetadata {
    /**
     * The image width
     * @var {number}
     */
    width: number;
    /**
     * The image height
     * @var {number}
     */
    height: number;
    /**
     * The format used to store the image (jpg, png, etc).
     * @var {number}
     */
    format: string;
}

/**
 * Base interface shared by detected object representations.
 * @interface IAnalyzeImageResponseData
 */
export interface IDetectedObjectBase {
    /**
     * The name of the detected object.
     * @var {string}
     */
    object: string;
    /**
     * The probability that the object was detected.
     * @var {number}
     */
    confidence: number;
}
export interface IDetectedObject extends IDetectedObjectBase {
    /**
     * The bounding rectangle the object was detected within.
     * @var { { x:number; y:number; w: number; h: number; } }
     */
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
     * Optional parent to this object.
     * @var {IDetectedObjectBase}
     */
    parent?: IDetectedObjectBase;
}
/**
 * The IDetectedFace interface describes a face detected within an image.
 * @interface
 */
export interface IDetectedFace {
    /**
     * Estimated age of the person.
     * @var {number}
     */
    age: number;
    /**
     * Estimated gender of the person.
     * @var {number} persons gender
     */
    gender: string;
    /**
     * Bounding rectangle the face belongs to.
     * @var {number} bounding rectangle
     */
    faceRectangle: IRectangle;
}


/**
 * Interface describing detectObjects return value.
 * @interface
 */
export interface IDetectObjectsResponseData {
    /**
     * Metadata describing the source image.
     * @var {IImageMetadata}
     */
    metadata?: IImageMetadata;
    /**
     * Array of detected object data.
     * @var {IDetectedObject[]}
     */
    objects?: IDetectedObject[];
    /**
     * Unique request identifier.
     * @var {string}
     */
    requestId: string;
}

/**
 * Interface describing analyzeImage return value.
 * @interface IAnalyzeImageResponseData
 */
export interface IAnalyzeImageResponseData extends IDetectObjectsResponseData {
    /** Adult content @var {any} */
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
    /**
     * Array of categories that can be assigned to the image.
     * @var {IImageCategory<any>[]}
     */
    categories?: IImageCategory<any>[];
    /**
     * Image color data
     * @var {any}
     */
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
    /**
     * Description of the image.
     */
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
    /**
     * Array of tags that can be applied to this image.
     * @var {IImageTag[]}
     */
    tags?: IImageTag[];
    /**
     * Detected face data.
     * @var {IDetectedFace[]}
     */
    faces?: IDetectedFace[];
}