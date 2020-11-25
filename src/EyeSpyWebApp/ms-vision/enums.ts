
/**
 * Available visual features for analysis
 * @enum {string}
 */
export enum HttpHeader {
    ContentType = 'Content-Type',
    MsApiSubscription = 'Ocp-Apim-Subscription-Key'
}
/**
 * Available request content types
 * @enum {string}
 */
export enum ContentType {
    OctetStream = 'application/octet-stream'
}
/**
 * Available visual features for analysis
 * @enum {string}
 */
export enum VisualFeature {
    /** Adult Content Detection */
    Adult = 'Adult',
    /** Brand Detection */
    Brands = 'Brands',
    /** Categorization */
    Categories = 'Categories',
    /** Color classification */
    Color = 'Color',
    /** Image Description */
    Description = 'Description',
    /** Face detection  */
    Faces = 'Faces',
    /** Image Type Detection  */
    ImageType = 'ImageType',
    /** Object Detection  */
    Objects = 'Objects',
    /** Image tagging  */
    Tags = 'Tags'
}
/**
 * Available Languages
 * @enum {string}
 */
export enum Language  {
    /** English */
    English = 'en',
    /** Spanish */
    Spanish = 'es',
    /** Japanese */
    Japanese = 'ja',
    /** Portuguese */
    Portuguese = 'pt',
    /** SimplifiedChinese */
    SimplifiedChinese = 'zh'
}
/**
 * Analyze Details
 * @enum {string}
 */
export enum AnalyzeDetail {
    /** Celebrity  */
    Celebrities = 'Celebrities',
    /** Landmark */
    Landmarks = 'Landmarks'
}

/**
 * Type of clip art
 * @enum {number}
 */
export enum ClipartType {
    /** Not clip art */
    NonClipart = 0,
    /** Unable to determine */
    Ambiguous = 1,
    /** Passable as clip art */
    Normal = 2,
    /** High-quality clip art */
    Good = 3
}
/**
 * Type of line drawing
 * @enum {number}
 */
export enum LineDrawingType {
    /** Image is not a line drawing */
    NonLineDrawing = 0,
    /** Image is a line drawing */
    LineDrawing = 1
}
/**
 * Status of a Read operation
 * @enum {number}
 */
export enum GetReadResultStatus {
    NotStarted = "notStarted",
    Running = "running",
    Failed = "failed",
    Succeeded = "succeeded"
}