/**
 * Componente SEOHead - DevForge
 *
 * Componente reutilizavel para meta tags SEO completas.
 * Inclui Open Graph, Twitter Cards, Schema.org e meta tags essenciais.
 *
 * @module components/seo/SEOHead
 * @version 1.0.0
 */

import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * Configuracao padrao do site
 */
const SITE_CONFIG = {
  siteName: 'DevForge',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://devforge.com',
  defaultTitle: 'DevForge - Plataforma de Pesquisas e Feedbacks',
  defaultDescription:
    'Plataforma completa para criar pesquisas, coletar feedbacks e analisar resultados com inteligencia artificial. Tome decisoes baseadas em dados.',
  defaultImage: '/images/og-image.png',
  twitterHandle: '@devforge',
  locale: 'pt_BR',
  themeColor: '#6366f1', // brand-primary (indigo)
};

/**
 * Props do componente SEOHead
 */
interface SEOHeadProps {
  /** Titulo da pagina (sera concatenado com nome do site) */
  title?: string;
  /** Descricao da pagina (meta description) */
  description?: string;
  /** URL canonica (se diferente da atual) */
  canonicalUrl?: string;
  /** Imagem para Open Graph e Twitter Cards */
  image?: string;
  /** Alt text da imagem OG */
  imageAlt?: string;
  /** Tipo de conteudo Open Graph */
  ogType?: 'website' | 'article' | 'product';
  /** Palavras-chave da pagina */
  keywords?: string[];
  /** Autor do conteudo (para artigos) */
  author?: string;
  /** Data de publicacao (para artigos) */
  publishedTime?: string;
  /** Data de modificacao */
  modifiedTime?: string;
  /** Se a pagina nao deve ser indexada */
  noIndex?: boolean;
  /** Se a pagina nao deve seguir links */
  noFollow?: boolean;
  /** Schema.org JSON-LD adicional */
  schemaJsonLd?: object | object[];
  /** Breadcrumbs para Schema.org */
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * Componente SEOHead
 *
 * @example
 * ```tsx
 * <SEOHead
 *   title="Criar Pesquisa"
 *   description="Crie pesquisas profissionais em minutos"
 *   keywords={['pesquisa', 'feedback', 'NPS']}
 * />
 * ```
 */
export default function SEOHead({
  title,
  description = SITE_CONFIG.defaultDescription,
  canonicalUrl,
  image = SITE_CONFIG.defaultImage,
  imageAlt,
  ogType = 'website',
  keywords = [],
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
  noFollow = false,
  schemaJsonLd,
  breadcrumbs,
}: SEOHeadProps) {
  const router = useRouter();

  // Construir titulo completo
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.siteName}`
    : SITE_CONFIG.defaultTitle;

  // URL canonica
  const canonical = canonicalUrl || `${SITE_CONFIG.siteUrl}${router.asPath.split('?')[0]}`;

  // URL completa da imagem
  const imageUrl = image.startsWith('http') ? image : `${SITE_CONFIG.siteUrl}${image}`;

  // Robots meta tag
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1',
  ].join(', ');

  // Schema.org base - Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DevForge',
    url: SITE_CONFIG.siteUrl,
    logo: `${SITE_CONFIG.siteUrl}/logo.svg`,
    description: SITE_CONFIG.defaultDescription,
    sameAs: [
      'https://twitter.com/devforge',
      'https://www.linkedin.com/company/devforge',
      'https://github.com/devforge',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Portuguese', 'English', 'Spanish'],
    },
  };

  // Schema.org - WebSite com SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.siteUrl,
    description: SITE_CONFIG.defaultDescription,
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Schema.org - SoftwareApplication
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DevForge',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  // Schema.org - BreadcrumbList
  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.siteUrl}${item.url}`,
        })),
      }
    : null;

  // Combinar todos os schemas
  const allSchemas = [
    organizationSchema,
    websiteSchema,
    softwareSchema,
    breadcrumbSchema,
    ...(Array.isArray(schemaJsonLd) ? schemaJsonLd : schemaJsonLd ? [schemaJsonLd] : []),
  ].filter(Boolean);

  return (
    <Head>
      {/* Titulo */}
      <title>{fullTitle}</title>

      {/* Meta tags basicas */}
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {author && <meta name="author" content={author} />}

      {/* Theme color */}
      <meta name="theme-color" content={SITE_CONFIG.themeColor} />
      <meta name="msapplication-TileColor" content={SITE_CONFIG.themeColor} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_CONFIG.siteName} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}

      {/* Artigo especifico */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && <meta property="article:author" content={author} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {/* Idioma alternativo (hreflang) para i18n */}
      <link rel="alternate" hrefLang="pt-BR" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical.replace('/pt-BR', '/en')} />
      <link rel="alternate" hrefLang="es" href={canonical.replace('/pt-BR', '/es')} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* Schema.org JSON-LD */}
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}

/**
 * Gera Schema.org para uma pesquisa/survey
 */
export function generateSurveySchema(survey: {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  responseCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: survey.title,
    description: survey.description,
    image: survey.imageUrl,
    url: `${SITE_CONFIG.siteUrl}/surveys/public/${survey.id}`,
    author: {
      '@type': 'Person',
      name: survey.authorName,
    },
    datePublished: survey.createdAt,
    dateModified: survey.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: 'DevForge',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.siteUrl}/logo.svg`,
      },
    },
    ...(survey.responseCount && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: survey.responseCount,
      },
    }),
  };
}

/**
 * Gera Schema.org para FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Gera Schema.org para Pricing/Planos
 */
export function generatePricingSchema(plans: Array<{
  name: string;
  description: string;
  price: number;
  currency?: string;
  billingPeriod?: string;
}>) {
  return plans.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `DevForge ${plan.name}`,
    description: plan.description,
    offers: {
      '@type': 'Offer',
      price: plan.price.toString(),
      priceCurrency: plan.currency || 'BRL',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
    },
  }));
}

/**
 * Gera breadcrumbs para navegacao
 */
export function generateBreadcrumbs(
  items: Array<{ name: string; path: string }>
): Array<{ name: string; url: string }> {
  return [
    { name: 'Inicio', url: '/' },
    ...items.map((item) => ({
      name: item.name,
      url: item.path,
    })),
  ];
}
