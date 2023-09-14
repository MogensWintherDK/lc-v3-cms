import { firestore } from './FirebaseService';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import { CMSContent } from '../utils/CMSContent';

export type ArticlePathType = {
    params: {},
}

export type ArticlePathsType = {
    paths: ArticlePathType[],
}

export interface HeaderSectionInterface {
    id?: string,
    value: string,
}

export interface TextSectionInterface {
    id?: string,
    value: string,
}

export interface CallToActionSectionInterface {
    id?: string,
    class: string
    header: string,
    text?: string,
    link_text: string,
    link_href: string,
}

export interface StatementSectionInterface {
    id?: string,
    class?: string
    header: string,
    text?: string,
    footer?: string,
}

export interface ButtonSectionInterface {
    id?: string,
    link_text: string,
    link_href: string,
}

export interface MetadataInterface {
    title: string,
    description: string,
    keywords?: string,
}

export type ArticleType = {
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
    metadata?: MetadataInterface;
    created_on?: Date;
    updated_on?: Date;
}

export type ArticlesType = {
    articles: ArticleType[];
}

export type ArticleGroupType = {
    id: string;
    name: string;
    long_text: string;
    path: string;
}

export type ArticleGroupsType = {
    article_groups: ArticleGroupType[];
}

export const getArticlePaths = async (): Promise<ArticlePathsType> => {

    const q = query(
        collection(firestore, 'articles'),
        where('type', '==', 'article'),
        where('published', '==', true),
        where('render_static', '==', true)
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const data: ArticlePathType = { params: { id: doc.id, slug: doc.data()['slug'] } };
            return data;

        })
    );
    return { paths: items };
};

export const getArticles = async (articleType = 'article'): Promise<ArticlesType> => {
    const q = query(
        collection(firestore, 'articles'),
        where('type', '==', articleType),
        where('published', '==', true),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, page_image, content, metadata, ...dataWithoutContent } = doc.data();
            const formattedData: ArticleType = {
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

export const getArticleGroups = async (): Promise<ArticleGroupsType> => {
    const q = query(
        collection(firestore, 'article_groups'),
        where('published', '==', true),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const formattedData: ArticleGroupType = {
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

export const getArticlesByGroup = async (article_group: string): Promise<ArticlesType> => {
    const q = query(
        collection(firestore, 'articles'),
        where('type', '==', 'article'),
        where('published', '==', true),
        //    where('article_group', '==', article_group)
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, page_image, content, metadata, ...dataWithoutContent } = doc.data();
            const formattedData: ArticleType = {
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

export const getArticle = async (id: string): Promise<ArticleType | null> => {
    const snapshot = await getDoc(doc(firestore, 'articles', id));
    if (snapshot.exists()) {
        const { page_image, link, content, article_group, ...data } = snapshot.data();
        const formattedData = {
            ...data,
            content: await CMSContent(content),
            created_on: (data.created_on ? data.created_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
            updated_on: (data.updated_on ? data.updated_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
        };
        return formattedData as ArticleType;
    }
    return null;
};

export const getArticleByType = async (articleType: string): Promise<ArticleType> => {
    const q = query(
        collection(firestore, 'articles'),
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
        return formattedData as ArticleType;
    }
    return {} as ArticleType;
};