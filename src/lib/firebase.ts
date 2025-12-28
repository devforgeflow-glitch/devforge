import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Firebase Client SDK
 *
 * Configuracao do Firebase para uso no frontend.
 * Usa variaveis de ambiente NEXT_PUBLIC_*.
 * So inicializa se as chaves estiverem configuradas.
 *
 * @version 1.0.0
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Verifica se o Firebase esta configurado
 */
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
);

/**
 * Inicializa Firebase App (singleton)
 */
function initializeFirebase(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    console.warn(
      '[Firebase] Variaveis de ambiente nao configuradas. Firebase desabilitado.'
    );
    return null;
  }

  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp(firebaseConfig);
}

// Instancias singleton (podem ser null se nao configurado)
const app: FirebaseApp | null = initializeFirebase();
const auth: Auth | null = app ? getAuth(app) : null;
const db: Firestore | null = app ? getFirestore(app) : null;
const storage: FirebaseStorage | null = app ? getStorage(app) : null;

export { app, auth, db, storage, isFirebaseConfigured };
export default app;
