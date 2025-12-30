/**
 * Hook useLocalStorage
 *
 * Gerencia estado persistido no localStorage.
 * Funciona como useState mas persiste o valor entre sessoes.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * const [user, setUser] = useLocalStorage<User>('user', null);
 * ```
 */

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

/**
 * Hook para gerenciar estado no localStorage
 *
 * @param key - Chave para armazenar no localStorage
 * @param initialValue - Valor inicial caso nao exista no storage
 * @returns Tupla [valor, setValor] similar ao useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // Funcao para ler o valor inicial
  const readValue = useCallback((): T => {
    // Previne erros no SSR
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // Estado local
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Funcao para atualizar o valor
  const setValue: SetValue<T> = useCallback(
    (value) => {
      // Previne erros no SSR
      if (typeof window === 'undefined') {
        console.warn(
          `Tentativa de usar localStorage no servidor com key "${key}"`
        );
        return;
      }

      try {
        // Permite valor ser uma funcao similar ao useState
        const newValue = value instanceof Function ? value(storedValue) : value;

        // Salvar no localStorage
        window.localStorage.setItem(key, JSON.stringify(newValue));

        // Atualizar estado
        setStoredValue(newValue);

        // Disparar evento para outras abas/janelas
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Erro ao salvar localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Sincronizar com outras abas/janelas
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Listener para mudancas no storage
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
