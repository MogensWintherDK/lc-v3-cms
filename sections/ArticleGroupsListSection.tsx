import {
    CMSArticleGroupInterface,
    CMSArticleGroupsInterface,
} from '../services/ArticleService'
import {
    LNXTwoGrid,
    LNXMarkdownGridCard,
    LNXHeaderSection,
} from '../../lib-lnx/components';
import { hasLNXNoItems } from '../../lib-lnx/utils';

export function CMSArticleGroupsListSection({ article_groups }: CMSArticleGroupsInterface): React.JSX.Element {

    if (hasLNXNoItems(article_groups)) {
        return <LNXHeaderSection text='Ups ... no articles found' />
    }

    return (
        <section className="CMSArticleListView">
            <LNXTwoGrid>
                {
                    article_groups.map((article_group: CMSArticleGroupInterface) => (
                        <LNXMarkdownGridCard
                            key={article_group.id}
                            header={article_group.name}
                            markdown={article_group.long_text}
                            link_href={article_group.path}
                            link_text='Se mere'
                            styling='bg-white'
                        />
                    ))
                }
            </LNXTwoGrid>
        </section>
    );
}