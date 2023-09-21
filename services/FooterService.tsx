import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { LNXLinkInterface } from '../../lib-lnx/components';
import { CMSFirestore } from './FirebaseService';


export interface CMSFooterDataInterface {
    id: string;
    name: string;
    class: string;
    logo: {
        link_href: string;
        icon_class: string;
    };
    published?: boolean;
    navigation_links?: LNXLinkInterface[];
    info_links?: LNXLinkInterface[];
    social_links?: LNXLinkInterface[];
};

export const getCMSFooterData = async (): Promise<CMSFooterDataInterface> => {
    const q = query(collection(CMSFirestore, 'footers'), where('published', '==', true), limit(1));
    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];

    if (doc && doc.exists()) {
        const headerData: CMSFooterDataInterface = {
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
