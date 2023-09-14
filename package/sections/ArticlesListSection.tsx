import { ArticleType } from '../services/ArticleService'
import { TeaserList, TeaserTextItem } from '../components/Teasers'
import { HeaderSection, hasNoItems } from '@mogenswintherdk/lc-v3-nextjs'

export function ArticlesListSection({ data }: { data: any }) {
    let key = 0;

    if (hasNoItems(data.articles)) {
        return <HeaderSection text='Ups ... no articles found' />
    }

    return (
        <section className="ArticleListView">
            <TeaserList>
                {
                    data.articles.map((article: ArticleType) => (
                        <TeaserTextItem key={key++} id={article.id} header={article.name} markdown={article.teaser} path={article.path} />
                    ))
                }
            </TeaserList>
        </section>
    );
}