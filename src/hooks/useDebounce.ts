/**
 * Hook useDebounce
 *
 * Atrasa a atualizacao de um valor ate que pare de mudar.
 * Util para evitar chamadas excessivas em campos de busca, etc.
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // So executa apos 500ms sem digitacao
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para debounce de valores
 *
 * @param value - Valor a ser debounced
 * @param delay - Tempo de espera em ms (default: 500)
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Criar timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup - cancelar timer anterior
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para debounce de funcoes (callbacks)
 *
 * @param callback - Funcao a ser debounced
 * @param delay - Tempo de espera em ms (default: 500)
 * @returns Funcao debounced
 *
 * @example
 * ```tsx
 * const debouncedSave = useDebouncedCallback((value: string) => {
 *   saveToServer(value);
 * }, 1000);
 *
 * return <input onChange={(e) => debouncedSave(e.target.value)} />;
 * ```
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Atualizar referencia do callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Cancelar timer anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Criar novo timer
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debouncedCallback;
}

/**
 * Hook para throttle de valores (limita a frequencia de atualizacao)
 *
 * @param value - Valor a ser throttled
 * @param interval - Intervalo minimo entre atualizacoes em ms (default: 500)
 * @returns Valor throttled
 *
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 *
 * // throttledScrollY atualiza no maximo 10x por segundo
 * ```
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      // Se ja passou o intervalo, atualizar imediatamente
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      // Senao, agendar atualizacao para quando o intervalo completar
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastExecution);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

export default useDebounce;
