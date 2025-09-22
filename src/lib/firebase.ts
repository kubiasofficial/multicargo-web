import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:dummy',
};

// Only initialize Firebase if we have proper config
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
                      !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('dummy');

// Initialize Firebase
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (hasValidConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  // During build time, create mock instances
  console.warn('Firebase not initialized - missing environment variables');
}

// Helper function to get Firebase db with proper error handling
export const getFirebaseDb = (): Firestore => {
  if (!db) {
    throw new Error('Firebase not initialized - check environment variables');
  }
  return db;
};

// Helper function to get Firebase auth with proper error handling
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    throw new Error('Firebase not initialized - check environment variables');
  }
  return auth;
};

// Initialize Firebase services
export { db, auth };

export default app;