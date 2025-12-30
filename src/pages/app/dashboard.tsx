import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { Layout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Página do Dashboard
 *
 * Visão geral das pesquisas e métricas do usuário.
 *
 * @version 1.0.0
 */

// Dados de exemplo (substituir por dados reais)
const STATS_KEYS = ['totalSurveys', 'responses', 'responseRate', 'nps'] as const;
const STATS_VALUES = ['12', '1,234', '68%', '72'];
const STATS_TRENDS = ['up', 'up', 'up', 'neutral'] as const;

const recentSurveys = [
  {
    id: '1',
    title: 'Pesquisa de Satisfação Q4',
    status: 'active',
    responses: 245,
    createdAt: '2024-12-20',
  },
  {
    id: '2',
    title: 'Feedback de Produto',
    status: 'active',
    responses: 128,
    createdAt: '2024-12-18',
  },
  {
    id: '3',
    title: 'Avaliação de Atendimento',
    status: 'draft',
    responses: 0,
    createdAt: '2024-12-15',
  },
  {
    id: '4',
    title: 'NPS Trimestral',
    status: 'closed',
    responses: 512,
    createdAt: '2024-12-01',
  },
];

export default function DashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">{t('dashboardPage.status.active')}</Badge>;
      case 'draft':
        return <Badge variant="secondary">{t('dashboardPage.status.draft')}</Badge>;
      case 'closed':
        return <Badge variant="default">{t('dashboardPage.status.closed')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(router.locale || 'pt-BR');
  };

  return (
    <>
      <Head>
        <title>{t('dashboardPage.meta.title')}</title>
        <meta name="description" content={t('dashboardPage.meta.description')} />
      </Head>

      <Layout title={t('dashboardPage.title')} description={t('dashboardPage.description')}>
        <div className="container-app py-8">
        {/* Boas-vindas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            {user?.displayName
              ? t('dashboardPage.welcome', { name: user.displayName })
              : t('dashboardPage.welcomeDefault')
            }
          </h2>
          <p className="text-muted-foreground">
            {t('dashboardPage.summary')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {STATS_KEYS.map((key, index) => (
            <Card key={key}>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {t(`dashboardPage.stats.${key}.title`)}
                </p>
                <p className="text-3xl font-bold mt-2">{STATS_VALUES[index]}</p>
                <p
                  className={`text-xs mt-1 ${
                    STATS_TRENDS[index] === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {t(`dashboardPage.stats.${key}.change`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('dashboardPage.actions.newSurvey')}
          </Button>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('dashboardPage.actions.exportData')}
          </Button>
        </div>

        {/* Recent Surveys */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboardPage.recentSurveys.title')}</CardTitle>
            <Link href="/app/surveys" className="text-sm text-primary hover:underline">
              {t('dashboardPage.recentSurveys.viewAll')}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSurveys.map((survey) => (
                <div
                  key={survey.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/app/surveys/${survey.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {survey.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {t('dashboardPage.recentSurveys.createdAt', { date: formatDate(survey.createdAt) })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {t('dashboardPage.recentSurveys.responses', { count: survey.responses })}
                    </span>
                    {getStatusBadge(survey.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-8" variant="ghost">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t('dashboardPage.tip.title')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('dashboardPage.tip.description')}
              </p>
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
