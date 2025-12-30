import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { Info, X } from 'lucide-react';

/**
 * Página de Recursos/Features
 *
 * Apresenta todas as funcionalidades da plataforma
 * com explicações simples para usuários não-técnicos.
 *
 * @version 3.0.0
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
  integration: { api: '🔌', webhooks: '🔗', export: '📤', automation: '⚡' },
};

// Highlights - chaves para traduções
const HIGHLIGHTS = [
  { value: '99.9%', key: 'uptime' },
  { value: '<100ms', key: 'response' },
  { value: '256-bit', key: 'encryption' },
  { value: 'LGPD', key: 'compliance' },
];

// Badges de segurança - chaves para traduções
const SECURITY_BADGES = [
  { icon: '🔐', key: 'ssl' },
  { icon: '🛡️', key: 'waf' },
  { icon: '🔍', key: 'sast' },
  { icon: '📋', key: 'soc2' },
  { icon: '🇧🇷', key: 'lgpd' },
  { icon: '🇪🇺', key: 'gdpr' },
];

// Componente de badge com tooltip
function SecurityBadgeWithTooltip({
  badge,
  isOpen,
  onToggle,
  t,
}: {
  badge: typeof SECURITY_BADGES[0];
  isOpen: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-full bg-background/80 backdrop-blur rounded-lg p-4 text-center hover:bg-background transition-colors group"
      >
        <div className="text-3xl mb-2">{badge.icon}</div>
        <p className="font-medium">{t(`features.securityBadges.${badge.key}.label`)}</p>
        <p className="text-xs text-muted-foreground mt-1">{t(`features.securityBadges.${badge.key}.simpleName`)}</p>
        <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <Info className="h-4 w-4" />
        </div>
      </button>

      {/* Tooltip expandido */}
      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-background border border-border rounded-xl shadow-xl">
          <button
            onClick={onToggle}
            className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-2xl mb-2">{badge.icon}</div>
          <p className="font-semibold text-sm mb-1">{t(`features.securityBadges.${badge.key}.simpleName`)}</p>
          <p className="text-xs text-muted-foreground">{t(`features.securityBadges.${badge.key}.explanation`)}</p>
          <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
            {t('features.security.technicalTerm')} {t(`features.securityBadges.${badge.key}.label`)}
          </p>
          {/* Setinha do tooltip */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-background border-r border-b border-border" />
        </div>
      )}
    </div>
  );
}

export default function FeaturesPage() {
  const t = useTranslations();
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);
  const [showHighlightInfo, setShowHighlightInfo] = useState<number | null>(null);

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

            {/* Highlights com explicações */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {HIGHLIGHTS.map((item, index) => (
                <div key={index} className="text-center relative group">
                  <button
                    onClick={() => setShowHighlightInfo(showHighlightInfo === index ? null : index)}
                    className="focus:outline-none"
                  >
                    <p className="text-3xl font-bold text-primary">{item.value}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
                      {t(`features.highlights.${item.key}`)}
                      <Info className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                    </p>
                  </button>

                  {/* Explicação expandida */}
                  {showHighlightInfo === index && (
                    <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-3 bg-background border border-border rounded-lg shadow-xl text-left">
                      <button
                        onClick={() => setShowHighlightInfo(null)}
                        className="absolute top-1 right-1 p-1 hover:bg-muted rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="text-xs text-muted-foreground pr-4">
                        {t(`features.highlightExplanations.${item.key}`)}
                      </p>
                    </div>
                  )}
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

        {/* Security Section com explicacoes */}
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

                {/* Link para ver mais detalhes */}
                <div className="mt-6">
                  <Link
                    href="/about#security"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                  >
                    <Info className="h-4 w-4" />
                    {t('features.security.seeDetails')}
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 lg:p-12">
                <p className="text-center text-sm text-muted-foreground mb-6">
                  {t('features.security.clickToLearn')}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {SECURITY_BADGES.map((badge, index) => (
                    <SecurityBadgeWithTooltip
                      key={index}
                      badge={badge}
                      isOpen={openTooltip === index}
                      onToggle={() => setOpenTooltip(openTooltip === index ? null : index)}
                      t={t}
                    />
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
