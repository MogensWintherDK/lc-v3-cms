import { DocumentData, DocumentReference, doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { CMSFirebase, CMSFirestore } from '../services/FirebaseService';

export const CMSImage = async (image: DocumentReference): Promise<string> => {
    const snapshot: DocumentSnapshot<DocumentData> = await getDoc(doc(CMSFirestore, 'images', image.id));
    if (!snapshot.exists()) {
        return '/images/blur.png';
    }
    const src = snapshot.data().image;
    const storage = getStorage(CMSFirebase);
    const pathReference = ref(storage, '/' + src);
    return await getDownloadURL(pathReference);
};