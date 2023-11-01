import { collection, getDocs, query, where, DocumentReference } from 'firebase/firestore';
import { LNXStack } from '../../lib-lnx/utils';
import { CMSFirestore } from '../services/FirebaseService';
import { ICMSImage } from '../types/CMSImage';
import { CMSTeaserInterface } from '../services/TeasersService';
import { CMSArticleInterface } from '../services/ArticleService';
import { CMSProductInterface } from '../services/ProductsService';
export interface CMSItemInterface {
    id: string,
    type: string,
    items?: any[],
    data?: any,
}

export interface CMSItemListInterface extends CMSItemInterface {
    id: string,
    type: string,
    items: any[],
}

export interface CMSItemDataInterface extends CMSItemInterface {
    id: string,
    type: string,
    data: any
}

export const CMSContent = async (content: Array<any>): Promise<any> => {

    const output: CMSItemListInterface = { id: 'root', type: 'article', items: [] };
    const stack = new LNXStack<CMSItemInterface>();

    // We push in our output list object as the root of the stack. All items not in a separate root
    // will be in this list
    stack.push(output);

    const traverseContent = (content: any, callback: (value: any, stack: LNXStack<CMSItemInterface>, key?: string | number, parent?: any) => void, parent?: any, key?: string | number) => {
        // Root level array
        if (Array.isArray(content)) {
            content.forEach((value, index) => {
                traverseContent(value, callback, content, index);
            });
        }
        // Handling of CMS elements with an array
        else if (typeof content === 'object' && content !== null && content.type && Array.isArray(content.value)) {

            callback(content, stack, key!, parent!);
            content.value.forEach((value: any, index: any) => traverseContent(value, callback, content, index));
            // Pop the stack to make sure we have no other list elements, we do need to keep
            // the root element, so we check the size to prevent popping root
            if (stack.size() > 1) {
                stack.pop();
            }
        }
        // Handling of CMS objects with a type parameter defined
        else if (typeof content === 'object' && content !== null && content.type && !['document', 'firestore'].includes(content.type)) {
            callback(content, stack, key!, parent!);
            Object.entries(content).forEach(([key, value]) => traverseContent(value, callback, content, key));
        }

    };

    // 1th traverse where we get all unique product/image/teaser IDs referenced by the pages
    const articleIds = new Set<string>();
    const productIds = new Set<string>();
    const imageIds = new Set<string>();
    const teaserIds = new Set<string>();
    const articleTags = new Set<string>();
    const productTags = new Set<string>();

    traverseContent(content, (entity, stack, output) => {
        if (entity.value instanceof DocumentReference && entity.value.path.startsWith('articles/')) {
            articleIds.add(entity.value.id);
        }
        else if (entity.value instanceof DocumentReference && entity.value.path.startsWith('products/')) {
            productIds.add(entity.value.id);
        }
        else if (entity.value instanceof DocumentReference && entity.value.path.startsWith('images/')) {
            imageIds.add(entity.value.id);
        }
        else if (entity.value.image && entity.value.image instanceof DocumentReference && entity.value.image.path.startsWith('images/')) {
            imageIds.add(entity.value.image.id);
        }
        else if (entity.value instanceof DocumentReference && entity.value.path.startsWith('teasers/')) {
            teaserIds.add(entity.value.id);
        }
        else if (entity.value && Array.isArray(entity.value) && entity.type == 'slim_articles_list') {
            entity.value.forEach((articleRef: any) => {
                if (articleRef instanceof DocumentReference) {
                    articleIds.add(articleRef.id);
                }
            });
        }
        else if (entity.value && Array.isArray(entity.value) && entity.type == 'slim_products_list') {
            entity.value.forEach((productRef: any) => {
                if (productRef instanceof DocumentReference) {
                    productIds.add(productRef.id);
                }
            });
        }
        else if (entity.value && Array.isArray(entity.value) && entity.type == 'slim_products_tag_list') {
            entity.value.forEach((tag: any) => {
                productTags.add(tag);
            });
        }
        else if (entity.value && Array.isArray(entity.value) && entity.type == 'slim_articles_tag_list') {
            entity.value.forEach((tag: any) => {
                articleTags.add(tag);
            });
        }
    });

    // Fetch only the articles that are referenced by the pages
    let articlesById: CMSArticleInterface[] = [];
    if (articleIds.size > 0) {
        const articlesCollection = collection(CMSFirestore, 'articles');
        const articlesQuery = query(articlesCollection, where('__name__', 'in', Array.from(articleIds)));
        const articlesSnapshot = await getDocs(articlesQuery);
        articlesById = articlesSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || '',
            teaser: doc.data().teaser || '',
            type: doc.data().type || '',
            path: doc.data().slug || '',
            page_image_url: doc.data().page_image_url || '',
            status: doc.data().status || '',
            created_on: doc.data().created_on ? doc.data().created_on.toDate().toISOString() : new Date().toISOString(),
            updated_on: doc.data().updated_on ? doc.data().updated_on.toDate().toISOString() : new Date().toISOString(),
        })) as CMSArticleInterface[];
    }

    // Fetch only the products that are referenced by the pages
    let productsById: CMSProductInterface[] = [];
    if (productIds.size > 0) {
        const productsCollection = collection(CMSFirestore, 'products');
        const productsQuery = query(productsCollection, where('__name__', 'in', Array.from(productIds)));
        const productsSnapshot = await getDocs(productsQuery);
        productsById = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            path: doc.data().slug,
            name: doc.data().name,
            short_text: doc.data().short_text,
            main_image_url: doc.data().main_image_url,
        })) as CMSProductInterface[];
    }

    // Fetch only the images that are referenced by the pages
    let images: ICMSImage[] = [];
    if (imageIds.size > 0) {
        const imagesCollection = collection(CMSFirestore, 'images');
        const imagesQuery = query(imagesCollection, where('__name__', 'in', Array.from(imageIds)));
        const imagesSnapshot = await getDocs(imagesQuery);
        images = imagesSnapshot.docs.map((doc) => ({
            id: doc.id,
            image_url: doc.data().image_url,
            image_alt: doc.data().alt,
            size_type: doc.data().size_type,
        })) as ICMSImage[];
    }

    // Fetch only the teasers that are referenced by the pages
    let teasers: CMSTeaserInterface[] = [];
    if (teaserIds.size > 0) {
        const teasersCollection = collection(CMSFirestore, 'teasers');
        const teasersQuery = query(teasersCollection,
            where('__name__', 'in', Array.from(teaserIds))
        );
        const teasersSnapshot = await getDocs(teasersQuery);
        teasers = teasersSnapshot.docs.map((doc) => ({
            id: doc.id,
            image_url: doc.data().image_url,
            image_alt: doc.data().image_alt,
            link_href: doc.data().link_href,
            link_text: doc.data().link_text,
            header: doc.data().header,
            text: doc.data().text,
        })) as CMSTeaserInterface[];
    }

    let productsByTag: CMSProductInterface[] = [];
    if (productTags.size > 0) {
        const myCollection = collection(CMSFirestore, 'products');
        const myQuery = query(myCollection,
            where('published', '==', true),
            where('tags', 'array-contains-any', Array.from(productTags))
        );
        const mySnapshot = await getDocs(myQuery);
        productsByTag = mySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || '',
            path: doc.data().slug || '',
            tags: doc.data().tags || [],
            main_image_url: doc.data().main_image_url,
            created_on: doc.data().created_on ? doc.data().created_on.toDate().toISOString() : new Date().toISOString(),
            updated_on: doc.data().updated_on ? doc.data().updated_on.toDate().toISOString() : new Date().toISOString(),
        })) as CMSProductInterface[];
    }

    let articlesByTag: CMSArticleInterface[] = [];
    if (articleTags.size > 0) {
        const myCollection = collection(CMSFirestore, 'articles');
        const myQuery = query(myCollection,
            where('published', '==', true),
            where('tags', 'array-contains-any', Array.from(articleTags))
        );
        const mySnapshot = await getDocs(myQuery);
        articlesByTag = mySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || '',
            teaser: doc.data().teaser || '',
            type: doc.data().type || '',
            path: doc.data().slug || '',
            tags: doc.data().tags || [],
            page_image_url: doc.data().page_image_url || '',
            status: doc.data().status || '',
            created_on: doc.data().created_on ? doc.data().created_on.toDate().toISOString() : new Date().toISOString(),
            updated_on: doc.data().updated_on ? doc.data().updated_on.toDate().toISOString() : new Date().toISOString(),
        })) as CMSArticleInterface[];
    }

    // Get all unique product/image/teaser IDs referenced by the pages
    const articleMap = new Map(articlesById.map((article) => [article.id, article]));
    const productMap = new Map(productsById.map((product) => [product.id, product]));
    const imageMap = new Map(images.map((image) => [image.id, image]));
    const teaserMap = new Map(teasers.map((teaser) => [teaser.id, teaser]));

    // 2th traverse where we build the output structure with a combination of original data
    // and the data looked up from the database
    traverseContent(content, (entry, stack) => {
        let item: CMSItemInterface = {
            id: (entry.value.id ? entry.value.id : Math.floor(Math.random() * 1000000)),
            type: entry.type,
            data: {},
        };

        let parent: CMSItemInterface | null = stack.peek();
        if (entry.value instanceof DocumentReference && entry.value.path.startsWith('products/')) {
            item.data = productMap.get(entry.value.id);
        }
        else if (entry.value instanceof DocumentReference && entry.value.path.startsWith('images/')) {
            item.data = imageMap.get(entry.value.id);
        }
        else if (entry.value.image instanceof DocumentReference && entry.value.image.path.startsWith('images/')) {
            item.data = imageMap.get(entry.value.image.id);
        }
        else if (entry.value instanceof DocumentReference && entry.value.path.startsWith('teasers/')) {
            item.data = teaserMap.get(entry.value.id);
        }
        else if (entry.type == 'slim_articles_list' && Array.isArray(entry.value)) {
            item.data = { articles: [] }
            entry.value.map((articleRef: DocumentReference) => {
                item.data.articles.push(articleMap.get(articleRef.id));
            })
        }
        else if (entry.type == 'slim_products_list' && Array.isArray(entry.value)) {
            item.data = { products: [] }
            entry.value.map((productRef: DocumentReference) => {
                item.data.products.push(productMap.get(productRef.id));
            })
        }
        else if (entry.type == 'slim_products_tag_list' && Array.isArray(entry.value)) {
            item.data = { products: [] }
            productsByTag.map((product) => {
                if (product.tags && product.tags.some(tag => entry.value.includes(tag))) {
                    item.data.products.push(product);
                }
            })
        }
        else if (entry.type == 'slim_articles_tag_list' && Array.isArray(entry.value)) {
            item.data = { articles: [] }
            articlesByTag.map((article) => {
                if (article.tags && article.tags.some(tag => entry.value.includes(tag))) {
                    item.data.articles.push(article);
                }
            })
        }
        // Any simple object - We keep the data
        else if (entry.type && !Array.isArray(entry.value) && entry.value instanceof Object) {
            item.data = entry.value;
        }
        // Any simple object - We keep the data
        else if (entry.type && !Array.isArray(entry.value)) {
            item.data = entry;
        }
        // Any containing object - We just maintain the stack
        else if (entry.type && Array.isArray(entry.value)) {
            item.items = [];
            stack.push(item);
        }
        // Some elements like an image can have a link next to it - We add merge the link, the same for header and text
        if (entry.value.link_href && item.data) {
            item.data.link_href = entry.value.link_href;
        }
        if (entry.value.header && item.data) {
            item.data.header = entry.value.header;
        }
        if (entry.value.text && item.data) {
            item.data.text = entry.value.text;
        }

        if (parent && parent.items) {
            parent.items.push(item);
        }
    });
    return output;
};