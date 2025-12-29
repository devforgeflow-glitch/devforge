import Head from 'next/head';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Pagina do Dashboard
 *
 * Visao geral das pesquisas e metricas do usuario.
 *
 * @version 1.0.0
 */

// Dados de exemplo (substituir por dados reais)
const stats = [
  {
    title: 'Total de Pesquisas',
    value: '12',
    change: '+2 este mes',
    trend: 'up',
  },
  {
    title: 'Respostas Coletadas',
    value: '1,234',
    change: '+180 esta semana',
    trend: 'up',
  },
  {
    title: 'Taxa de Resposta',
    value: '68%',
    change: '+5% vs anterior',
    trend: 'up',
  },
  {
    title: 'NPS Medio',
    value: '72',
    change: 'Excelente',
    trend: 'neutral',
  },
];

const recentSurveys = [
  {
    id: '1',
    title: 'Pesquisa de Satisfacao Q4',
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
    title: 'Avaliacao de Atendimento',
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
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'closed':
        return <Badge variant="default">Encerrado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | DevForge</title>
        <meta name="description" content="Painel de controle DevForge" />
      </Head>

      <AuthLayout title="Dashboard">
        {/* Boas-vindas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            Ola, {user?.displayName || 'Usuario'}!
          </h2>
          <p className="text-muted-foreground">
            Aqui esta um resumo das suas pesquisas e metricas.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p
                  className={`text-xs mt-1 ${
                    stat.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stat.change}
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
            Nova Pesquisa
          </Button>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar Dados
          </Button>
        </div>

        {/* Recent Surveys */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pesquisas Recentes</CardTitle>
            <Link href="/app/surveys" className="text-sm text-primary hover:underline">
              Ver todas
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
                      Criado em {new Date(survey.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {survey.responses} respostas
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
              <h3 className="font-medium">Dica: Use IA para criar perguntas</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Nossa IA pode gerar perguntas relevantes baseadas no objetivo da sua pesquisa.
                Experimente ao criar uma nova pesquisa!
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    </>
  );
}

// Carregar traducoes
export async function getStaticProps({ locale }: { locale?: string }) {
  const { loadMessages } = await import('@/i18n');
  return {
    props: {
      messages: await loadMessages(locale || 'pt-BR'),
    },
  };
}
