import { getRequestConfig } from 'next-intl/server';

/**
 * Configuracao do next-intl para i18n
 *
 * Idiomas suportados: pt-BR, en, es
 * Idioma padrao: pt-BR
 *
 * @version 1.0.0
 */

export const locales = ['pt-BR', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt-BR';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./locales/${locale}/common.json`)).default,
}));
