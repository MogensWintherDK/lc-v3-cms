import { collection, getDocs, doc, getDoc, query, where, DocumentReference } from 'firebase/firestore';
import { CMSFirestore } from './FirebaseService';
import { parseCMSMetadata } from '../utils/CMSMetadata';
import { ICMSMetadata } from '../services';

export type CMSProductPathInterface = {
    params: {},
}

export type CMSProductPathsInterface = {
    paths: CMSProductPathInterface[],
}
// Product(s)
export type CMSProductInterface = {
    id: string,
    name: string,
    price?: number;
    published?: boolean;
    related_products?: CMSRelatedProductsInterface;
    related_images?: CMSProductImagesInterface;
    main_image_url: string;
    short_text?: string;
    long_text?: string;
    path: string;
    visibility?: string;
    metadata?: ICMSMetadata;
    created_on?: Date;
    updated_on?: Date;
}

export type CMSProductsInterface = {
    products: CMSProductInterface[],
}

// Related product(s)
export type CMSRelatedProductInterface = {
    id: string,
    name: string,
    main_image_url: string;
    path: string;
}

export type CMSRelatedProductsInterface = CMSRelatedProductInterface[];

// Related image(s)
export type CMSProductImageInterface = {
    id: string,
    alt: string,
    image_url: string;
}
export type CMSProductImagesInterface = CMSProductImageInterface[];


export type CMSProductGroupInterface = {
    id: string;
    name: string;
    long_text: string;
    path: string;
}

export type CMSProductGroupsInterface = {
    product_groups: CMSProductGroupInterface[];
}

export const getCMSProductPaths = async (): Promise<CMSProductPathsInterface> => {

    const q = query(
        collection(CMSFirestore, 'products'),
        where('published', '==', true),
        //     where('render_static', '==', true)
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const data: CMSProductPathInterface = { params: { id: doc.id, slug: doc.data()['slug'] } };
            return data;

        })
    );
    return { paths: items };
};

export const getCMSProducts = async (): Promise<CMSProductsInterface> => {
    const q = query(collection(CMSFirestore, 'products'), where('published', '==', true));
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, main_image, ...dataLimited } = doc.data();
            const formattedData: CMSProductInterface = {
                id: doc.id,
                name: dataLimited.name || '',
                price: dataLimited.price || '',
                published: dataLimited.published || '',
                short_text: dataLimited.short_text || '',
                long_text: dataLimited.long_text || '',
                main_image_url: dataLimited.main_image_url,
                path: dataLimited.path || '',
                visibility: dataLimited.visibility || '',
                created_on: created_on ? created_on.toDate().toISOString() : new Date().toISOString(),
                updated_on: updated_on ? updated_on.toDate().toISOString() : new Date().toISOString(),
            };
            return formattedData;
        })
    );
    return { products: items };
};

export const getCMSProductsByGroup = async (product_group: string): Promise<CMSProductsInterface> => {
    const q = query(
        collection(CMSFirestore, 'products'),
        //where('type', '==', 'product'),
        where('published', '==', true),
        //    where('product_group', '==', product_group)
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, page_image, content, metadata, ...dataWithoutContent } = doc.data();
            const formattedData: CMSProductInterface = {
                id: doc.id,
                name: dataWithoutContent.name || '',
                path: dataWithoutContent.path || '',
                short_text: dataWithoutContent.short_text || '',
                main_image_url: dataWithoutContent.main_image_url,
                created_on: created_on ? created_on.toDate().toISOString() : new Date().toISOString(),
                updated_on: updated_on ? updated_on.toDate().toISOString() : new Date().toISOString(),
            };
            return formattedData;
        })
    );

    return { products: items };
};

export const getCMSProduct = async (id: string): Promise<CMSProductInterface | null> => {
    try {
        const snapshot = await getDoc(doc(CMSFirestore, 'products', id));
        if (snapshot.exists()) {
            const { main_image, related_products, related_images, product_group, metadata, ...data } = snapshot.data();
            // TODO: Fix the related products to search on product_group and not category
            const parsed_related_products = {};//await getRelatedProducts(id, data.category);
            const parsed_related_images = await getCMSRelatedImages(related_images);
            const formattedData = {
                id: snapshot.id,
                name: data.name || '',
                related_products: parsed_related_products,
                related_images: parsed_related_images,
                ...data,
                metadata: parseCMSMetadata(metadata),
                created_on: (data.created_on ? data.created_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
                updated_on: (data.updated_on ? data.updated_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
            };
            return formattedData as CMSProductInterface;
        }
    } catch (e) { }
    return null;
};

export const getCMSRelatedProducts = async (main_product_id: string, category: string): Promise<CMSRelatedProductsInterface> => {
    const q = query(
        collection(CMSFirestore, 'products'),
        where('published', '==', true),
        where('category', '==', category),
    );
    const snapshot = await getDocs(q);

    const items: CMSRelatedProductInterface[] = snapshot.docs
        .filter(doc => doc.id !== main_product_id)
        .map((doc) => {
            const { created_on, updated_on, main_image, product_group, ...dataLimited } = doc.data();
            const formattedData: CMSRelatedProductInterface = {
                id: doc.id,
                name: dataLimited.name || '',
                main_image_url: dataLimited.main_image_url,
                path: dataLimited.path || '#',
            };
            return formattedData;
        });

    return items;
};

export const getCMSRelatedImages = async (related_images: DocumentReference[]): Promise<CMSProductImagesInterface> => {
    if (related_images == undefined || related_images.length == 0) {
        return [];
    }
    const relatedImageIds = related_images.map((ref) => ref.id);
    const q = query(
        collection(CMSFirestore, 'images'),
        where('__name__', 'in', relatedImageIds),
    );
    const snapshot = await getDocs(q);
    const items: CMSProductImageInterface[] = snapshot.docs
        .map((doc) => {
            const formattedData: CMSProductImageInterface = {
                id: doc.id,
                alt: doc.data().alt || '',
                image_url: doc.data().image_url,
            };
            return formattedData;
        });

    return items;
};

export const getCMSProductGroups = async (): Promise<CMSProductGroupsInterface> => {
    const q = query(
        collection(CMSFirestore, 'product_groups'),
        where('published', '==', true),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const formattedData: CMSProductGroupInterface = {
                id: doc.id,
                name: doc.data().name || '',
                long_text: doc.data().long_text || '',
                path: doc.data().path || '#',
            };
            return formattedData;
        })
    );
    return { product_groups: items };
};