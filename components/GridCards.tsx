import React from 'react';
import { useRouter } from 'next/router';
import { LNXLink, LNXImage } from '../../lib-lnx/components';
import { CMSProductInterface } from '../services/ProductsService';
import { CMSTeaserImageInterface } from '../services/TeasersService';

export function CMSTeaserProductGridCard({ product }: { product: CMSProductInterface }): React.JSX.Element {
    const router = useRouter();
    const clickHandler = (event: React.MouseEvent<HTMLDivElement>, path: string) => {
        event.preventDefault();
        router.push(path);
    };

    return (
        <div className='TeaserProductGridCard'>
            <div key={product.id} className='cursor-pointer' onClick={(e: React.MouseEvent<HTMLDivElement>) => clickHandler(e, product.path)}>
                <div className='bg-white'>
                    {product.main_image_url && (
                        <LNXImage
                            className='p-4 w-full'
                            src={product.main_image_url}
                            alt={product.name}
                            width='340'
                            height='264' />
                    ) || (
                            <div className='w-full h-[264px] bg-theme-g-1 flex items-center justify-center'>Image not configured.</div>
                        )}

                </div>
                <div className='p-4 text-center'>
                    <div className='w-full text-2xl font-bold'>{product.name}</div>
                    <div className='mt-1 text-md'>{product.short_text}</div>
                </div >
            </div>
        </div>
    );
};



export function CMSTeaserImageGridCard({ image }: { image: CMSTeaserImageInterface }): React.JSX.Element {
    const router = useRouter();

    const clickHandler = (event: React.MouseEvent<HTMLDivElement>, path: string) => {
        event.preventDefault();
        router.push(path);
    };

    return (
        <div className="TeaserImageGridCard flex flex-col mx-auto items-center cursor-pointer" onClick={(e: React.MouseEvent<HTMLDivElement>) => clickHandler(e, image.link_href)}>
            <div className="bg-white inline-flex">
                <img className='p-4' src={`${image.image_url}`} />

            </div>
            <div className='p-4 text-center'>
                <div className='text-2xl font-bold'>{image.header}</div>
                <div className='mt-2 text-md'>{image.text}</div>
                <LNXLink className='block mt-2' href={`${image.link_href}`}>{image.link_text}</LNXLink>
            </div >
        </div>
    );
}
