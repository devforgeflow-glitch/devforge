import { type ReactNode } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * Componente Layout
 *
 * Layout padrao com Header, conteudo e Footer.
 *
 * @example
 * ```tsx
 * <Layout title="Pagina Inicial">
 *   <HomePage />
 * </Layout>
 * ```
 *
 * @version 1.0.0
 */

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({
  children,
  title = 'DevForge',
  description = 'Plataforma completa para feedback e gestao de produtos',
}: LayoutProps) {
  const fullTitle = title === 'DevForge' ? title : `${title} | DevForge`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
      </Head>

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
