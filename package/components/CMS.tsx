import {
    HeaderSectionInterface,
    TextSectionInterface,
    CallToActionSectionInterface,
    StatementSectionInterface,
    ButtonSectionInterface,
    ArticlesType,
    ArticleGroupsType,
} from '../services/ArticleService';
import {
    ProductGroupsType,
    ProductsType,
} from '../services/ProductsService';
import { CMSItemDataInterface, CMSItemInterface } from '../utils/CMSContent';
import { TeaserImageInterface } from '../services/TeasersService';
import { ImageInterface } from '../services/ImagesService';
import { ProductType } from '../services/ProductsService';
import { ArticlesListSection } from '../sections/ArticlesListSection';
import { ProductsListSection } from '../sections/ProductsListSection';
import { ArticleGroupsListSection } from '../sections/ArticleGroupsListSection';
import { ProductGroupsListSection } from '../sections/ProductGroupsListSection';
import { TeaserImageGridCard, TeaserProductGridCard } from './GridCards';
import {
    TwoGrid, ThreeGrid, ImageGridCard, MarkdownGridCard, ImageSlim, //PopOutHeader,
    HeaderSection, TextSection, ButtonSection, CallToActionSection, StatementSection,
} from '@mogenswintherdk/lc-v3-nextjs';
import {
    PopOutHeader,
    YouTubePlayer,
} from '@mogenswintherdk/lc-v3-nextjs';


// CMSTextGridCardInterface
export interface CMSTextGridCardInterface {
    id: string,
    header?: string,
    text: string,
    link_text?: string,
    link_href?: string,
}

// CMSImageGridCardInterface
export interface CMSImageGridCardInterface {
    id: string,
    image_url: string,
    image_alt?: string,
}


// CMSHeaderSection
interface HeaderSectionProps {
    key?: string,
    data: HeaderSectionInterface,
}
export function CMSHeaderSection({ data }: HeaderSectionProps) {
    return (
        <PopOutHeader>
            <HeaderSection text={data.value} />
        </PopOutHeader >
    );
}

// CMSTextSection
interface TextSectionProps {
    key?: string,
    data: TextSectionInterface,
    justify?: string,
}
export function CMSTextSection({ data, justify }: TextSectionProps) {
    return (
        <TextSection markdown={data.value} justify={justify} />
    );
}

// CMSSlimImageSection
export const CMSSlimImageSection = ({ image }: { image: ImageInterface }) => {
    return (
        <ImageSlim url={image.image_url} alt={image.image_alt} />
    );
}

// CMSCallToActionSection
interface CallToActionSectionProps {
    key?: string,
    data: CallToActionSectionInterface,
}
export const CMSCallToActionSection = ({ data }: CallToActionSectionProps) => {
    return (
        <CallToActionSection css_class={data.class} header={data.header} text={data.text} link_href={data.link_href} link_text={data.link_text} />
    );
}

// CMSStatementSection
interface CMSStatementSectionProps {
    key?: string,
    data: StatementSectionInterface,
}
export const CMSStatementSection = ({ data }: CMSStatementSectionProps) => {
    return (
        <StatementSection css_class={data.class} header={data.header} text={data.text} footer={data.footer} />
    );
}

// CMSButtonSection
interface CMSButtonSectionProps {
    key?: string,
    data: ButtonSectionInterface,
}
export const CMSButtonSection = ({ data }: CMSButtonSectionProps) => {
    return (
        <ButtonSection href={data.link_href} text={data.link_text} />
    );
}


// YouTubePlayerInterface
export interface YouTubePlayerInterface {
    video_id: string,
    title: string,
}

// CMSSlimYouTubePlayerSection
export const CMSSlimYouTubePlayerSection = ({ video }: { video: YouTubePlayerInterface }) => {
    return (
        <div className="Slim Frame mt-4">
            <div className='p-4 m-4 bg-white'>
                <YouTubePlayer videoId={video.video_id} title={video.title} />
            </div>
        </div>
    );
}

export const CMSArticlesListSection = ({ data }: { data: ArticlesType }) => {
    return <ArticlesListSection data={data.articles}></ArticlesListSection>
}

export const CMSArticleGroupsListSection = ({ article_groups }: { article_groups: ArticleGroupsType }) => {
    return <ArticleGroupsListSection article_groups={article_groups.article_groups}></ArticleGroupsListSection>
}

export const CMSProductsListSection = ({ data }: { data: ProductsType }) => {
    return <ProductsListSection data={data.products}></ProductsListSection>
}

export const CMSProductGroupsListSection = ({ product_groups }: { product_groups: ProductGroupsType }) => {
    return <ProductGroupsListSection product_groups={product_groups.product_groups}></ProductGroupsListSection>
}

export function CMSGridItems({ items }: { items: CMSItemDataInterface[] }) {
    return (
        items.map((sub_item: CMSItemDataInterface) => {
            if (sub_item.type == 'teaser_grid_card') {
                const data = sub_item.data as TeaserImageInterface;
                return <TeaserImageGridCard key={sub_item.id} image={data} />;
            }
            if (sub_item.type == 'product_grid_card') {
                const data = sub_item.data as ProductType;
                return <TeaserProductGridCard key={sub_item.id} product={data} />;
            }
            if (sub_item.type == 'text_grid_card') {
                const data = sub_item.data as CMSTextGridCardInterface;
                return <MarkdownGridCard key={sub_item.id} header={data.header} markdown={data.text} link_href={data.link_href} link_text={data.link_text} />;
            }
            if (sub_item.type == 'image_grid_card') {
                const data = sub_item.data as CMSImageGridCardInterface;
                return <ImageGridCard key={sub_item.id} url={data.image_url} alt={data.image_alt} />;
            }
        })

    )
}

export function CMSSlimTwoGrid({ item }: { item: CMSItemInterface }) {
    if (!item.items) {
        return <></>;
    }

    return (<TwoGrid key={item.id}>
        <CMSGridItems items={item.items} />
    </TwoGrid>);
}

export function CMSSlimThreeGrid({ item }: { item: CMSItemInterface }) {
    if (!item.items) {
        return <></>;
    }

    return (<ThreeGrid key={item.id}>
        <CMSGridItems items={item.items} />
    </ThreeGrid>);
}