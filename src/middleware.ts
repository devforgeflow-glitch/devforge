import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de Internacionalizacao (i18n)
 *
 * Para Pages Router, o middleware apenas define o locale no cookie/header.
 * As traducoes sao carregadas via getStaticProps em cada pagina.
 *
 * Nao faz redirecionamento para evitar 404s.
 *
 * @version 2.0.0
 */

const locales = ['pt-BR', 'en', 'es'] as const;
const defaultLocale = 'pt-BR';
const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Detecta o locale preferido do usuario
 */
function getPreferredLocale(request: NextRequest): string {
  // 1. Verifica cookie de preferencia
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && locales.includes(cookieLocale as typeof locales[number])) {
    return cookieLocale;
  }

  // 2. Verifica Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map((lang) => {
        const [locale] = lang.trim().split(';');
        return locale;
      });

    for (const preferred of preferredLocales) {
      // Match exato
      if (locales.includes(preferred as typeof locales[number])) {
        return preferred;
      }
      // Match parcial (ex: 'pt' -> 'pt-BR')
      const partial = locales.find((l) => l.startsWith(preferred.split('-')[0]));
      if (partial) {
        return partial;
      }
    }
  }

  // 3. Retorna locale padrao
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora arquivos estaticos e API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Detecta locale preferido
  const locale = getPreferredLocale(request);

  // Cria response e define locale no header para getStaticProps
  const response = NextResponse.next();

  // Define cookie se ainda nao existe
  if (!request.cookies.has(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      sameSite: 'lax',
    });
  }

  // Define header para uso interno
  response.headers.set('x-locale', locale);

  return response;
}

export const config = {
  // Aplica em todas as paginas exceto arquivos estaticos
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
