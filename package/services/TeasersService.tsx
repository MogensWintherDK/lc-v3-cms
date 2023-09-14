import { firestore } from './FirebaseService';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export interface TeaserImageInterface {
    id?: string,
    image_url: string,
    image_alt: string,
    link_href: string,
    link_text: string,
    header: string,
    text: string,
}

export type TeaserType = {
    id: String,
    image_url?: String,
    image_alt?: String,
    header?: String,
    text?: String,
    link_href?: String,
    link_text?: String,
    tag_text?: String,
    tag_href?: String,
}

export type TeasersType = {
    teasers: TeaserType[];
}

export const getAllTeasers = async () => {
    const snapshot = await getDocs(collection(firestore, 'teasers'));
    const items = snapshot.docs.map((doc) => ({ data: { id: doc.id, ...doc.data() } }));
    return items;
};

export const getTeaser = async (id: string) => {
    const snapshot = await getDoc(doc(firestore, 'teasers', id));
    if (snapshot.exists()) {
        return snapshot.data();
    }
    return [];
}