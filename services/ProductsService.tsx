import { collection, getDocs, doc, getDoc, query, where, limit, DocumentReference } from 'firebase/firestore';
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
    path: string;
    published?: boolean;
    name: string,
    tags?: string[];
    price?: number;
    related_products?: CMSRelatedProductsInterface;
    related_images?: CMSProductImagesInterface;
    main_image_url?: string;
    short_text?: string;
    long_text?: string;
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
    path: string;
    name: string,
    main_image_url?: string;
}

export type CMSRelatedProductsInterface = CMSRelatedProductInterface[];

// Related image(s)
export type CMSProductImageInterface = {
    id: string,
    alt: string,
    image_url: string;
}
export type CMSProductImagesInterface = CMSProductImageInterface[];


export const getCMSProductPaths = async (): Promise<CMSProductPathsInterface> => {
    const q = query(
        collection(CMSFirestore, 'products'),
        where('published', '==', true),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const data: CMSProductPathInterface = {
                params: {
                    id: doc.id,
                    slug: doc.data()['slug'].split('/').pop(),
                }
            };
            return data;

        })
    );
    return { paths: items };
};

export const getCMSProducts = async (): Promise<CMSProductsInterface | null> => {
    try {
        const q = query(collection(CMSFirestore, 'products'), where('published', '==', true));
        const snapshot = await getDocs(q);
        const items = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const { created_on, updated_on, main_image, ...data } = doc.data();
                const formattedData: CMSProductInterface = {
                    id: doc.id,
                    name: data.name || '',
                    price: data.price || '',
                    published: data.published || '',
                    short_text: data.short_text || '',
                    long_text: data.long_text || '',
                    main_image_url: data.main_image_url,
                    path: data.slug || '',
                    visibility: data.visibility || '',
                    created_on: created_on ? created_on.toDate().toISOString() : new Date().toISOString(),
                    updated_on: updated_on ? updated_on.toDate().toISOString() : new Date().toISOString(),
                };
                return formattedData;
            })
        );
        return { products: items };
    } catch (e) { }
    return null;
};

export const getCMSProduct = async (id: string): Promise<CMSProductInterface | null> => {
    try {
        const snapshot = await getDoc(doc(CMSFirestore, 'products', id));
        if (snapshot.exists()) {
            const { main_image, related_products, related_images, product_group, metadata, ...data } = snapshot.data();
            const parsed_related_products = await getCMSRelatedProductsByTags(id, data.tags);
            const parsed_related_images = await getCMSRelatedImages(related_images);
            const formattedData = {
                id: snapshot.id,
                name: data.name || '',
                path: data.slug,
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

export const getCMSProductBySlug = async (slug: string, path: string = ''): Promise<CMSProductInterface | null> => {
    try {
        const fullSlug = (path != '' ? '/' + path + '/' : '') + slug;
        const q = query(
            collection(CMSFirestore, 'products'),
            where('slug', '==', fullSlug),
            where('published', '==', true),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const { main_image, related_products, related_images, product_group, metadata, ...data } = doc.data();
            const parsed_related_products = await getCMSRelatedProductsByTags(doc.id, data.tags);
            const parsed_related_images = await getCMSRelatedImages(related_images);
            const formattedData = {
                id: doc.id,
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

export const getCMSRelatedProductsByTags = async (main_product_id: string, tags: string[]): Promise<CMSRelatedProductsInterface | null> => {
    try {
        const q = query(
            collection(CMSFirestore, 'products'),
            where('published', '==', true),
            where('tags', 'array-contains-any', Array.from(tags))
        );
        const snapshot = await getDocs(q);

        const items: CMSRelatedProductInterface[] = snapshot.docs
            .filter(doc => doc.id !== main_product_id)
            .map((doc) => {
                const { created_on, updated_on, main_image, product_group, ...data } = doc.data();
                const formattedData: CMSRelatedProductInterface = {
                    id: doc.id,
                    name: data.name || '',
                    main_image_url: data.main_image_url,
                    path: data.slug || '#',
                };
                return formattedData;
            });

        return items;
    } catch (e) { }
    return null;
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