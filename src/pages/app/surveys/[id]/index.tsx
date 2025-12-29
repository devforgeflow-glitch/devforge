import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Spinner,
  Input,
} from '@/components/ui';
import type { SurveyStatus, QuestionType } from '@/api/types/survey.types';

/**
 * Pagina de Detalhes da Pesquisa
 *
 * Exibe detalhes, metricas e permite gerenciar uma pesquisa.
 *
 * @version 1.0.0
 */

// Dados de exemplo (substituir por dados reais via API)
const MOCK_SURVEY = {
  id: '1',
  title: 'Pesquisa de Satisfacao Q4 2024',
  description: 'Avaliacao trimestral de satisfacao dos clientes com nossos produtos e servicos.',
  status: 'active' as SurveyStatus,
  responseCount: 245,
  createdAt: '2024-12-20T10:00:00Z',
  publishedAt: '2024-12-21T08:00:00Z',
  settings: {
    allowAnonymous: true,
    requireEmail: false,
    showProgressBar: true,
  },
  questions: [
    {
      id: 'q1',
      type: 'rating' as QuestionType,
      text: 'Como voce avalia sua experiencia geral?',
      required: true,
    },
    {
      id: 'q2',
      type: 'nps' as QuestionType,
      text: 'De 0 a 10, qual a probabilidade de voce nos recomendar?',
      required: true,
    },
    {
      id: 'q3',
      type: 'choice' as QuestionType,
      text: 'Qual aspecto voce mais valoriza?',
      options: ['Qualidade', 'Preco', 'Atendimento', 'Rapidez'],
      required: false,
    },
    {
      id: 'q4',
      type: 'text' as QuestionType,
      text: 'O que podemos melhorar?',
      description: 'Sua opiniao e muito importante para nos.',
      required: false,
    },
  ],
};

// Metricas de exemplo
const MOCK_METRICS = {
  averageRating: 4.2,
  npsScore: 72,
  completionRate: 85,
  averageTime: '2:45',
  responsesByDay: [12, 18, 25, 32, 28, 45, 38, 47],
};

function getStatusConfig(status: SurveyStatus) {
  switch (status) {
    case 'active':
      return { variant: 'success' as const, text: 'Ativo' };
    case 'draft':
      return { variant: 'secondary' as const, text: 'Rascunho' };
    case 'paused':
      return { variant: 'warning' as const, text: 'Pausado' };
    case 'closed':
      return { variant: 'default' as const, text: 'Encerrado' };
  }
}

function getQuestionTypeLabel(type: QuestionType) {
  const labels: Record<QuestionType, string> = {
    text: 'Texto',
    rating: 'Avaliacao',
    nps: 'NPS',
    choice: 'Multipla Escolha',
    matrix: 'Matriz',
    date: 'Data',
  };
  return labels[type] || type;
}

export default function SurveyDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [isLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const survey = MOCK_SURVEY; // TODO: Buscar via API
  const metrics = MOCK_METRICS;
  const statusConfig = getStatusConfig(survey.status);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${id}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus: SurveyStatus) => {
    // TODO: Implementar via API
    console.log('Changing status to:', newStatus);
  };

  if (isLoading) {
    return (
      <AuthLayout title="Carregando...">
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{survey.title} | DevForge</title>
        <meta name="description" content={survey.description} />
      </Head>

      <AuthLayout title={survey.title}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <Link
              href="/app/surveys"
              className="p-2 rounded-lg hover:bg-muted transition-colors mt-1"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold">{survey.title}</h2>
                <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>
              </div>
              <p className="text-muted-foreground">{survey.description}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {survey.status === 'draft' && (
              <Button onClick={() => handleStatusChange('active')}>
                Publicar
              </Button>
            )}
            {survey.status === 'active' && (
              <Button variant="outline" onClick={() => handleStatusChange('paused')}>
                Pausar
              </Button>
            )}
            {survey.status === 'paused' && (
              <Button onClick={() => handleStatusChange('active')}>
                Retomar
              </Button>
            )}
            <Link href={`/app/surveys/${id}/edit`}>
              <Button variant="outline">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Button>
            </Link>
          </div>
        </div>

        {/* Compartilhar */}
        {survey.status === 'active' && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium mb-1">Link de compartilhamento</p>
                  <p className="text-sm text-muted-foreground">
                    Compartilhe este link para coletar respostas
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="w-64"
                  />
                  <Button onClick={handleCopyLink}>
                    {copied ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metricas */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Respostas</p>
              <p className="text-3xl font-bold">{survey.responseCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avaliacao Media</p>
              <p className="text-3xl font-bold">{metrics.averageRating}/5</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">NPS Score</p>
              <p className="text-3xl font-bold text-primary">{metrics.npsScore}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Taxa de Conclusao</p>
              <p className="text-3xl font-bold">{metrics.completionRate}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Perguntas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas ({survey.questions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {survey.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{question.text}</p>
                          {question.required && (
                            <span className="text-xs text-destructive">*</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {getQuestionTypeLabel(question.type)}
                          </Badge>
                          {question.options && (
                            <span className="text-xs text-muted-foreground">
                              {question.options.length} opcoes
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informacoes */}
            <Card>
              <CardHeader>
                <CardTitle>Informacoes</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Criado em</dt>
                    <dd>{new Date(survey.createdAt).toLocaleDateString('pt-BR')}</dd>
                  </div>
                  {survey.publishedAt && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Publicado em</dt>
                      <dd>{new Date(survey.publishedAt).toLocaleDateString('pt-BR')}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tempo medio</dt>
                    <dd>{metrics.averageTime}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Configuracoes */}
            <Card>
              <CardHeader>
                <CardTitle>Configuracoes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    {survey.settings.allowAnonymous ? (
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Respostas anonimas
                  </li>
                  <li className="flex items-center gap-2">
                    {survey.settings.requireEmail ? (
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Email obrigatorio
                  </li>
                  <li className="flex items-center gap-2">
                    {survey.settings.showProgressBar ? (
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Barra de progresso
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Acoes */}
            <Card>
              <CardHeader>
                <CardTitle>Acoes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/app/surveys/${id}/responses`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Ver Respostas
                  </Button>
                </Link>
                <Link href={`/app/surveys/${id}/analytics`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exportar CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
