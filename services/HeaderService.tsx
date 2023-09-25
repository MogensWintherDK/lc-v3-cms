import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { LNXLinkInterface } from '../../lib-lnx/types';
import { CMSFirestore } from './FirebaseService';

export interface CMSHeaderDataInterface {
    id: string;
    name: string;
    class: string;
    logo: {
        link_href: string;
        image_path: string;
    };
    published?: boolean;
    navigation_links?: LNXLinkInterface[];
    action_links?: LNXLinkInterface[];
};

export const getCMSHeaderData = async (): Promise<CMSHeaderDataInterface> => {
    const q = query(collection(CMSFirestore, 'headers'), where('published', '==', true), limit(1));
    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];

    if (doc.exists()) {
        const headerData: CMSHeaderDataInterface = {
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
