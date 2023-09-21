import { LNXImage } from '../../lib-lnx/components';
import { CMSProductImageInterface } from '../services/ProductsService';

export function CMSImageProductSmall({ product_image }: { product_image: CMSProductImageInterface }): React.JSX.Element {
    return (
        <div key={product_image.id} className="ProductImageSmall cursor-pointer">
            <div className='Frame'>
                <div className='Image'>
                    <LNXImage
                        src={product_image.image_url}
                        alt={product_image.alt}
                        width='136'
                        height='0' />
                </div>

            </div >
        </div>
    );
};