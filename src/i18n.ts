import { getRequestConfig } from 'next-intl/server';

/**
 * Configuracao do next-intl para i18n
 *
 * Idiomas suportados: pt-BR, en, es
 * Idioma padrao: pt-BR
 *
 * Arquivos de traducao:
 * - common.json: Textos gerais e comuns
 * - auth.json: Autenticacao (login, signup, etc)
 * - surveys.json: Pesquisas e formularios
 * - dashboard.json: Painel de controle
 * - errors.json: Mensagens de erro
 *
 * @version 1.1.0
 */

export const locales = ['pt-BR', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt-BR';

/**
 * Carrega todos os arquivos de traducao para um locale
 */
export async function loadMessages(locale: string) {
  const resolvedLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

  const [common, auth, surveys, dashboard, errors] = await Promise.all([
    import(`./locales/${resolvedLocale}/common.json`).then((m) => m.default),
    import(`./locales/${resolvedLocale}/auth.json`).then((m) => m.default).catch(() => ({})),
    import(`./locales/${resolvedLocale}/surveys.json`).then((m) => m.default).catch(() => ({})),
    import(`./locales/${resolvedLocale}/dashboard.json`).then((m) => m.default).catch(() => ({})),
    import(`./locales/${resolvedLocale}/errors.json`).then((m) => m.default).catch(() => ({})),
  ]);

  return {
    ...common,
    auth: { ...common.auth, ...auth },
    surveys,
    dashboard,
    errors,
  };
}

export default getRequestConfig(async ({ locale }) => {
  const messages = await loadMessages(locale || defaultLocale);
  return { messages };
});
