
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
    /** @var */
    Adult = 'Adult',
    Brands = 'Brands',
    Categories = 'Categories',
    Color = 'Color',
    Description = 'Description',
    Faces = 'Faces',
    ImageType = 'ImageType',
    Objects = 'Objects',
    Tags = 'Tags'
}
/**
 * Available Languages
 * @enum {string}
 */
export enum Language {
    English = 'en',
    Spanish = 'es',
    Japanese = 'ja',
    Portuguese = 'pt',
    SimplifiedChinese = 'zh'
}
/**
 * Analyze Details
 * @enum {string}
 */
export enum AnalyzeDetail {
    Celebrities = 'Celebrities',
    Landmarks = 'Landmarks'
}

/**
 * Type of clip art
 * @enum {number}
 */
export enum ClipartType {
    NonClipart = 0,
    Ambiguous = 1,
    Normal = 2,
    Good = 3
}
/**
 * Type of line drawing
 * @enum {number}
 */
export enum LineDrawingType {
    NonLineDrawing = 0,
    LineDrawing = 1
}

export default {
  HttpHeader: HttpHeader;
  ContentType: ContentType;
  VisualFeature: VisualFeature;
  Language: Language;
  AnalyzeDetail: AnalyzeDetail;
  ClipartType: ClipartType;
  LineDrawingType: LineDrawingType;
};