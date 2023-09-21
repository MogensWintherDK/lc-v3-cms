import React from 'react';
import { useRef } from 'react';
import { getLNXNavigationHeaderHeight } from '../../lib-lnx/utils';
import { LNXHeroImage } from '../../lib-lnx/components';
import {
    CMSHeaderSectionInterface,
    CMSTextSectionInterface,
    CMSCallToActionSectionInterface,
    CMSStatementSectionInterface,
    CMSButtonSectionInterface,
    CMSArticlesInterface,
    CMSArticleGroupsInterface,
    CMSProductsInterface,
    CMSProductGroupsInterface,
    CMSProductInterface,
} from '../services';
import {
    CMSHeaderSectionWrapper,
    CMSTextSectionWrapper,
    CMSSlimImageSectionWrapper,
    CMSCallToActionSectionWrapper,
    CMSStatementSectionWrapper,
    CMSButtonSectionWrapper,
    CMSYouTubePlayerInterface,
    CMSSlimYouTubePlayerSectionWrapper,
    CMSArticlesListSectionWrapper,
    CMSProductsListSectionWrapper,
    CMSArticleGroupsListSectionWrapper,
    CMSProductGroupsListSectionWrapper,
    CMSSlimTwoGridWrapper,
    CMSSlimThreeGridWrapper,
} from '../components';
import { ICMSImage } from '../types/CMSImage';
import { CMSItemInterface } from '../utils/CMSContent';


export function CMSArticleView({ props }: { props: any }): React.JSX.Element {
    const ref = useRef<HTMLDivElement | null>(null);

    const handleClick = () => {
        if (ref.current) {
            const headerHeight = getLNXNavigationHeaderHeight();
            window.scrollTo({ top: ref.current.offsetTop - headerHeight, behavior: 'smooth' });
        }
    };

    return (
        <>
            {
                props.page_image_url && (
                    <LNXHeroImage src={props.page_image_url} header={props.name} text={props.name_sub} onClick={handleClick} />
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
                                    return <CMSSlimTwoGridWrapper key={item.id} item={item} />;
                                case 'slim_three_grid':
                                    return <CMSSlimThreeGridWrapper key={item.id} item={item} />;
                                case 'slim_image':
                                    return <CMSSlimImageSectionWrapper key={item.id} image={item.data as ICMSImage} />
                                case 'slim_header_section':
                                    return <CMSHeaderSectionWrapper key={item.id} data={item.data as CMSHeaderSectionInterface} />;
                                case 'slim_left_text_section':
                                    return <CMSTextSectionWrapper key={item.id} data={item.data as CMSTextSectionInterface} justify="left" />;
                                case 'slim_center_text_section':
                                    return <CMSTextSectionWrapper key={item.id} data={item.data as CMSTextSectionInterface} justify="center" />;
                                case 'slim_right_text_section':
                                    return <CMSTextSectionWrapper key={item.id} data={item.data as CMSTextSectionInterface} justify="right" />;
                                case 'wide_call_to_action_section':
                                    return <CMSCallToActionSectionWrapper key={item.id} data={item.data as CMSCallToActionSectionInterface} />;
                                case 'wide_statement_section':
                                    return <CMSStatementSectionWrapper key={item.id} data={item.data as CMSStatementSectionInterface} />;
                                case 'slim_button_section':
                                    return <CMSButtonSectionWrapper key={item.id} data={item.data as CMSButtonSectionInterface} />
                                case 'slim_youtube':
                                    return <CMSSlimYouTubePlayerSectionWrapper key={item.id} video={item.data as CMSYouTubePlayerInterface} />
                                case 'slim_articles_list':
                                    return <CMSArticlesListSectionWrapper key={item.id} data={item.data as CMSArticlesInterface} />
                                case 'slim_products_list':
                                    return <CMSProductsListSectionWrapper key={item.id} data={item.data as CMSProductsInterface} />
                                case 'slim_article_groups_list':
                                    return <CMSArticleGroupsListSectionWrapper key={item.id} article_groups={item.data as CMSArticleGroupsInterface} />
                                case 'slim_product_groups_list':
                                    return <CMSProductGroupsListSectionWrapper key={item.id} product_groups={item.data as CMSProductGroupsInterface} />
                            }
                        })
                    }
                </div>
            </article>
        </>
    );
}