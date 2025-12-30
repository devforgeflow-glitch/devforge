import Head from 'next/head';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';
import { HelpCircle, AlertTriangle, MessageSquare } from 'lucide-react';

/**
 * Página de Preços/Planos
 *
 * Exibe os planos disponíveis e permite upgrade.
 * Totalmente traduzida para PT-BR, EN e ES.
 *
 * @version 2.0.0
 */

const PLANS = [
  {
    id: 'free',
    price: 0,
    popular: false,
    featureKeys: ['activeSurveys', 'responses', 'basicQuestions', 'csvExport', 'emailSupport'],
    featureValues: { activeSurveys: 3, responses: 100 },
    limitationKeys: ['noAi', 'noWhitelabel', 'noApi'],
    ctaVariant: 'outline' as const,
  },
  {
    id: 'pro',
    price: 97,
    popular: true,
    featureKeys: ['unlimitedSurveys', 'responses', 'allQuestions', 'aiGeneration', 'aiSentiment', 'fullExport', 'webhooks', 'prioritySupport'],
    featureValues: { responses: 5000 },
    limitationKeys: [],
    ctaVariant: 'primary' as const,
  },
  {
    id: 'enterprise',
    price: 297,
    popular: false,
    featureKeys: ['allPro', 'unlimitedResponses', 'whitelabel', 'api', 'sso', 'multiOrg', 'sla', 'accountManager', 'onboarding'],
    featureValues: {},
    limitationKeys: [],
    ctaVariant: 'outline' as const,
  },
];

const COMPARISON_ROWS = [
  { key: 'activeSurveys', free: '3', pro: 'unlimited', enterprise: 'unlimited' },
  { key: 'responsesMonth', free: '100', pro: '5,000', enterprise: 'unlimited' },
  { key: 'teamMembers', free: '1', pro: '5', enterprise: 'unlimited' },
  { key: 'aiGeneration', free: false, pro: true, enterprise: true },
  { key: 'sentimentAnalysis', free: false, pro: true, enterprise: true },
  { key: 'whitelabel', free: false, pro: false, enterprise: true },
  { key: 'apiAccess', free: false, pro: false, enterprise: true },
  { key: 'webhooks', free: false, pro: true, enterprise: true },
  { key: 'sso', free: false, pro: false, enterprise: true },
  { key: 'prioritySupport', free: false, pro: true, enterprise: true },
];

