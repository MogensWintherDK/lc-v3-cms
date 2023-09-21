import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.LC_FIREBASE_API_KEY,
    authDomain: process.env.LC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.LC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.LC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.LC_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.LC_FIREBASE_APP_ID,
    measurementId: process.env.LC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const CMSFirebase = initializeApp(firebaseConfig);
export const CMSFirestore = getFirestore(CMSFirebase);