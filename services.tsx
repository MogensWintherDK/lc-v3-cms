// ArticleService
export type {
    CMSArticlePathInterface,
    CMSArticlePathsInterface,
    CMSArticleInterface,
    CMSArticlesInterface,
    CMSHeaderSectionInterface,
    CMSTextSectionInterface,
    CMSCallToActionSectionInterface,
    CMSStatementSectionInterface,
    CMSButtonSectionInterface,
} from './services/ArticleService';

export {
    getCMSArticlePaths,
    getCMSArticles,
    getCMSArticle,
    getCMSArticleBySlug,
    getCMSArticleByType,
} from './services/ArticleService';

// FirebaseService
export { CMSFirebase, CMSFirestore } from './services/FirebaseService';

// FooterService
export type { CMSFooterDataInterface } from './services/FooterService';
export { getCMSFooterData } from './services/FooterService';

// HeaderService
export type { CMSHeaderDataInterface } from './services/HeaderService';
export { getCMSHeaderData } from './services/HeaderService';

// Types
export type { ICMSImage, ICMSImages } from './types/CMSImage';
export type { ICMSMetadata } from './types/CMSMetadata';

// ProductService
export type {
    CMSProductPathInterface,
    CMSProductPathsInterface,
    CMSProductInterface,
    CMSProductsInterface,
    CMSRelatedProductInterface,
    CMSRelatedProductsInterface,
    CMSProductImageInterface,
    CMSProductImagesInterface,
} from './services/ProductsService';
export {
    getCMSProductPaths,
    getCMSProducts,
    getCMSProduct,
    getCMSProductBySlug,
    getCMSRelatedProductsByTags,
    getCMSRelatedImages,
} from './services/ProductsService';

// TeaserService
export type {
    CMSTeaserImageInterface,
    CMSTeaserInterface,
    CMSTeasersInterface,
} from './services/TeasersService';
export {
    getAllTeasers,
    getTeaser,
} from './services/TeasersService';