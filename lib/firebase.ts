import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
    apiKey: "AIzaSyB1Z-6249dupaupJRq__5g_NVfYriwzAzM",
    authDomain: "yoga-teacher-training-app.firebaseapp.com",
    projectId: "yoga-teacher-training-app",
    storageBucket: "yoga-teacher-training-app.firebasestorage.app",
    messagingSenderId: "892776208012",
    appId: "1:892776208012:web:a6c9aff240e35701d84da9",
    measurementId: "G-Q581HWMTFR"

};

// 1. Initialize App FIRST
const app = initializeApp(firebaseConfig);

// 2. Initialize Firestore SECOND
// If your database name in the console is "(default)", use this:
const db = getFirestore(app); 

// OR, if you found a specific ID in the console dropdown, use this:
// const db = getFirestore(app, "your-database-id"); 

export { db };