import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { CMSFirestore } from './FirebaseService';

export interface CMSTeaserImageInterface {
    id?: string,
    image_url: string,
    image_alt: string,
    link_href: string,
    link_text: string,
    header: string,
    text: string,
}

export interface CMSTeaserInterface {
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

export interface CMSTeasersInterface {
    teasers: CMSTeaserInterface[];
}

export const getAllTeasers = async () => {
    const snapshot = await getDocs(collection(CMSFirestore, 'teasers'));
    const items = snapshot.docs.map((doc) => ({ data: { id: doc.id, ...doc.data() } }));
    return items;
};

export const getTeaser = async (id: string) => {
    const snapshot = await getDoc(doc(CMSFirestore, 'teasers', id));
    if (snapshot.exists()) {
        return snapshot.data();
    }
    return [];
}