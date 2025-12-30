/**
 * Hooks Personalizados - DevForge
 *
 * Exporta todos os hooks reutilizaveis.
 *
 * @version 1.0.0
 */

// PWA
export { usePWA } from './usePWA';

// Armazenamento
export { useLocalStorage } from './useLocalStorage';

// Media Queries e Responsividade
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersDarkMode,
  usePrefersReducedMotion,
} from './useMediaQuery';

// Performance e Otimizacao
export {
  useDebounce,
  useDebouncedCallback,
  useThrottle,
} from './useDebounce';

// Interacao com DOM
export {
  useClickOutside,
  useClickOutsideRef,
} from './useClickOutside';
