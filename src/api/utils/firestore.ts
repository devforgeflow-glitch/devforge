/**
 * Utilitarios para Firestore
 *
 * Funcoes para sanitizacao e manipulacao segura de dados.
 * Previne o erro "Cannot use 'undefined' as a Firestore value".
 *
 * @version 1.0.0
 */

import { getFirestore, getFieldValue, getTimestamp } from '@/api/lib/firebase/admin';
import type admin from 'firebase-admin';

/**
 * Remove recursivamente todas as propriedades undefined de um objeto.
 * Firestore nao aceita valores undefined.
 *
 * @param obj - Objeto a ser sanitizado
 * @returns Objeto sem propriedades undefined
 *
 * @example
 * ```ts
 * const data = { name: 'Test', age: undefined, email: null };
 * const sanitized = sanitizeForFirestore(data);
 * // { name: 'Test', email: null }
 * ```
 */
export function sanitizeForFirestore<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  if (obj === null || obj === undefined) {
    return {} as Partial<T>;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return sanitizeForFirestore(item as Record<string, unknown>);
        }
        return item;
      }) as unknown as Partial<T>;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Pula valores undefined
    if (value === undefined) {
      continue;
    }

    // Recursivamente sanitiza objetos aninhados
    if (value !== null && typeof value === 'object' && !isFirestoreType(value)) {
      if (Array.isArray(value)) {
        result[key] = value
          .filter((item) => item !== undefined)
          .map((item) => {
            if (typeof item === 'object' && item !== null) {
              return sanitizeForFirestore(item as Record<string, unknown>);
            }
            return item;
          });
      } else {
        result[key] = sanitizeForFirestore(value as Record<string, unknown>);
      }
    } else {
      result[key] = value;
    }
  }

  return result as Partial<T>;
}

/**
 * Verifica se o valor e um tipo especial do Firestore
 * (Timestamp, FieldValue, GeoPoint, etc.)
 */
function isFirestoreType(value: unknown): boolean {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  // Verifica se e um Timestamp
  if ('toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function') {
    return true;
  }

  // Verifica se e um FieldValue (serverTimestamp, increment, etc.)
  if ('_methodName' in value) {
    return true;
  }

  // Verifica se e um GeoPoint
  if ('latitude' in value && 'longitude' in value) {
    return true;
  }

  // Verifica se e um DocumentReference
  if ('firestore' in value && 'path' in value) {
    return true;
  }

  return false;
}

/**
 * Remove campos undefined e adiciona timestamps de criacao/atualizacao
 *
 * @param data - Dados a serem preparados
 * @param isUpdate - Se true, adiciona apenas updatedAt
 * @returns Dados sanitizados com timestamps
 */
export function prepareForFirestore<T extends Record<string, unknown>>(
  data: T,
  isUpdate = false
): Partial<T> & { createdAt?: admin.firestore.FieldValue; updatedAt: admin.firestore.FieldValue } {
  const sanitized = sanitizeForFirestore(data);
  const FieldValue = getFieldValue();

  if (isUpdate) {
    return {
      ...sanitized,
      updatedAt: FieldValue.serverTimestamp(),
    };
  }

  return {
    ...sanitized,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

/**
 * Converte um objeto para atualizacao parcial segura
 * Remove undefined e converte objetos aninhados para dot notation
 *
 * @example
 * ```ts
 * const update = preparePartialUpdate({
 *   'settings.theme': 'dark',
 *   'settings.language': undefined, // sera removido
 *   name: 'Novo Nome'
 * });
 * ```
 */
export function preparePartialUpdate<T extends Record<string, unknown>>(
  data: T
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const FieldValue = getFieldValue();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }

    if (value !== null && typeof value === 'object' && !isFirestoreType(value) && !Array.isArray(value)) {
      // Converte objetos aninhados para dot notation
      const nested = preparePartialUpdate(value as Record<string, unknown>);
      for (const [nestedKey, nestedValue] of Object.entries(nested)) {
        result[`${key}.${nestedKey}`] = nestedValue;
      }
    } else {
      result[key] = value;
    }
  }

  result.updatedAt = FieldValue.serverTimestamp();
  return result;
}

/**
 * Valida e sanitiza dados antes de salvar no Firestore
 * Lanca erro se dados obrigatorios estiverem faltando
 *
 * @param data - Dados a serem validados
 * @param requiredFields - Lista de campos obrigatorios
 * @throws Error se algum campo obrigatorio estiver faltando
 */
export function validateAndSanitize<T extends object>(
  data: T,
  requiredFields: (keyof T)[]
): Partial<T> {
  const sanitized = sanitizeForFirestore(data as unknown as Record<string, unknown>) as Partial<T>;

  for (const field of requiredFields) {
    if (sanitized[field] === undefined || sanitized[field] === null) {
      throw new Error(`Campo obrigatorio '${String(field)}' esta faltando ou e undefined`);
    }
  }

  return sanitized;
}

/**
 * Helper para criar documento com ID automatico
 */
export async function createDocument<T extends Record<string, unknown>>(
  collectionPath: string,
  data: T
): Promise<string> {
  const db = getFirestore();
  const prepared = prepareForFirestore(data, false);
  const docRef = await db.collection(collectionPath).add(prepared);
  return docRef.id;
}

/**
 * Helper para criar documento com ID especifico
 */
export async function setDocument<T extends Record<string, unknown>>(
  collectionPath: string,
  docId: string,
  data: T,
  merge = false
): Promise<void> {
  const db = getFirestore();
  const prepared = prepareForFirestore(data, merge);
  await db.collection(collectionPath).doc(docId).set(prepared, { merge });
}

/**
 * Helper para atualizar documento existente
 */
export async function updateDocument<T extends Record<string, unknown>>(
  collectionPath: string,
  docId: string,
  data: T
): Promise<void> {
  const db = getFirestore();
  const prepared = preparePartialUpdate(data);
  await db.collection(collectionPath).doc(docId).update(prepared);
}

/**
 * Helper para buscar documento por ID
 */
export async function getDocument<T>(
  collectionPath: string,
  docId: string
): Promise<T | null> {
  const db = getFirestore();
  const docRef = await db.collection(collectionPath).doc(docId).get();

  if (!docRef.exists) {
    return null;
  }

  return { id: docRef.id, ...docRef.data() } as T;
}

/**
 * Helper para deletar documento
 */
export async function deleteDocument(
  collectionPath: string,
  docId: string
): Promise<void> {
  const db = getFirestore();
  await db.collection(collectionPath).doc(docId).delete();
}

/**
 * Helper para buscar documentos com query
 */
export async function queryDocuments<T>(
  collectionPath: string,
  queryFn?: (
    ref: admin.firestore.CollectionReference
  ) => admin.firestore.Query
): Promise<T[]> {
  const db = getFirestore();
  const collectionRef = db.collection(collectionPath);
  const query = queryFn ? queryFn(collectionRef) : collectionRef;
  const snapshot = await query.get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

/**
 * Converte Timestamp do Firestore para Date ou string ISO
 */
export function timestampToDate(
  timestamp: admin.firestore.Timestamp | null | undefined
): Date | null {
  if (!timestamp) return null;
  return timestamp.toDate();
}

export function timestampToISO(
  timestamp: admin.firestore.Timestamp | null | undefined
): string | null {
  if (!timestamp) return null;
  return timestamp.toDate().toISOString();
}

/**
 * Cria um Timestamp a partir de uma Date
 */
export function dateToTimestamp(date: Date): admin.firestore.Timestamp {
  const Timestamp = getTimestamp();
  return Timestamp.fromDate(date);
}
