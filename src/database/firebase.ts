import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { FIREBASE } from '@/utils/envExporter';

const firebaseConfig = {
  apiKey: FIREBASE.FIREBASE_API,
  authDomain: FIREBASE.FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE.FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE.FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE.FIREBASE_APP_ID,
  measurementId: FIREBASE.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
});

//const analytics = getAnalytics(app);