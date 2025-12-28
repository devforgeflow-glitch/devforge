import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

/**
 * Middleware para internacionalizacao (i18n)
 *
 * Gerencia redirecionamento de idioma baseado em:
 * 1. Prefixo de URL (/en, /es, /pt-BR)
 * 2. Cookie de preferencia
 * 3. Accept-Language header
 *
 * @version 1.0.0
 */
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Nao mostra prefixo para idioma padrao
});

export const config = {
  // Matcher para todas as paginas exceto API, assets e arquivos estaticos
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
