import { HeaderSection, hasNoItems } from '@mogenswintherdk/lc-v3-nextjs'
import { TeaserProductGrid } from '../components/Grids';

export function ProductsListSection({ data }: { data: any }) {

    if (hasNoItems(data.products)) {
        return <HeaderSection text='Ups ... no products found' />
    }

    return (
        <section className="ProductListView">
            <TeaserProductGrid products={data.products} />
        </section>
    );
}