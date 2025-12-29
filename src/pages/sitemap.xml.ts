/**
 * Sitemap XML Dinamico - DevForge
 *
 * Gera sitemap.xml dinamicamente com todas as paginas publicas
 * e pesquisas publicadas do Firestore.
 *
 * @see https://www.sitemaps.org/protocol.html
 * @module pages/sitemap.xml
 * @version 1.0.0
 */

import { GetServerSideProps } from 'next';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getFirebaseApp } from '@/api/lib/firebase/admin';

/**
 * Configuracao do site
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devforge.com';

/**
 * Paginas estaticas do site com prioridade e frequencia de atualizacao
 */
const STATIC_PAGES = [
  // Paginas principais
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/features', priority: 0.9, changefreq: 'weekly' },
  { url: '/pricing', priority: 0.8, changefreq: 'weekly' },
  { url: '/docs', priority: 0.8, changefreq: 'weekly' },

  // Autenticacao (login/cadastro importantes para conversao)
  { url: '/login', priority: 0.7, changefreq: 'monthly' },
  { url: '/signup', priority: 0.7, changefreq: 'monthly' },

  // Paginas institucionais
  { url: '/about', priority: 0.6, changefreq: 'monthly' },
  { url: '/contact', priority: 0.6, changefreq: 'monthly' },
  { url: '/faq', priority: 0.6, changefreq: 'weekly' },

  // Paginas legais
  { url: '/terms', priority: 0.3, changefreq: 'yearly' },
  { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
];

/**
 * Interface para pesquisa no sitemap
 */
interface SitemapSurvey {
  id: string;
  updatedAt: Date;
}

/**
 * Busca pesquisas publicas do Firestore
 * Descomente quando o Firebase estiver configurado
 */
async function getPublicSurveys(): Promise<SitemapSurvey[]> {
  try {
    // TODO: Descomentar quando Firebase estiver configurado
    // getFirebaseApp();
    // const db = getFirestore();
    //
    // const snapshot = await db
    //   .collection('surveys')
    //   .where('status', '==', 'active')
    //   .where('visibility', '==', 'public')
    //   .orderBy('updatedAt', 'desc')
    //   .limit(1000)
    //   .get();
    //
    // return snapshot.docs.map((doc) => {
    //   const data = doc.data();
    //   return {
    //     id: doc.id,
    //     updatedAt: data.updatedAt?.toDate() || new Date(),
    //   };
    // });

    return [];
  } catch (error) {
    console.error('Erro ao buscar pesquisas para sitemap:', error);
    return [];
  }
}

/**
 * Formata data para o padrao W3C (ISO 8601)
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Gera o XML do sitemap
 */
function generateSitemapXml(surveys: SitemapSurvey[]): string {
  const today = formatDate(new Date());

  // Paginas estaticas
  const staticUrls = STATIC_PAGES.map(
    (page) => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ).join('');

  // Paginas dinamicas (pesquisas publicas)
  const surveyUrls = surveys
    .map(
      (survey) => `
  <url>
    <loc>${SITE_URL}/surveys/public/${survey.id}</loc>
    <lastmod>${formatDate(survey.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${surveyUrls}
</urlset>`;
}

/**
 * Handler para gerar o sitemap
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Buscar pesquisas publicas
    const surveys = await getPublicSurveys();

    // Gerar XML
    const sitemap = generateSitemapXml(surveys);

    // Configurar headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    // Enviar resposta
    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);

    // Retornar sitemap basico em caso de erro
    const basicSitemap = generateSitemapXml([]);
    res.setHeader('Content-Type', 'application/xml');
    res.write(basicSitemap);
    res.end();

    return { props: {} };
  }
};

/**
 * Componente vazio (necessario para Next.js)
 */
export default function Sitemap() {
  return null;
}
