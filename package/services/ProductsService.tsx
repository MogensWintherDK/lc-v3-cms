import { firebase, firestore } from './FirebaseService';
import { collection, getDocs, doc, getDoc, query, where, DocumentReference } from 'firebase/firestore';

export type ProductPathType = {
    params: {},
}

export type ProductPathsType = {
    paths: ProductPathType[],
}
// Product(s)
export type ProductType = {
    id: string,
    name: string,
    price?: number;
    published?: boolean;
    related_products?: RelatedProductsType;
    related_images?: ProductImagesType;
    main_image_url: string;
    short_text?: string;
    long_text?: string;
    path: string;
    visibility?: string;
    created_on?: Date;
    updated_on?: Date;
}

export type ProductsType = {
    products: ProductType[],
}

// Related product(s)
export type RelatedProductType = {
    id: string,
    name: string,
    main_image_url: string;
    path: string;
}

export type RelatedProductsType = RelatedProductType[];

// Related image(s)
export type ProductImageType = {
    id: string,
    alt: string,
    image_url: string;
}
export type ProductImagesType = ProductImageType[];


export type ProductGroupType = {
    id: string;
    name: string;
    long_text: string;
    path: string;
}

export type ProductGroupsType = {
    product_groups: ProductGroupType[];
}

export const getProductPaths = async (): Promise<ProductPathsType> => {

    const q = query(
        collection(firestore, 'products'),
        where('published', '==', true),
        //     where('render_static', '==', true)
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const data: ProductPathType = { params: { id: doc.id, slug: doc.data()['slug'] } };
            return data;

        })
    );
    return { paths: items };
};

export const getProducts = async (): Promise<ProductsType> => {
    const q = query(collection(firestore, 'products'), where('published', '==', true));
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, main_image, ...dataLimited } = doc.data();
            const formattedData: ProductType = {
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

export const getProductsByGroup = async (product_group: string): Promise<ProductsType> => {
    const q = query(
        collection(firestore, 'products'),
        //where('type', '==', 'product'),
        where('published', '==', true),
        //    where('product_group', '==', product_group)
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, page_image, content, metadata, ...dataWithoutContent } = doc.data();
            const formattedData: ProductType = {
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

export const getProduct = async (id: string): Promise<ProductType | null> => {
    const snapshot = await getDoc(doc(firestore, 'products', id));
    if (snapshot.exists()) {
        const { main_image, related_products, related_images, product_group, ...data } = snapshot.data();
        // TODO: Fix the related products to search on product_group and not category
        const parsed_related_products = {};//await getRelatedProducts(id, data.category);
        const parsed_related_images = await getRelatedImages(related_images);
        const formattedData = {
            id: snapshot.id,
            name: data.name || '',
            related_products: parsed_related_products,
            related_images: parsed_related_images,
            ...data,
            created_on: (data.created_on ? data.created_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
            updated_on: (data.updated_on ? data.updated_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
        };
        return formattedData as ProductType;
    }
    return null;
};

export const getRelatedProducts = async (main_product_id: string, category: string): Promise<RelatedProductsType> => {
    const q = query(
        collection(firestore, 'products'),
        where('published', '==', true),
        where('category', '==', category),
    );
    const snapshot = await getDocs(q);

    const items: RelatedProductType[] = snapshot.docs
        .filter(doc => doc.id !== main_product_id)
        .map((doc) => {
            const { created_on, updated_on, main_image, product_group, ...dataLimited } = doc.data();
            const formattedData: RelatedProductType = {
                id: doc.id,
                name: dataLimited.name || '',
                main_image_url: dataLimited.main_image_url,
                path: dataLimited.path || '#',
            };
            return formattedData;
        });

    return items;
};

export const getRelatedImages = async (related_images: DocumentReference[]): Promise<ProductImagesType> => {
    if (related_images == undefined || related_images.length == 0) {
        return [];
    }
    const relatedImageIds = related_images.map((ref) => ref.id);
    const q = query(
        collection(firestore, 'images'),
        where('__name__', 'in', relatedImageIds),
    );
    const snapshot = await getDocs(q);
    const items: ProductImageType[] = snapshot.docs
        .map((doc) => {
            const formattedData: ProductImageType = {
                id: doc.id,
                alt: doc.data().alt || '',
                image_url: doc.data().image_url,
            };
            return formattedData;
        });

    return items;
};

export const getProductGroups = async (): Promise<ProductGroupsType> => {
    const q = query(
        collection(firestore, 'product_groups'),
        where('published', '==', true),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const formattedData: ProductGroupType = {
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