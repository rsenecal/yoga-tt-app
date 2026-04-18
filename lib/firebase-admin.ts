import admin from 'firebase-admin';

if (!admin.apps.length) {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 env var is not set');

  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const storage = admin.storage();
export const firestore = admin.firestore();
