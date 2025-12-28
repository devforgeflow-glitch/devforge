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
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
