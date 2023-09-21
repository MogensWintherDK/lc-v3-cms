import { LNXHeaderSection } from '../../lib-lnx/components';
import { hasLNXNoItems } from '../../lib-lnx/utils';
import { CMSArticleInterface } from '../services/ArticleService';
import { CMSTeaserList, CMSTeaserTextItem } from '../../lib-cms/components/Teasers';

export function CMSArticlesListSection({ data }: { data: any }): React.JSX.Element {
    let key = 0;

    if (hasLNXNoItems(data.articles)) {
        return <LNXHeaderSection text='Ups ... no articles found' />
    }

    return (
        <section className="ArticleListView">
            <CMSTeaserList>
                {
                    data.articles.map((article: CMSArticleInterface) => (
                        <CMSTeaserTextItem key={key++} id={article.id} header={article.name} markdown={article.teaser} path={article.path} />
                    ))
                }
            </CMSTeaserList>
        </section>
    );
}