export default function PricingPage() {
  const t = useTranslations();

  const getFeatureText = (plan: typeof PLANS[0], key: string) => {
    if (key === 'activeSurveys' && plan.featureValues.activeSurveys) {
      return t('pricing.features.activeSurveys', { count: plan.featureValues.activeSurveys });
    }
    if (key === 'responses' && plan.featureValues.responses) {
      return t('pricing.features.responses', { count: plan.featureValues.responses.toLocaleString() });
    }
    return t(`pricing.features.${key}`);
  };

  return (
    <>
      <Head>
        <title>{t('pricing.meta.title')}</title>
        <meta name="description" content={t('pricing.meta.description')} />
      </Head>

      <Layout title={t('nav.pricing')} description={t('pricing.hero.description')}>
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="container-app">
            <Badge variant="secondary" className="mb-4">
              {t('pricing.hero.badge')}
            </Badge>
            <h1 className="heading-1 mb-4">
              {t('pricing.hero.title')}{' '}
              <span className="gradient-text">{t('pricing.hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.hero.description')}
            </p>

            {/* Disclaimer importante */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      {t('pricing.disclaimer.title')}
                    </h3>
                    <p
                      className="text-sm text-amber-700 dark:text-amber-300 mb-3"
                      dangerouslySetInnerHTML={{ __html: t('pricing.disclaimer.description') }}
                    />
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {t('pricing.disclaimer.factors')}
                    </p>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1 list-disc list-inside">
                      <li>{t('pricing.disclaimer.factor1')}</li>
                      <li>{t('pricing.disclaimer.factor2')}</li>
                      <li>{t('pricing.disclaimer.factor3')}</li>
                      <li>{t('pricing.disclaimer.factor4')}</li>
                    </ul>
                    <div className="mt-4">
                      <Link href="/contact">
                        <Button size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          {t('pricing.disclaimer.requestQuote')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="pb-16">
          <div className="container-app">
            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
              {PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.popular
                      ? 'border-primary shadow-lg scale-105'
                      : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>{t('pricing.plans.pro.popular')}</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{t(`pricing.plans.${plan.id}.name`)}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t(`pricing.plans.${plan.id}.description`)}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-4">
                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm text-muted-foreground">{t('pricing.currency')}</span>
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">/{t('pricing.period')}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href={plan.id === 'enterprise' ? '/contact' : '/signup'}>
                      <Button
                        variant={plan.ctaVariant}
                        className="w-full mb-6"
                        size="lg"
                      >
                        {t(`pricing.plans.${plan.id}.cta`)}
                      </Button>
                    </Link>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.featureKeys.map((key, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <svg
                            className="h-5 w-5 text-green-500 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm">{getFeatureText(plan, key)}</span>
                        </div>
                      ))}

                      {plan.limitationKeys.map((key, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <svg
                            className="h-5 w-5 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm">{t(`pricing.limitations.${key}`)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">{t('pricing.comparison.title')}</h2>
              <p className="text-muted-foreground">{t('pricing.comparison.subtitle')}</p>
            </div>

            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4">{t('pricing.comparison.feature')}</th>
                    <th className="text-center py-4 px-4">{t('pricing.plans.free.name')}</th>
                    <th className="text-center py-4 px-4 bg-primary/5">{t('pricing.plans.pro.name')}</th>
                    <th className="text-center py-4 px-4">{t('pricing.plans.enterprise.name')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {COMPARISON_ROWS.map((row, index) => (
                    <tr key={index}>
                      <td className="py-4 px-4 font-medium">{t(`pricing.comparison.${row.key}`)}</td>
                      <td className="text-center py-4 px-4">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-muted-foreground/50 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-sm">{row.free}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4 bg-primary/5">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-muted-foreground/50 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-sm font-medium">
                            {row.pro === 'unlimited' ? t('pricing.comparison.unlimited') : row.pro}
                          </span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-muted-foreground/50 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-sm">
                            {row.enterprise === 'unlimited' ? t('pricing.comparison.unlimited') : row.enterprise}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ - Acordeão */}
        <section className="py-16">
          <div className="container-app">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <HelpCircle className="h-3 w-3 mr-1" />
                FAQ
              </Badge>
              <h2 className="heading-2 mb-4">{t('pricing.faq.title')}</h2>
              <p className="text-muted-foreground">{t('pricing.faq.subtitle')}</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" defaultOpen={['q1']}>
                {['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].map((qKey, index) => (
                  <AccordionItem key={qKey} id={qKey}>
                    <AccordionTrigger
                      icon={
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </span>
                      }
                    >
                      {t(`pricing.faq.${qKey}.question`)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground pl-11">
                        {t(`pricing.faq.${qKey}.answer`)}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('pricing.faqFooter.notFound')}
                </p>
                <Link href="/contact">
                  <Button variant="outline">
                    {t('pricing.faqFooter.contactUs')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container-app text-center">
            <h2 className="heading-2 mb-4">{t('pricing.ctaSection.title')}</h2>
            <p className="text-lg opacity-90 mb-4 max-w-2xl mx-auto">
              {t('pricing.ctaSection.description')}
            </p>
            <p className="text-sm opacity-70 mb-8 max-w-xl mx-auto">
              {t('pricing.ctaSection.note')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t('pricing.ctaSection.requestQuote')}
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  {t('pricing.ctaSection.knowMore')}
                </Button>
              </Link>
            </div>
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
