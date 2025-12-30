import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import { ThemeProvider, AuthProvider, LayoutProvider, BrandProvider } from '@/contexts';
import { InstallPrompt, OfflineIndicator } from '@/components/pwa';
import { CookieConsent } from '@/components/ui';
import '@/styles/globals.css';

/**
 * App Component Principal
 *
 * Configura providers globais:
 * - ThemeProvider (Dark Mode)
 * - AuthProvider (Firebase Auth)
 * - BrandProvider (White-label)
 * - NextIntlClientProvider (i18n)
 * - PWA Install Prompt e Offline Indicator
 *
 * @version 1.2.0
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
        <BrandProvider>
          <AuthProvider>
            <LayoutProvider>
              <main className={`${inter.variable} font-sans`}>
                <OfflineIndicator position="top" />
                <Component {...pageProps} />
                <CookieConsent />
                <InstallPrompt delay={15000} />
              </main>
            </LayoutProvider>
          </AuthProvider>
        </BrandProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
