import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Ensure you add these values in your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "muwamah-79ce3.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "muwamah-79ce3",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "muwamah-79ce3.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only if API Key is present (prevents crashes during early setup)
const app = !getApps().length && firebaseConfig.apiKey ? initializeApp(firebaseConfig) : getApp();
const auth = firebaseConfig.apiKey ? getAuth(app) : null;
const db = firebaseConfig.apiKey ? getFirestore(app) : null;

export { app, auth, db, firebaseConfig };
