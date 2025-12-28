import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import { ThemeProvider, AuthProvider } from '@/contexts';
import '@/styles/globals.css';

/**
 * App Component Principal
 *
 * Configura providers globais:
 * - ThemeProvider (Dark Mode)
 * - AuthProvider (Firebase Auth)
 * - NextIntlClientProvider (i18n)
 *
 * @version 1.0.0
 */

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextIntlClientProvider
      locale={router.locale || 'pt-BR'}
      messages={pageProps.messages}
      timeZone="America/Sao_Paulo"
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <main className={`${inter.variable} font-sans`}>
            <Component {...pageProps} />
          </main>
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
