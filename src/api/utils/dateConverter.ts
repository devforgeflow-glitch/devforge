/**
 * Conversor de Datas - Extensao Backend
 *
 * Funcoes especificas para backend que requerem firebase-admin.
 * Estende as funcoes base de src/utils/formatDate.ts
 *
 * @version 1.0.0
 */

import { getTimestamp } from '@/api/lib/firebase/admin';
import { toDate, toISOString, compareDates, dateDiffMs, nowISO } from '@/utils/formatDate';
import type { DateLike } from '@/utils/formatDate';
import type admin from 'firebase-admin';

// Re-exportar funcoes base para compatibilidade
export { toDate as toDateSafe, toISOString as toISOStringSafe, compareDates as compareDatesSafe, dateDiffMs, nowISO };

/**
 * Converte um valor para Firestore Timestamp de forma segura
 *
 * @param value - Valor a ser convertido (Date, string, number, etc)
 * @returns Firestore Timestamp ou null se conversao falhar
 *
 * @example
 * ```ts
 * toTimestampSafe(new Date())           // Timestamp
 * toTimestampSafe('2024-01-01')         // Timestamp
 * toTimestampSafe(1704067200000)        // Timestamp
 * toTimestampSafe(null)                 // null
 * ```
 */
export function toTimestampSafe(value: DateLike): admin.firestore.Timestamp | null {
  const date = toDate(value);
  if (!date) return null;

  try {
    const Timestamp = getTimestamp();
    return Timestamp.fromDate(date);
  } catch {
    return null;
  }
}

/**
 * Verifica se um valor e um Firestore Timestamp valido
 *
 * @param value - Valor a ser verificado
 * @returns true se for um Timestamp valido
 */
export function isValidTimestamp(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;

  // Verifica se tem a estrutura de um Timestamp
  if ('seconds' in value && 'nanoseconds' in value) {
    return true;
  }

  // Verifica se tem o metodo toDate
  if ('toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function') {
    try {
      const date = (value as { toDate: () => Date }).toDate();
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Retorna a data/hora atual como Firestore Timestamp
 *
 * @returns Timestamp da data atual
 */
export function nowTimestamp(): admin.firestore.Timestamp {
  const Timestamp = getTimestamp();
  return Timestamp.now();
}

/**
 * Converte Timestamp para milissegundos desde epoch
 *
 * @param value - Timestamp ou DateLike
 * @returns Milissegundos ou null
 */
export function toMillis(value: DateLike): number | null {
  const date = toDate(value);
  if (!date) return null;

  return date.getTime();
}

/**
 * Cria um Timestamp a partir de milissegundos
 *
 * @param millis - Milissegundos desde epoch
 * @returns Timestamp ou null
 */
export function fromMillis(millis: number | null | undefined): admin.firestore.Timestamp | null {
  if (millis == null || isNaN(millis)) return null;

  try {
    const Timestamp = getTimestamp();
    return Timestamp.fromMillis(millis);
  } catch {
    return null;
  }
}

/**
 * Converte um objeto com campos de data para usar Timestamps
 *
 * @param obj - Objeto com campos que podem ser datas
 * @param dateFields - Lista de campos para converter
 * @returns Objeto com campos convertidos para Timestamp
 *
 * @example
 * ```ts
 * const data = {
 *   name: 'Test',
 *   createdAt: new Date(),
 *   expiresAt: '2024-12-31'
 * };
 *
 * const converted = convertDatesToTimestamps(data, ['createdAt', 'expiresAt']);
 * // { name: 'Test', createdAt: Timestamp, expiresAt: Timestamp }
 * ```
 */
export function convertDatesToTimestamps<T extends Record<string, unknown>>(
  obj: T,
  dateFields: (keyof T)[]
): T {
  const result = { ...obj };

  for (const field of dateFields) {
    const value = result[field];
    if (value !== undefined && value !== null) {
      const timestamp = toTimestampSafe(value as DateLike);
      if (timestamp) {
        (result[field] as unknown) = timestamp;
      }
    }
  }

  return result;
}

/**
 * Converte um objeto com Timestamps para usar Dates
 *
 * @param obj - Objeto com campos Timestamp
 * @param dateFields - Lista de campos para converter
 * @returns Objeto com campos convertidos para Date
 */
export function convertTimestampsToDates<T extends Record<string, unknown>>(
  obj: T,
  dateFields: (keyof T)[]
): T {
  const result = { ...obj };

  for (const field of dateFields) {
    const value = result[field];
    if (value !== undefined && value !== null) {
      const date = toDate(value as DateLike);
      if (date) {
        (result[field] as unknown) = date;
      }
    }
  }

  return result;
}

/**
 * Converte um objeto com Timestamps para usar ISO strings
 *
 * @param obj - Objeto com campos Timestamp
 * @param dateFields - Lista de campos para converter
 * @returns Objeto com campos convertidos para ISO string
 */
export function convertTimestampsToISO<T extends Record<string, unknown>>(
  obj: T,
  dateFields: (keyof T)[]
): T {
  const result = { ...obj };

  for (const field of dateFields) {
    const value = result[field];
    if (value !== undefined && value !== null) {
      const iso = toISOString(value as DateLike);
      if (iso) {
        (result[field] as unknown) = iso;
      }
    }
  }

  return result;
}

/**
 * Verifica se uma data/timestamp esta expirada
 *
 * @param value - Data ou Timestamp
 * @returns true se a data ja passou
 */
export function isExpired(value: DateLike): boolean {
  const date = toDate(value);
  if (!date) return false;

  return date.getTime() < Date.now();
}

/**
 * Verifica se uma data/timestamp esta dentro de um intervalo
 *
 * @param value - Data a verificar
 * @param start - Inicio do intervalo
 * @param end - Fim do intervalo
 * @returns true se a data esta dentro do intervalo
 */
export function isWithinRange(value: DateLike, start: DateLike, end: DateLike): boolean {
  const date = toDate(value);
  const startDate = toDate(start);
  const endDate = toDate(end);

  if (!date || !startDate || !endDate) return false;

  const time = date.getTime();
  return time >= startDate.getTime() && time <= endDate.getTime();
}

/**
 * Adiciona duracao a um Timestamp
 *
 * @param value - Timestamp ou data base
 * @param duration - Duracao a adicionar
 * @returns Novo Timestamp ou null
 */
export function addDuration(
  value: DateLike,
  duration: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  }
): admin.firestore.Timestamp | null {
  const date = toDate(value);
  if (!date) return null;

  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;

  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(result.getHours() + hours);
  result.setMinutes(result.getMinutes() + minutes);
  result.setSeconds(result.getSeconds() + seconds);

  return toTimestampSafe(result);
}
