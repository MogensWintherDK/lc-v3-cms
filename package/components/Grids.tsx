import React from 'react';
import { ImageProductSmall } from './Image';
import { TeaserProductGridCard } from './GridCards';
import { ProductType, ProductsType } from '../services/ProductsService';
import { ProductImageType, ProductImagesType } from '../services/ProductsService';

// TODO: Needs refactoring to use children
interface RelatedImagesGridProps {
    product_images: ProductImagesType;
}
export function RelatedImagesGrid({ product_images }: RelatedImagesGridProps) {
    return (
        product_images && product_images.length > 0 && (
            <div className="w-full mt-4 p-2 bg-theme-g-1 grid grid-flow-col overflow-auto gap-2 justify-center">
                {
                    product_images.map((product_image: ProductImageType) => (
                        <ImageProductSmall key={product_image.id} product_image={product_image} />
                    ))
                }
            </div>
        )

    );
}


// TODO: Needs refactoring to use children
export function TeaserProductGrid({ products }: ProductsType) {
    return (
        <section className="mt-8 flex justify-center relative text-md Slim">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {
                    products.map((product: ProductType) => (
                        <TeaserProductGridCard key={product.id} product={product} />
                    ))
                }
            </div>
        </section>

    );
}