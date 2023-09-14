import { firestore } from './FirebaseService';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { LinkType } from '@mogenswintherdk/lc-v3-nextjs';

export type HeaderDataType = {
    id: string;
    name: string;
    class: string;
    logo: {
        link_href: string;
        image_path: string;
    };
    published?: boolean;
    navigation_links?: LinkType[];
    action_links?: LinkType[];
};

export const getHeaderData = async (): Promise<HeaderDataType> => {
    const q = query(collection(firestore, 'headers'), where('published', '==', true), limit(1));
    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];

    if (doc.exists()) {
        const headerData: HeaderDataType = {
            id: doc.id,
            name: doc.data.name,
            class: doc.data().class,
            logo: doc.data().logo,
            ...doc.data()
        };

        return headerData;
    } else {
        throw new Error('No header data found');
    }
};
