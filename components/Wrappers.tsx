import {
    CMSHeaderSectionInterface,
    CMSTextSectionInterface,
    CMSCallToActionSectionInterface,
    CMSStatementSectionInterface,
    CMSButtonSectionInterface,
    CMSArticlesInterface,
} from '../services/ArticleService';
import {
    CMSProductInterface,
    CMSProductsInterface,
} from '../services/ProductsService';
import { CMSItemDataInterface, CMSItemInterface } from '../utils/CMSContent';
import { CMSTeaserImageInterface } from '../services/TeasersService';
import { ICMSImage } from '../types/CMSImage';
import { CMSArticlesListSection } from '../sections/ArticlesListSection';
import { CMSProductsListSection } from '../sections/ProductsListSection';
import {
    CMSTeaserImageGridCard,
    CMSTeaserProductGridCard,
} from './GridCards';
import {
    LNXTwoGrid,
    LNXThreeGrid,
    LNXImageGridCard,
    LNXMarkdownGridCard,
    LNXImageSlim,
    LNXHeaderSection,
    LNXTextSection,
    LNXButtonSection,
    LNXCallToActionSection,
    LNXStatementSection,
} from '../../lib-lnx/components';
import {
    LNXPopOutHeader,
    LNXYouTubePlayer,
} from '../../lib-lnx/utils';


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
    link_href?: string,
}


// CMSHeaderSection
interface HeaderSectionProps {
    key?: string,
    data: CMSHeaderSectionInterface,
}
export function CMSHeaderSectionWrapper({ data }: HeaderSectionProps): React.JSX.Element {
    return (
        <LNXPopOutHeader>
            <LNXHeaderSection text={data.value} />
        </LNXPopOutHeader >
    );
}

// CMSTextSection
interface TextSectionProps {
    key?: string,
    data: CMSTextSectionInterface,
    justify?: string,
}
export function CMSTextSectionWrapper({ data, justify }: TextSectionProps): React.JSX.Element {
    return (
        <LNXTextSection markdown={data.value} justify={justify} />
    );
}

// CMSSlimImageSection
export const CMSSlimImageSectionWrapper = ({ image }: { image: ICMSImage }): React.JSX.Element => {
    return (
        <LNXImageSlim url={image.image_url} alt={image.image_alt} />
    );
}

// CMSCallToActionSection
interface CallToActionSectionProps {
    key?: string,
    data: CMSCallToActionSectionInterface,
}
export const CMSCallToActionSectionWrapper = ({ data }: CallToActionSectionProps): React.JSX.Element => {
    return (
        <LNXCallToActionSection css_class={data.class} header={data.header} text={data.text} link_href={data.link_href} link_text={data.link_text} />
    );
}

// CMSStatementSection
interface CMSStatementSectionProps {
    key?: string,
    data: CMSStatementSectionInterface,
}
export const CMSStatementSectionWrapper = ({ data }: CMSStatementSectionProps): React.JSX.Element => {
    return (
        <LNXStatementSection css_class={data.class} header={data.header} text={data.text} footer={data.footer} />
    );
}

// CMSButtonSection
interface CMSButtonSectionProps {
    key?: string,
    data: CMSButtonSectionInterface,
}
export const CMSButtonSectionWrapper = ({ data }: CMSButtonSectionProps): React.JSX.Element => {
    return (
        <LNXButtonSection href={data.link_href} text={data.link_text} />
    );
}


// YouTubePlayerInterface
export interface CMSYouTubePlayerInterface {
    video_id: string,
    title: string,
}

// CMSSlimYouTubePlayerSection
export const CMSSlimYouTubePlayerSectionWrapper = ({ video }: { video: CMSYouTubePlayerInterface }): React.JSX.Element => {
    return (
        <div className="Slim Frame mt-4">
            <div className='p-4 m-4 bg-white'>
                <LNXYouTubePlayer videoId={video.video_id} title={video.title} />
            </div>
        </div>
    );
}

export const CMSArticlesListSectionWrapper = ({ data }: { data: CMSArticlesInterface }): React.JSX.Element => {
    return <CMSArticlesListSection data={data}></CMSArticlesListSection>
}

export const CMSProductsListSectionWrapper = ({ data }: { data: CMSProductsInterface }): React.JSX.Element => {
    return <CMSProductsListSection data={data}></CMSProductsListSection>
}

export function CMSGridItemsWrapper({ items }: { items: CMSItemDataInterface[] }): React.JSX.Element[] {
    const card = items.map((sub_item: CMSItemDataInterface) => {
        switch (sub_item.type) {
            case 'teaser_grid_card': {
                const data = sub_item.data as CMSTeaserImageInterface;
                return <CMSTeaserImageGridCard key={sub_item.id} image={data} />;
            }
            case 'teaser_grid_card': {
                const data = sub_item.data as CMSTeaserImageInterface;
                return <CMSTeaserImageGridCard key={sub_item.id} image={data} />;
            }
            case 'product_grid_card': {
                const data = sub_item.data as CMSProductInterface;
                return <CMSTeaserProductGridCard key={sub_item.id} product={data} />;
            }
            case 'text_grid_card': {
                const data = sub_item.data as CMSTextGridCardInterface;
                return <LNXMarkdownGridCard key={sub_item.id} header={data.header} markdown={data.text} link_href={data.link_href} link_text={data.link_text} />;
            }
            case 'image_grid_card': {
                const data = sub_item.data as CMSImageGridCardInterface;
                return <LNXImageGridCard key={sub_item.id} url={data.image_url} alt={data.image_alt} link_href={data.link_href} />;
            }
            default: return <></>
        }
    })
    return card;
}

export function CMSSlimTwoGridWrapper({ item }: { item: CMSItemInterface }): React.JSX.Element {
    if (!item.items) {
        return <></>;
    }

    return (
        <LNXTwoGrid key={item.id}>
            <CMSGridItemsWrapper items={item.items} />
        </LNXTwoGrid>
    );
}

export function CMSSlimThreeGridWrapper({ item }: { item: CMSItemInterface }): React.JSX.Element {
    if (!item.items) {
        return <></>;
    }

    return (
        <LNXThreeGrid key={item.id}>
            <CMSGridItemsWrapper items={item.items} />
        </LNXThreeGrid>
    );
}