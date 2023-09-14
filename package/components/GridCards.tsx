import React from 'react';
import { useRouter } from "next/router";
import Image from 'next/image';
import Link from 'next/link';
import { ProductType } from '../services/ProductsService';
import { TeaserImageInterface } from '../services/TeasersService';

export const TeaserProductGridCard = ({ product }: { product: ProductType }) => {

    const router = useRouter();

    const clickHandler = (event: React.MouseEvent<HTMLDivElement>, path: string) => {
        event.preventDefault();
        router.push(path);
    };

    return (
        <div key={product.id} className="TeaserProductGridCard cursor-pointer " onClick={(e: React.MouseEvent<HTMLDivElement>) => clickHandler(e, product.path)}>
            <div className='bg-white'>
                <Image
                    className='p-4 w-full'
                    src={product.main_image_url}
                    alt={product.name}
                    width='340'
                    height='264' />
            </div>
            <div className='p-4 text-center'>
                <div className='w-full text-2xl font-bold'>{product.name}</div>
                <div className='mt-1 text-md'>{product.short_text}</div>
            </div >
        </div>
    );
};



export const TeaserImageGridCard = ({ image }: { image: TeaserImageInterface }) => {
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
                <Link className='block mt-2' href={`${image.link_href}`}>{image.link_text}</Link>
            </div >
        </div>
    );
}
