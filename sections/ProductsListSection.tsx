import { LNXHeaderSection } from '../../lib-lnx/components';
import { hasLNXNoItems } from '../../lib-lnx/utils';
import { CMSTeaserProductGrid } from '../components/Grids';

export function CMSProductsListSection({ data }: { data: any }): React.JSX.Element {

    if (hasLNXNoItems(data.products)) {
        return <LNXHeaderSection text='Ups ... no products found' />
    }

    return (
        <section className="ProductListView">
            <CMSTeaserProductGrid products={data.products} />
        </section>
    );
}