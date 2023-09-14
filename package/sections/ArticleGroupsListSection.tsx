import { ArticleGroupType, ArticleGroupsType } from '../services/ArticleService'
import { HeaderSection } from '@mogenswintherdk/lc-v3-nextjs'
import { TwoGrid, MarkdownGridCard, hasNoItems } from '@mogenswintherdk/lc-v3-nextjs';

export function ArticleGroupsListSection({ article_groups }: ArticleGroupsType) {

    if (hasNoItems(article_groups)) {
        return <HeaderSection text='Ups ... no articles found' />
    }

    return (
        <section className="ArticleListView">
            <TwoGrid>
                {
                    article_groups.map((article_group: ArticleGroupType) => (
                        <MarkdownGridCard
                            key={article_group.id}
                            header={article_group.name}
                            markdown={article_group.long_text}
                            link_href={article_group.path}
                            link_text='Se mere'
                            styling='bg-white'
                        />
                    ))
                }
            </TwoGrid>
        </section>
    );
}