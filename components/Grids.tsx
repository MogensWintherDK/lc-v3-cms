import { CMSImageProductSmall } from './Images';
import { CMSTeaserProductGridCard } from './GridCards';
import {
    CMSProductInterface,
    CMSProductsInterface,
    CMSProductImageInterface,
    CMSProductImagesInterface,
} from '../services/ProductsService';

// TODO: Needs refactoring to use children
interface RelatedImagesGridInterface {
    product_images: CMSProductImagesInterface;
}

export function CMSRelatedImagesGrid({ product_images }: RelatedImagesGridInterface): React.JSX.Element {
    return (
        <section className="RelatedImagesGrid">
            {
                product_images && product_images.length > 0 && (
                    <div className="w-full mt-4 p-2 bg-theme-g-1 grid grid-flow-col overflow-auto gap-2 justify-center">
                        {
                            product_images.map((product_image: CMSProductImageInterface) => (
                                <CMSImageProductSmall key={product_image.id} product_image={product_image} />
                            ))
                        }
                    </div>
                )
            }
        </section>

    );
}


// TODO: Needs refactoring to use children
export function CMSTeaserProductGrid({ products }: CMSProductsInterface): React.JSX.Element {
    return (
        <section className="TeaserProductGrid mt-8 flex justify-center relative text-md Slim">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {
                    products.map((product: CMSProductInterface) => (
                        <CMSTeaserProductGridCard key={product.id} product={product} />
                    ))
                }
            </div>
        </section>
    );
}