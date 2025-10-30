// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA7jvG8zVpyNnZgxNTaf1BDoyG1hYuXSC4",
  authDomain: "trendo-9e595.firebaseapp.com",
  projectId: "trendo-9e595",
  storageBucket: "trendo-9e595.appspot.com",
  messagingSenderId: "558264469511",
  appId: "1:558264469511:web:bd18c3496b1277f2d602a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Storage for video uploads
export const storage = getStorage(app);

export default app;
