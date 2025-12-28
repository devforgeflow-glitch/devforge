/**
 * Firebase Admin SDK - Singleton
 *
 * Inicialização segura do Firebase Admin para uso server-side.
 *
 * @version 1.0.0
 */

import admin from 'firebase-admin';

let initialized = false;

/**
 * Inicializa Firebase Admin se ainda não foi inicializado
 */
function initializeAdmin(): void {
  if (initialized || admin.apps.length > 0) {
    return;
  }

  try {
    // Opção 1: Credenciais via variável de ambiente (JSON string)
    const credentials = process.env.FIREBASE_ADMIN_CREDENTIALS;

    if (credentials) {
      const serviceAccount = JSON.parse(credentials);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
    // Opção 2: Google Application Default Credentials
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
    // Opção 3: Emulador em desenvolvimento
    else if (process.env.USE_EMULATOR === 'true') {
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
    // Fallback: usar project ID apenas (funciona com emuladores)
    else {
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }

    initialized = true;
    console.log('[Firebase Admin] Inicializado com sucesso');
  } catch (error) {
    console.error('[Firebase Admin] Erro na inicialização:', error);
    throw error;
  }
}

/**
 * Retorna instância do Firestore
 */
export function getFirestore(): admin.firestore.Firestore {
  initializeAdmin();
  return admin.firestore();
}

/**
 * Retorna instância do Auth
 */
export function getAuth(): admin.auth.Auth {
  initializeAdmin();
  return admin.auth();
}

/**
 * Retorna instância do Storage
 */
export function getStorage(): admin.storage.Storage {
  initializeAdmin();
  return admin.storage();
}

/**
 * Retorna Timestamp do Firestore
 */
export function getTimestamp(): typeof admin.firestore.Timestamp {
  return admin.firestore.Timestamp;
}

/**
 * Retorna FieldValue do Firestore
 */
export function getFieldValue(): typeof admin.firestore.FieldValue {
  return admin.firestore.FieldValue;
}

export default admin;
