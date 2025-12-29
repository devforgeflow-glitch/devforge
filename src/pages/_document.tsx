import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Document Component
 *
 * Define estrutura HTML base.
 * Suporta i18n com lang dinamico.
 *
 * @version 1.0.0
 */
export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="DevForge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DevForge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#6366F1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#6366F1" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* Favicon e Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
