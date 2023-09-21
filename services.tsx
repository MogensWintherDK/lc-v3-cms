// ArticleService
export type {
    CMSArticlePathInterface,
    CMSArticlePathsInterface,
    CMSArticleInterface,
    CMSArticlesInterface,
    CMSArticleGroupInterface,
    CMSArticleGroupsInterface,
    CMSHeaderSectionInterface,
    CMSTextSectionInterface,
    CMSCallToActionSectionInterface,
    CMSStatementSectionInterface,
    CMSButtonSectionInterface,
    CMSMetadataInterface,
} from './services/ArticleService';

export {
    getCMSArticlePaths,
    getCMSArticles,
    getCMSArticleGroups,
    getCMSArticlesByGroup,
    getCMSArticle,
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

// ImageService
export type { CMSImageInterface, CMSImagesInterface } from './services/ImagesService';

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
    CMSProductGroupInterface,
    CMSProductGroupsInterface,
} from './services/ProductsService';
export {
    getCMSProductPaths,
    getCMSProducts,
    getCMSProductsByGroup,
    getCMSProduct,
    getCMSRelatedProducts,
    getCMSRelatedImages,
    getCMSProductGroups,
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