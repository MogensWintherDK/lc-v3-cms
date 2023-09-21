import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import { CMSFirestore } from './FirebaseService';
import { CMSContent } from '../utils/CMSContent';

export interface CMSArticlePathInterface {
    params: {},
}

export interface CMSArticlePathsInterface {
    paths: CMSArticlePathInterface[],
}

export interface CMSHeaderSectionInterface {
    id?: string,
    value: string,
}

export interface CMSTextSectionInterface {
    id?: string,
    value: string,
}

export interface CMSCallToActionSectionInterface {
    id?: string,
    class: string
    header: string,
    text?: string,
    link_text: string,
    link_href: string,
}

export interface CMSStatementSectionInterface {
    id?: string,
    class?: string
    header: string,
    text?: string,
    footer?: string,
}

export interface CMSButtonSectionInterface {
    id?: string,
    link_text: string,
    link_href: string,
}

export interface CMSMetadataInterface {
    title: string,
    description: string,
    keywords?: string,
}

export interface CMSArticleInterface {
    id: string;
    name: string;
    name_sub?: string;
    teaser: string;
    type: string;
    path: string;
    content?: any;
    //page_image: string;
    page_image_url: string; // Resolved from Firebase storage 
    status: string;
    metadata?: CMSMetadataInterface;
    created_on?: Date;
    updated_on?: Date;
}

export interface CMSArticlesInterface {
    articles: CMSArticleInterface[];
}

export interface CMSArticleGroupInterface {
    id: string;
    name: string;
    long_text: string;
    path: string;
}

export interface CMSArticleGroupsInterface {
    article_groups: CMSArticleGroupInterface[];
}

export const getCMSArticlePaths = async (): Promise<CMSArticlePathsInterface> => {

    const q = query(
        collection(CMSFirestore, 'articles'),
        where('type', '==', 'article'),
        where('published', '==', true),
        where('render_static', '==', true)
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const data: CMSArticlePathInterface = { params: { id: doc.id, slug: doc.data()['slug'] } };
            return data;

        })
    );
    return { paths: items };
};

export const getCMSArticles = async (articleType = 'article'): Promise<CMSArticlesInterface> => {
    const q = query(
        collection(CMSFirestore, 'articles'),
        where('type', '==', articleType),
        where('published', '==', true),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, page_image, content, metadata, ...dataWithoutContent } = doc.data();
            const formattedData: CMSArticleInterface = {
                id: doc.id,
                name: dataWithoutContent.name || '',
                teaser: dataWithoutContent.teaser || '',
                type: dataWithoutContent.type || '',
                path: dataWithoutContent.path || '',
                page_image_url: dataWithoutContent.page_image_url,
                status: dataWithoutContent.status || '',
                created_on: created_on ? created_on.toDate().toISOString() : new Date().toISOString(),
                updated_on: updated_on ? updated_on.toDate().toISOString() : new Date().toISOString(),
            };
            return formattedData;
        })
    );

    return { articles: items };
};

export const getCMSArticleGroups = async (): Promise<CMSArticleGroupsInterface> => {
    const q = query(
        collection(CMSFirestore, 'article_groups'),
        where('published', '==', true),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const formattedData: CMSArticleGroupInterface = {
                id: doc.id,
                name: doc.data().name || '',
                long_text: doc.data().long_text || '',
                path: doc.data().path || '#',
            };
            return formattedData;
        })
    );
    return { article_groups: items };
};

export const getCMSArticlesByGroup = async (article_group: string): Promise<CMSArticlesInterface> => {
    const q = query(
        collection(CMSFirestore, 'articles'),
        where('type', '==', 'article'),
        where('published', '==', true),
        //    where('article_group', '==', article_group)
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, page_image, content, metadata, ...dataWithoutContent } = doc.data();
            const formattedData: CMSArticleInterface = {
                id: doc.id,
                name: dataWithoutContent.name || '',
                teaser: dataWithoutContent.teaser || '',
                type: dataWithoutContent.type || '',
                path: dataWithoutContent.path || '',
                page_image_url: dataWithoutContent.page_image_url,
                status: dataWithoutContent.status || '',
                created_on: created_on ? created_on.toDate().toISOString() : new Date().toISOString(),
                updated_on: updated_on ? updated_on.toDate().toISOString() : new Date().toISOString(),
            };
            return formattedData;
        })
    );

    return { articles: items };
};

export const getCMSArticle = async (id: string): Promise<CMSArticleInterface | null> => {
    const snapshot = await getDoc(doc(CMSFirestore, 'articles', id));
    if (snapshot.exists()) {
        const { page_image, link, content, article_group, ...data } = snapshot.data();
        const formattedData = {
            ...data,
            content: await CMSContent(content),
            created_on: (data.created_on ? data.created_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
            updated_on: (data.updated_on ? data.updated_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
        };
        return formattedData as CMSArticleInterface;
    }
    return null;
};

export const getCMSArticleByType = async (articleType: string): Promise<CMSArticleInterface> => {
    const q = query(
        collection(CMSFirestore, 'articles'),
        where('type', '==', articleType),
        where('published', '==', true),
        limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const { page_image, link, content, article_group, ...data } = snapshot.docs[0].data();
        const formattedData = {
            ...data,
            content: await CMSContent(content),
            created_on: (data.created_on ? data.created_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
            updated_on: (data.updated_on ? data.updated_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
        };
        return formattedData as CMSArticleInterface;
    }
    return {} as CMSArticleInterface;
};