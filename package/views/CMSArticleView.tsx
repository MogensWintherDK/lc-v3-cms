import {
    HeaderSectionInterface,
    TextSectionInterface,
    CallToActionSectionInterface,
    StatementSectionInterface,
    ButtonSectionInterface,
    ArticlesType,
    ArticleGroupsType,
} from '../services/ArticleService'
import {
    ProductsType,
    ProductGroupsType,
} from '../services/ProductsService';
import {
    CMSHeaderSection,
    CMSTextSection,
    CMSSlimImageSection,
    CMSCallToActionSection,
    CMSStatementSection,
    CMSButtonSection,
    YouTubePlayerInterface,
    CMSSlimYouTubePlayerSection,
    CMSArticlesListSection,
    CMSProductsListSection,
    CMSArticleGroupsListSection,
    CMSProductGroupsListSection,
    CMSSlimTwoGrid,
    CMSSlimThreeGrid,
} from '../components/CMS';
import { HeroImage, getNavigationHeaderHeight } from '@mogenswintherdk/lc-v3-nextjs';
import { CMSItemInterface } from '../utils/CMSContent';
import { ImageInterface } from '../services/ImagesService';
import { useRef } from 'react';

export function CMSArticleView({ props }: { props: any }) {
    const ref = useRef<HTMLDivElement | null>(null);

    const handleClick = () => {
        if (ref.current) {
            const headerHeight = getNavigationHeaderHeight();
            window.scrollTo({ top: ref.current.offsetTop - headerHeight, behavior: 'smooth' });
        }
    };

    return (
        <>
            {
                props.page_image_url && (
                    <HeroImage src={props.page_image_url} header={props.name} text={props.name_sub} onClick={handleClick} />
                )
            }
            <article ref={ref} className='flex flex-wrap'>
                <div className='w-full mt-8'>
                    {
                        !props.content && (
                            <p className='align-'>Ups .... no content found!</p>
                        )
                    }

                    {
                        props.content && props.content.items.map((item: CMSItemInterface) => {
                            switch (item.type) {
                                case 'slim_two_grid':
                                    return <CMSSlimTwoGrid key={item.id} item={item} />;
                                case 'slim_three_grid':
                                    return <CMSSlimThreeGrid key={item.id} item={item} />;
                                case 'slim_image':
                                    return <CMSSlimImageSection key={item.id} image={item.data as ImageInterface} />
                                case 'slim_header_section':
                                    return <CMSHeaderSection key={item.id} data={item.data as HeaderSectionInterface} />;
                                case 'slim_left_text_section':
                                    return <CMSTextSection key={item.id} data={item.data as TextSectionInterface} justify="left" />;
                                case 'slim_center_text_section':
                                    return <CMSTextSection key={item.id} data={item.data as TextSectionInterface} justify="center" />;
                                case 'slim_right_text_section':
                                    return <CMSTextSection key={item.id} data={item.data as TextSectionInterface} justify="right" />;
                                case 'wide_call_to_action_section':
                                    return <CMSCallToActionSection key={item.id} data={item.data as CallToActionSectionInterface} />;
                                case 'wide_statement_section':
                                    return <CMSStatementSection key={item.id} data={item.data as StatementSectionInterface} />;
                                case 'slim_button_section':
                                    return <CMSButtonSection key={item.id} data={item.data as ButtonSectionInterface} />
                                case 'slim_youtube':
                                    return <CMSSlimYouTubePlayerSection key={item.id} video={item.data as YouTubePlayerInterface} />
                                case 'slim_articles_list':
                                    return <CMSArticlesListSection key={item.id} data={item.data as ArticlesType} />
                                case 'slim_products_list':
                                    return <CMSProductsListSection key={item.id} data={item.data as ProductsType} />
                                case 'slim_article_groups_list':
                                    return <CMSArticleGroupsListSection key={item.id} article_groups={item.data as ArticleGroupsType} />
                                case 'slim_product_groups_list':
                                    return <CMSProductGroupsListSection key={item.id} product_groups={item.data as ProductGroupsType} />
                            }
                        })
                    }
                </div>
            </article>
        </>
    );
}