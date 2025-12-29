import Head from 'next/head';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Badge } from '@/components/ui';

/**
 * Pagina de Recursos/Features
 *
 * Apresenta todas as funcionalidades da plataforma.
 * Totalmente traduzida para PT-BR, EN e ES.
 *
 * @version 2.0.0
 */

const CATEGORY_KEYS = ['surveys', 'collection', 'analytics', 'integration'] as const;
const FEATURE_KEYS = {
  surveys: ['editor', 'ai', 'types', 'customization'],
  collection: ['link', 'responsive', 'anonymous', 'progress'],
  analytics: ['dashboard', 'sentiment', 'nps', 'insights'],
  integration: ['api', 'webhooks', 'export', 'automation'],
} as const;

const FEATURE_ICONS: Record<string, Record<string, string>> = {
  surveys: { editor: '📝', ai: '🤖', types: '📊', customization: '🎨' },
  collection: { link: '🔗', responsive: '📱', anonymous: '🔒', progress: '⏱️' },
  analytics: { dashboard: '📈', sentiment: '🧠', nps: '📊', insights: '💡' },
  integration: { api: '🔌', webhooks: '🪝', export: '📤', automation: '⚡' },
};

const HIGHLIGHTS = [
  { value: '99.9%', key: 'uptime' },
  { value: '<100ms', key: 'response' },
  { value: '256-bit', key: 'encryption' },
  { value: 'LGPD', key: 'compliance' },
];

const SECURITY_BADGES = [
  { icon: '🔐', label: 'SSL/TLS' },
  { icon: '🛡️', label: 'WAF' },
  { icon: '🔍', label: 'SAST/DAST' },
  { icon: '📋', label: 'SOC 2' },
  { icon: '🇧🇷', label: 'LGPD' },
  { icon: '🇪🇺', label: 'GDPR' },
];

export default function FeaturesPage() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t('features.meta.title')}</title>
        <meta name="description" content={t('features.meta.description')} />
      </Head>

      <Layout title={t('nav.features')} description={t('features.hero.description')}>
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="container-app">
            <Badge variant="secondary" className="mb-4">
              {t('features.hero.badge')}
            </Badge>
            <h1 className="heading-1 mb-4">
              {t('features.hero.title')}{' '}
              <span className="gradient-text">{t('features.hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('features.hero.description')}
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {HIGHLIGHTS.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold text-primary">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{t(`features.highlights.${item.key}`)}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg">{t('features.cta.start')}</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  {t('features.cta.plans')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        {CATEGORY_KEYS.map((categoryKey, categoryIndex) => (
          <section
            key={categoryKey}
            className={`py-16 ${categoryIndex % 2 === 1 ? 'bg-muted/30' : ''}`}
          >
            <div className="container-app">
              <div className="text-center mb-12">
                <h2 className="heading-2 mb-3">{t(`features.categories.${categoryKey}.title`)}</h2>
                <p className="text-muted-foreground">{t(`features.categories.${categoryKey}.description`)}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {FEATURE_KEYS[categoryKey].map((featureKey) => (
                  <Card key={featureKey} className="h-full">
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-4">{FEATURE_ICONS[categoryKey][featureKey]}</div>
                      <h3 className="font-semibold mb-2">
                        {t(`features.categories.${categoryKey}.${featureKey}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`features.categories.${categoryKey}.${featureKey}.description`)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Security Section */}
        <section className="py-16">
          <div className="container-app">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  {t('features.security.badge')}
                </Badge>
                <h2 className="heading-2 mb-4">
                  {t('features.security.title')}{' '}
                  <span className="gradient-text">{t('features.security.titleHighlight')}</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t('features.security.description')}
                </p>

                <ul className="space-y-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <li key={index} className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-green-500 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span>{t(`features.security.items.${index}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  {SECURITY_BADGES.map((item, index) => (
                    <div
                      key={index}
                      className="bg-background/80 backdrop-blur rounded-lg p-4 text-center"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <p className="font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container-app text-center">
            <h2 className="heading-2 mb-4">{t('features.cta.title')}</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              {t('features.cta.description')}
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                {t('features.cta.button')}
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const { loadMessages } = await import('@/i18n');
  return {
    props: {
      messages: await loadMessages(locale || 'pt-BR'),
    },
  };
}
