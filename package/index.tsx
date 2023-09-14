// components
export { RelatedImagesGrid, TeaserProductGrid } from './components/Grids';
export { TeaserImageGridCard, TeaserProductGridCard } from "./components/GridCards";

// sections
export { ArticlesListSection } from "./sections/ArticlesListSection";
export { ProductsListSection } from './sections/ProductsListSection';
export { ArticleGroupsListSection } from './sections/ArticleGroupsListSection';
export { ProductGroupsListSection } from './sections/ProductGroupsListSection';

// services
export {
    getArticle,
    getArticleByType,
    getArticlesByGroup,
    getArticleGroups,
    getArticlePaths,
    getArticles,
} from './services/ArticleService';
export type {
    HeaderSectionInterface,
    TextSectionInterface,
    CallToActionSectionInterface,
    StatementSectionInterface,
    ButtonSectionInterface,
    ArticlesType,
    ArticleGroupsType,
    MetadataInterface,
} from './services/ArticleService';

export {
    getProduct,
    getProducts,
    getProductPaths,
    getProductGroups,
    getProductsByGroup,
} from './services/ProductsService';
export type {
    ProductGroupsType,
    ProductsType,
} from './services/ProductsService';

export { getHeaderData } from './services/HeaderService';
export type { HeaderDataType } from './services/HeaderService';

export { getFooterData } from './services/FooterService';
export type { FooterDataType } from './services/FooterService';

export type { ImageInterface } from './services/ImagesService';

export type { TeaserImageInterface } from './services/TeasersService';

// views
export { CMSArticleView } from './views/CMSArticleView';