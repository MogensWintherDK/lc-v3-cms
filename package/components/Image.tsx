import Image from 'next/image';
import { ProductImageType } from '../services/ProductsService';

export const ImageProductSmall = ({ product_image }: { product_image: ProductImageType }) => {
    return (
        <div key={product_image.id} className="ProductImageSmall cursor-pointer">
            <div className='Frame'>
                <div className='Image'>
                    <Image
                        src={product_image.image_url}
                        alt={product_image.alt}
                        width='136'
                        height='0' />
                </div>

            </div >
        </div>
    );
};