import { firestore } from './FirebaseService';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { LinkType } from '@mogenswintherdk/lc-v3-nextjs';


export type FooterDataType = {
    id: string;
    name: string;
    class: string;
    logo: {
        link_href: string;
        icon_class: string;
    };
    published?: boolean;
    navigation_links?: LinkType[];
    info_links?: LinkType[];
    social_links?: LinkType[];
};

export const getFooterData = async (): Promise<FooterDataType> => {
    const q = query(collection(firestore, 'footers'), where('published', '==', true), limit(1));
    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];

    if (doc && doc.exists()) {
        const headerData: FooterDataType = {
            id: doc.id,
            name: doc.data.name,
            class: doc.data().class,
            logo: doc.data().logo,
            ...doc.data()
        };

        return headerData;
    } else {
        throw new Error('No footer data found');
    }
};
