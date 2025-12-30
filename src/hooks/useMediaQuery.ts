/**
 * Hook useMediaQuery
 *
 * Detecta se uma media query CSS esta ativa.
 * Util para renderizacao condicional baseada em breakpoints.
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 *
 * if (isMobile) {
 *   return <MobileLayout />;
 * }
 * ```
 */

import { useState, useEffect } from 'react';

/**
 * Hook para detectar media queries
 *
 * @param query - Media query CSS (ex: '(min-width: 768px)')
 * @returns true se a media query estiver ativa
 */
export function useMediaQuery(query: string): boolean {
  // Estado inicial baseado no SSR (false por padrao)
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se window esta disponivel
    if (typeof window === 'undefined') {
      return;
    }

    // Criar media query
    const mediaQuery = window.matchMedia(query);

    // Atualizar estado inicial
    setMatches(mediaQuery.matches);

    // Callback para mudancas
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adicionar listener
    // Usar addEventListener se disponivel (moderno)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hooks pre-configurados para breakpoints comuns do Tailwind
 */

/** Mobile: < 640px */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/** Tablet: >= 640px e < 1024px */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

/** Desktop: >= 1024px */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/** Preferencia de tema escuro do sistema */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/** Preferencia de reducao de movimento */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export default useMediaQuery;
