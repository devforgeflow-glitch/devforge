/**
 * Utilitarios de Data - Base Compartilhada (Frontend + Backend)
 *
 * Funcoes seguras para manipulacao de datas.
 * NAO depende de firebase-admin, pode ser usado em qualquer lugar.
 *
 * @version 1.0.0
 */

/**
 * Tipo generico para valores que podem ser convertidos para Date
 */
export type DateLike =
  | Date
  | string
  | number
  | { toDate: () => Date } // Firestore Timestamp
  | null
  | undefined;

/**
 * Converte qualquer valor para Date de forma segura
 *
 * @param value - Valor a ser convertido (Date, string, number, Timestamp, etc)
 * @returns Date valida ou null se conversao falhar
 *
 * @example
 * ```ts
 * toDate(new Date())           // Date
 * toDate('2024-01-01')         // Date
 * toDate(1704067200000)        // Date
 * toDate(firestoreTimestamp)   // Date
 * toDate(null)                 // null
 * toDate('invalid')            // null
 * ```
 */
export function toDate(value: DateLike): Date | null {
  if (!value) return null;

  // Ja e uma Date valida
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // Firestore Timestamp (tem metodo toDate)
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    try {
      const date = value.toDate();
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  // String ou numero
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Verifica se um valor e uma data valida
 *
 * @param value - Valor a ser verificado
 * @returns true se for uma data valida
 */
export function isValidDate(value: unknown): boolean {
  const date = toDate(value as DateLike);
  return date !== null;
}

/**
 * Formata uma data para exibicao
 *
 * @param value - Data a ser formatada
 * @param options - Opcoes de formatacao
 * @returns String formatada ou fallback se data invalida
 *
 * @example
 * ```ts
 * formatDate(new Date())                    // "28/12/2024"
 * formatDate(new Date(), { time: true })    // "28/12/2024 14:30"
 * formatDate(null, { fallback: '-' })       // "-"
 * ```
 */
export function formatDate(
  value: DateLike,
  options: {
    locale?: string;
    time?: boolean;
    seconds?: boolean;
    fallback?: string;
  } = {}
): string {
  const { locale = 'pt-BR', time = false, seconds = false, fallback = '-' } = options;

  const date = toDate(value);
  if (!date) return fallback;

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  if (time) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
    if (seconds) {
      dateOptions.second = '2-digit';
    }
  }

  return date.toLocaleDateString(locale, dateOptions);
}

/**
 * Formata uma data em formato ISO (YYYY-MM-DD)
 *
 * @param value - Data a ser formatada
 * @param fallback - Valor de fallback se data invalida
 * @returns String ISO ou fallback
 */
export function formatDateISO(value: DateLike, fallback: string | null = null): string | null {
  const date = toDate(value);
  if (!date) return fallback;

  return date.toISOString().split('T')[0];
}

/**
 * Formata uma data como ISO string completa
 *
 * @param value - Data a ser formatada
 * @param fallback - Valor de fallback se data invalida
 * @returns ISO string completa ou fallback
 */
export function toISOString(value: DateLike, fallback: string | null = null): string | null {
  const date = toDate(value);
  if (!date) return fallback;

  return date.toISOString();
}

/**
 * Formata um intervalo de datas
 *
 * @param start - Data inicial
 * @param end - Data final
 * @param options - Opcoes de formatacao
 * @returns String formatada do intervalo
 *
 * @example
 * ```ts
 * formatDateRange(new Date('2024-01-01'), new Date('2024-01-31'))
 * // "01/01/2024 - 31/01/2024"
 * ```
 */
export function formatDateRange(
  start: DateLike,
  end: DateLike,
  options: {
    locale?: string;
    separator?: string;
    fallback?: string;
  } = {}
): string {
  const { separator = ' - ', fallback = '-' } = options;

  const startFormatted = formatDate(start, options);
  const endFormatted = formatDate(end, options);

  if (startFormatted === fallback && endFormatted === fallback) {
    return fallback;
  }

  return `${startFormatted}${separator}${endFormatted}`;
}

/**
 * Formata uma data relativa ("ha 5 minutos", "ontem", etc)
 *
 * @param value - Data a ser formatada
 * @param options - Opcoes de formatacao
 * @returns String relativa ou fallback
 *
 * @example
 * ```ts
 * formatRelativeDate(new Date(Date.now() - 60000))  // "ha 1 minuto"
 * formatRelativeDate(new Date(Date.now() - 3600000)) // "ha 1 hora"
 * ```
 */
export function formatRelativeDate(
  value: DateLike,
  options: {
    locale?: string;
    fallback?: string;
  } = {}
): string {
  const { locale = 'pt-BR', fallback = '-' } = options;

  const date = toDate(value);
  if (!date) return fallback;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Usar Intl.RelativeTimeFormat se disponivel
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffSeconds < 60) {
      return rtf.format(-diffSeconds, 'second');
    }
    if (diffMinutes < 60) {
      return rtf.format(-diffMinutes, 'minute');
    }
    if (diffHours < 24) {
      return rtf.format(-diffHours, 'hour');
    }
    if (diffDays < 30) {
      return rtf.format(-diffDays, 'day');
    }

    // Para datas mais antigas, usar formato absoluto
    return formatDate(date, { locale });
  }

  // Fallback simples se Intl nao disponivel
  if (diffSeconds < 60) return 'agora';
  if (diffMinutes < 60) return `ha ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  if (diffHours < 24) return `ha ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 30) return `ha ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

  return formatDate(date, { locale });
}

/**
 * Compara duas datas de forma segura
 *
 * @param a - Primeira data
 * @param b - Segunda data
 * @returns -1 se a < b, 0 se iguais, 1 se a > b, null se alguma invalida
 */
export function compareDates(a: DateLike, b: DateLike): -1 | 0 | 1 | null {
  const dateA = toDate(a);
  const dateB = toDate(b);

  if (!dateA || !dateB) return null;

  const timeA = dateA.getTime();
  const timeB = dateB.getTime();

  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;
  return 0;
}

/**
 * Calcula a diferenca entre duas datas em milissegundos
 *
 * @param a - Primeira data
 * @param b - Segunda data
 * @returns Diferenca em ms ou null se alguma data invalida
 */
export function dateDiffMs(a: DateLike, b: DateLike): number | null {
  const dateA = toDate(a);
  const dateB = toDate(b);

  if (!dateA || !dateB) return null;

  return dateA.getTime() - dateB.getTime();
}

/**
 * Verifica se uma data esta no passado
 *
 * @param value - Data a verificar
 * @returns true se a data esta no passado
 */
export function isPast(value: DateLike): boolean {
  const date = toDate(value);
  if (!date) return false;

  return date.getTime() < Date.now();
}

/**
 * Verifica se uma data esta no futuro
 *
 * @param value - Data a verificar
 * @returns true se a data esta no futuro
 */
export function isFuture(value: DateLike): boolean {
  const date = toDate(value);
  if (!date) return false;

  return date.getTime() > Date.now();
}

/**
 * Retorna a data atual como ISO string
 *
 * @returns ISO string da data atual
 */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Adiciona dias a uma data
 *
 * @param value - Data base
 * @param days - Numero de dias a adicionar (pode ser negativo)
 * @returns Nova data ou null se data invalida
 */
export function addDays(value: DateLike, days: number): Date | null {
  const date = toDate(value);
  if (!date) return null;

  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Retorna o inicio do dia (00:00:00)
 *
 * @param value - Data
 * @returns Data no inicio do dia ou null
 */
export function startOfDay(value: DateLike): Date | null {
  const date = toDate(value);
  if (!date) return null;

  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Retorna o fim do dia (23:59:59.999)
 *
 * @param value - Data
 * @returns Data no fim do dia ou null
 */
export function endOfDay(value: DateLike): Date | null {
  const date = toDate(value);
  if (!date) return null;

  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}
