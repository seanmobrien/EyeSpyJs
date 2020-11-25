import * as visEnums from './enums';

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
 * @interface IRectangle rectangle with verbose property names.
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
/**
 * @interface IRectangle rectangle with abbreviated property names.
 */
export interface IRect {
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
}


/**
 * Image category envelope.
 * @interface
 */
export interface IImageCategory<TDetail> {
    /**
     * The name of this category.
     * @var {string}
     */
    name: string;
    /**
     * The probability assigned to this category.
     * @var {number}
     */
    score: number;
    /**
     * Detail data object.
     * @var {TDetail}
     */
    detail?: TDetail;
}
/**
 * Describes a celebrity detected within an image.
 * @interface
 */
export interface IImageCelebrity extends IImageTag {
    /**
     * Rectangle containing celebrity face.
     * @var {IFaceRectangle} 
     */
    faceRectangle: IRectangle;
}
/**
 * Contains people portrait category data.
 * @interface
 */
export interface IImageCategoryDetailPeoplePortrait {
    /**
     * Recognized people.
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
 * Basic image metadata.
 * @interface 
 */
export interface IImageMetadata {
    /**
     * The image width.
     * @var {number}
     */
    width: number;
    /**
     * The image height.
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

/**
 * Describes an object detected within an image.
 * @interface
 */
export interface IDetectedObject extends IDetectedObjectBase {
    /**
     * The bounding rectangle the object was detected within.
     * @var {IRect} 
     */
    rectangle: IRect;
    /**
     * Optional detected parent to this object.
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
 * Contains image description analysis response.
 * @interface 
 */
export interface IImageDescription {
  /**
   * Array of tags describing the image.
   * @var {string[]}
   */
  tags?: string[];
  /**
   * Image Captions.
   * @var { { text: string, confidence: number} }
   */
  captions?: {
    /**
     * Caption text.
     * @var {string}
     */
    text: string;
    /**
     * Probability the caption is applicable to the image.
     * @var {number}
     */
    confidence: number;
  }[];
}


/**
 * Contains properties shared by all cognitive responses.
 * @interface
 */
export interface ICongnitiveResponseData {
 /**
 *  Metadata describing the source image.
 * @var {IImageMetadata}
 */
  metadata?: IImageMetadata;
  /**
  * Unique request identifier.
  * @var {string}
  */
  requestId: string;
}


/**
 * Return type of detectObjects function.
 * @interface
 */
export interface IDetectObjectsResponseData extends ICongnitiveResponseData {

    /**
     * Array of detected object data.
     * @var {IDetectedObject[]}
     */
    objects?: IDetectedObject[];

}
/**
 * IDescribeImageResponseData Describe image API response.
 * @interface
 */
export interface IDescribeImageResponseData extends ICongnitiveResponseData {
  /**
   * Description of the image.
   * @var {IImageDescription} 
   */
  description: IImageDescription;
}

/**
 * Describes adult image detection attributes.
 * @interface
 */
export interface IAdultImageDetectionDetail {
    /**
     * If this is adult content.
     * @var {boolean}
     */
    isAdultContent: boolean;
    /**
     * If this is racy content.
     * @var {boolean}
     */
    isRacyContent: boolean;
    /**
     * If this is gory content.
     * @var {boolean}
     */
    isGoryContent: boolean;
    /**
     * Probability the image contains adult content.
     * @var {number}
     */
    adultScore: number;
    /**
     * Probability the image contains racy content.
     * @var {number}
     */
    racyScore: number;
    /**
     * Probability the image contains gorey content.
     * @var {number}
     */
    goreScore: number;
}

/**
 * Interface describing analyzeImage return value.
 * @interface 
 */
export interface IAnalyzeImageResponseData extends IDetectObjectsResponseData {
    /**
     * Adult content
     * @var {IAdultImageDetectionDetail}
     */
    adult?: IAdultImageDetectionDetail;
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
     * @var description Description of the image.
     */
    description?: IImageDescription;
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

/**
 * Common properties shared by all cognitive requests.
 * @interface
 */
export interface ICognitiveRequest {
  /**
  * Array of bytes containing the binary image.
  * @var {Uint8Array}
  */
  data: Uint8Array;
}

/**
 * Options that can be passed to the Describe Image operation.
 * @interface
 */
export interface IDescribeImageRequest extends ICognitiveRequest {
  /**
   * Maximum number of candidate descriptions to be returned. The default is 1.
   * @var {number} 
   */
  maxCandidates?: number;
  /**
   * Language the descriptions should be generated in.
   * @var {AnalyzeDetails[]} 
   */
  language?: visEnums.Language;
}
/**
 * Options that can be passed to the Analyze Image operation
 * @interface
 */
export interface IAnalyzeImageRequest extends ICognitiveRequest {
  /**
   * Array of visual features to process.
   * @var {VisualFeatures[]} 
   */
  visualFeatures?: visEnums.VisualFeature[];
  /**
   * Array of optional domain-specific details
   * @var {AnalyzeDetails[]}
   */
  details?: visEnums.AnalyzeDetail[];
  /**
   * Array of optional domain-specific details
   * @var {AnalyzeDetails[]}
   */
  language?: visEnums.Language;
}
/**
 * Describes the object returned by an Area of Interest operation.
 * @interface 
 */
export interface IAreaOfInterestResponseData extends ICongnitiveResponseData {
  /**
   * Bounding rectangle of the identified area of interest
   * @var {IRect}
   */
  areaOfInterest: IRect;
}

/**
 * Describes options passed to a Tag Image operation.
 * @interface 
 */
export interface ITagImageRequest extends ICognitiveRequest {
  /**
   * Optionally specify the language tags should be computed in.
   * @var {Language} 
   */
  language?: visEnums.Language;
}
/**
 * Describes the object returned by a Tag Image operation.
 * @interface
 */
export interface ITagImageResponseData extends ICongnitiveResponseData {
  /**
   * Array of tags that can be applied to this image.
   * @var {IImageTag[]} 
   */
  tags: IImageTag[];
}