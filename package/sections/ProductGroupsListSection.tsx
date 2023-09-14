import { ProductGroupType } from '../services/ProductsService'
import { TwoGrid, MarkdownGridCard, hasNoItems, HeaderSection } from '@mogenswintherdk/lc-v3-nextjs';
import { ProductGroupsType } from '../services/ProductsService';

export function ProductGroupsListSection({ product_groups }: ProductGroupsType) {
    if (hasNoItems(product_groups)) {
        return <HeaderSection text='Ups ... no articles found' />
    }

    return (
        <section className="ArticleListView">
            <TwoGrid>
                {
                    product_groups.map((product_group: ProductGroupType) => (
                        <MarkdownGridCard
                            key={product_group.id}
                            header={product_group.name}
                            markdown={product_group.long_text}
                            link_href={product_group.path}
                            link_text='Se mere'
                            styling='bg-white'
                        />
                    ))
                }
            </TwoGrid>
        </section>
    );
}