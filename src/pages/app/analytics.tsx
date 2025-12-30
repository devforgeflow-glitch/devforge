import { useState } from 'react';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { Layout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';

/**
 * Página de Analytics
 *
 * Dashboard com métricas e gráficos de todas as pesquisas.
 *
 * @version 1.0.0
 */

// Dados de exemplo
const MOCK_STATS = {
  totalSurveys: 12,
  activeSurveys: 5,
  totalResponses: 2847,
  averageNPS: 72,
  responseRate: 68,
  averageCompletionTime: '2:35',
};

const MOCK_NPS_DISTRIBUTION = {
  promoters: 58,
  passives: 24,
  detractors: 18,
};

const MOCK_RESPONSE_TREND = [
  { date: '22/12', count: 42 },
  { date: '23/12', count: 58 },
  { date: '24/12', count: 35 },
  { date: '25/12', count: 22 },
  { date: '26/12', count: 67 },
  { date: '27/12', count: 89 },
  { date: '28/12', count: 76 },
];

const MOCK_TOP_SURVEYS = [
  { id: '1', title: 'Pesquisa de Satisfação Q4', responses: 512, nps: 78 },
  { id: '2', title: 'Feedback de Produto', responses: 328, nps: 65 },
  { id: '3', title: 'NPS Trimestral', responses: 245, nps: 72 },
  { id: '4', title: 'Avaliação de Atendimento', responses: 189, nps: 81 },
];

const MOCK_RECENT_RESPONSES = [
  { surveyTitle: 'Pesquisa de Satisfação Q4', rating: 5, time: '2 min atrás' },
  { surveyTitle: 'Feedback de Produto', rating: 4, time: '15 min atrás' },
  { surveyTitle: 'NPS Trimestral', rating: 9, time: '32 min atrás' },
  { surveyTitle: 'Pesquisa de Satisfação Q4', rating: 5, time: '1h atrás' },
  { surveyTitle: 'Avaliação de Atendimento', rating: 4, time: '2h atrás' },
];

type Period = '7d' | '30d' | '90d' | '1y';
const PERIODS: Period[] = ['7d', '30d', '90d', '1y'];

export default function AnalyticsPage() {
  const t = useTranslations();
  const [period, setPeriod] = useState<Period>('7d');

  const stats = MOCK_STATS;
  const npsDistribution = MOCK_NPS_DISTRIBUTION;
  const responseTrend = MOCK_RESPONSE_TREND;
  const topSurveys = MOCK_TOP_SURVEYS;
  const recentResponses = MOCK_RECENT_RESPONSES;

  // Calcula altura máxima para o gráfico de barras
  const maxResponses = Math.max(...responseTrend.map((d) => d.count));

  return (
    <>
      <Head>
        <title>{t('analyticsPage.meta.title')}</title>
        <meta name="description" content={t('analyticsPage.meta.description')} />
      </Head>

      <Layout title={t('analyticsPage.title')} description={t('analyticsPage.description')}>
        <div className="container-app py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t('analyticsPage.header.title')}</h2>
            <p className="text-muted-foreground">
              {t('analyticsPage.header.subtitle')}
            </p>
          </div>

          {/* Period selector */}
          <div className="flex gap-2">
            {PERIODS.map((p) => (
              <Button
                key={p}
                variant={period === p ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
              >
                {t(`analyticsPage.periods.${p}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('analyticsPage.stats.surveys')}</p>
              <p className="text-3xl font-bold">{stats.totalSurveys}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {t('analyticsPage.stats.surveysActive', { count: stats.activeSurveys })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('analyticsPage.stats.responses')}</p>
              <p className="text-3xl font-bold">{stats.totalResponses.toLocaleString()}</p>
              <p className="text-xs text-green-600 dark:text-green-400">{t('analyticsPage.stats.responsesChange')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('analyticsPage.stats.averageNps')}</p>
              <p className="text-3xl font-bold text-primary">{stats.averageNPS}</p>
              <p className="text-xs text-muted-foreground">{t('analyticsPage.stats.npsExcellent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('analyticsPage.stats.responseRate')}</p>
              <p className="text-3xl font-bold">{stats.responseRate}%</p>
              <p className="text-xs text-green-600 dark:text-green-400">{t('analyticsPage.stats.responseRateChange')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('analyticsPage.stats.avgTime')}</p>
              <p className="text-3xl font-bold">{stats.averageCompletionTime}</p>
              <p className="text-xs text-muted-foreground">{t('analyticsPage.stats.avgTimeUnit')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('analyticsPage.stats.completion')}</p>
              <p className="text-3xl font-bold">85%</p>
              <p className="text-xs text-muted-foreground">{t('analyticsPage.stats.completionOf')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Response Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('analyticsPage.charts.responseTrend')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-2">
                {responseTrend.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all"
                      style={{
                        height: `${(day.count / maxResponses) * 100}%`,
                        minHeight: '8px',
                      }}
                      title={t('analyticsPage.charts.responsesTooltip', { count: day.count })}
                    />
                    <span className="text-xs text-muted-foreground">{day.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* NPS Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t('analyticsPage.charts.npsDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* NPS Score */}
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary">{stats.averageNPS}</p>
                  <p className="text-sm text-muted-foreground">{t('analyticsPage.charts.netPromoterScore')}</p>
                </div>

                {/* Distribution bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-600">{t('analyticsPage.charts.promoters')}</span>
                      <span className="font-medium">{npsDistribution.promoters}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${npsDistribution.promoters}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-yellow-600">{t('analyticsPage.charts.passives')}</span>
                      <span className="font-medium">{npsDistribution.passives}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${npsDistribution.passives}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-600">{t('analyticsPage.charts.detractors')}</span>
                      <span className="font-medium">{npsDistribution.detractors}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${npsDistribution.detractors}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Surveys */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('analyticsPage.topSurveys.title')}</CardTitle>
              <Badge variant="secondary">{t('analyticsPage.topSurveys.badge')}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSurveys.map((survey, index) => (
                  <div
                    key={survey.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{survey.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('analyticsPage.topSurveys.responses', { count: survey.responses })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{survey.nps}</p>
                      <p className="text-xs text-muted-foreground">NPS</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Responses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('analyticsPage.recentResponses.title')}</CardTitle>
              <Badge variant="success">{t('analyticsPage.recentResponses.badge')}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResponses.map((response, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <span className="text-lg font-semibold text-primary">
                        {response.rating}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{response.surveyTitle}</p>
                      <p className="text-sm text-muted-foreground">{response.time}</p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < response.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-muted-foreground/30'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights (placeholder) */}
        <Card className="mt-8 border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {t('analyticsPage.aiInsights.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p className="text-sm">
                  <strong>{t('analyticsPage.aiInsights.positive.label')}</strong> {t('analyticsPage.aiInsights.positive.text')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                <p className="text-sm">
                  <strong>{t('analyticsPage.aiInsights.opportunity.label')}</strong> {t('analyticsPage.aiInsights.opportunity.text')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-sm">
                  <strong>{t('analyticsPage.aiInsights.highlight.label')}</strong> {t('analyticsPage.aiInsights.highlight.text')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </Layout>
    </>
  );
}

// Carregar traduções
export async function getStaticProps({ locale }: { locale?: string }) {
  const { loadMessages } = await import('@/i18n');
  return {
    props: {
      messages: await loadMessages(locale || 'pt-BR'),
    },
  };
}
