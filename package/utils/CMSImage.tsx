import { firebase, firestore } from '../services/FirebaseService';
import { DocumentReference, doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { DocumentData } from 'firebase/firestore';

const CMSImage = async (image: DocumentReference): Promise<string> => {
    const snapshot: DocumentSnapshot<DocumentData> = await getDoc(doc(firestore, 'images', image.id));
    if (!snapshot.exists()) {
        return '/images/blur.png';
    }
    const src = snapshot.data().image;
    const storage = getStorage(firebase);
    const pathReference = ref(storage, '/' + src);
    return await getDownloadURL(pathReference);
};

export default CMSImage;