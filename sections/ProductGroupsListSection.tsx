import { LNXTwoGrid, LNXMarkdownGridCard, LNXHeaderSection } from '../../lib-lnx/components';
import { hasLNXNoItems } from '../../lib-lnx/utils';
import {
    CMSProductGroupInterface,
    CMSProductGroupsInterface,
} from '../services/ProductsService';

export function CMSProductGroupsListSection({ product_groups }: CMSProductGroupsInterface): React.JSX.Element {

    if (hasLNXNoItems(product_groups)) {
        return (<LNXHeaderSection text='Ups ... no articles found' />)
    }

    return (
        <section className="ArticleListView">
            <LNXTwoGrid>
                {
                    product_groups.map((product_group: CMSProductGroupInterface) => (
                        <LNXMarkdownGridCard
                            key={product_group.id}
                            header={product_group.name}
                            markdown={product_group.long_text}
                            link_href={product_group.path}
                            link_text='Se mere'
                            styling='bg-white'
                        />
                    ))
                }
            </LNXTwoGrid>
        </section>
    );
}