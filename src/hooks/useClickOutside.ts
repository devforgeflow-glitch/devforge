/**
 * Hook useClickOutside
 *
 * Detecta cliques fora de um elemento.
 * Util para fechar modais, dropdowns, menus, etc.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 *
 * useClickOutside(ref, () => {
 *   setIsOpen(false);
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isOpen && <Dropdown />}
 *   </div>
 * );
 * ```
 */

import { useEffect, useRef, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Hook para detectar cliques fora de um elemento
 *
 * @param ref - Referencia ao elemento
 * @param handler - Callback quando clicar fora
 * @param enabled - Se o listener deve estar ativo (default: true)
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  enabled: boolean = true
): void {
  // Manter referencia ao handler para evitar re-adicionar listeners
  const handlerRef = useRef<Handler>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;

      // Nao fazer nada se clicar no proprio elemento ou descendentes
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handlerRef.current(event);
    };

    // Adicionar listeners
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, enabled]);
}

/**
 * Hook alternativo que retorna a ref diretamente
 *
 * @param handler - Callback quando clicar fora
 * @param enabled - Se o listener deve estar ativo (default: true)
 * @returns Ref para anexar ao elemento
 *
 * @example
 * ```tsx
 * const ref = useClickOutsideRef<HTMLDivElement>(() => {
 *   setIsOpen(false);
 * });
 *
 * return <div ref={ref}>...</div>;
 * ```
 */
export function useClickOutsideRef<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  enabled: boolean = true
): RefObject<T> {
  const ref = useRef<T>(null);
  useClickOutside(ref, handler, enabled);
  return ref;
}

export default useClickOutside;
