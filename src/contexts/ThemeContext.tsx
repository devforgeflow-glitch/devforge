'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

/**
 * Provider de Tema para Dark Mode
 *
 * Utiliza next-themes para gerenciamento de tema.
 * Suporta: light, dark, system
 *
 * @example
 * ```tsx
 * // No _app.tsx
 * <ThemeProvider>
 *   <Component {...pageProps} />
 * </ThemeProvider>
 *
 * // Em qualquer componente
 * import { useTheme } from 'next-themes';
 * const { theme, setTheme } = useTheme();
 * ```
 *
 * @version 1.0.0
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export { useTheme } from 'next-themes';
