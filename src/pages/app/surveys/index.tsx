import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button, Input, Spinner } from '@/components/ui';
import { SurveyCard, EmptyState } from '@/components/surveys';
import type { SurveyStatus } from '@/api/types/survey.types';

/**
 * Pagina de Listagem de Pesquisas
 *
 * Lista todas as pesquisas do usuario com filtros e busca.
 *
 * @version 1.0.0
 */

// Dados de exemplo (substituir por dados reais via API)
const MOCK_SURVEYS = [
  {
    id: '1',
    title: 'Pesquisa de Satisfacao Q4 2024',
    description: 'Avaliacao trimestral de satisfacao dos clientes com nossos produtos e servicos.',
    status: 'active' as SurveyStatus,
    responseCount: 245,
    questionCount: 10,
    createdAt: '2024-12-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Feedback de Novo Produto',
    description: 'Coleta de opinioes sobre o lancamento do produto XYZ.',
    status: 'active' as SurveyStatus,
    responseCount: 128,
    questionCount: 8,
    createdAt: '2024-12-18T14:30:00Z',
  },
  {
    id: '3',
    title: 'Avaliacao de Atendimento',
    description: 'Pesquisa para medir a qualidade do atendimento ao cliente.',
    status: 'draft' as SurveyStatus,
    responseCount: 0,
    questionCount: 5,
    createdAt: '2024-12-15T09:00:00Z',
  },
  {
    id: '4',
    title: 'NPS Trimestral',
    description: 'Net Promoter Score do terceiro trimestre.',
    status: 'closed' as SurveyStatus,
    responseCount: 512,
    questionCount: 3,
    createdAt: '2024-12-01T11:00:00Z',
  },
  {
    id: '5',
    title: 'Pesquisa de Clima Organizacional',
    description: 'Avaliacao interna do clima e satisfacao dos colaboradores.',
    status: 'paused' as SurveyStatus,
    responseCount: 89,
    questionCount: 15,
    createdAt: '2024-11-28T16:00:00Z',
  },
];

type FilterStatus = 'all' | SurveyStatus;

export default function SurveysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isLoading] = useState(false);

  // Filtra pesquisas
  const filteredSurveys = MOCK_SURVEYS.filter((survey) => {
    const matchesSearch =
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || survey.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    // TODO: Implementar delete via API
    console.log('Delete survey:', id);
  };

  const handleDuplicate = (id: string) => {
    // TODO: Implementar duplicacao via API
    console.log('Duplicate survey:', id);
  };

  return (
    <>
      <Head>
        <title>Pesquisas | DevForge</title>
        <meta name="description" content="Gerencie suas pesquisas" />
      </Head>

      <AuthLayout title="Pesquisas">
        {/* Header com acoes */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Minhas Pesquisas</h2>
            <p className="text-muted-foreground">
              Gerencie e acompanhe suas pesquisas de feedback
            </p>
          </div>

          <Link href="/app/surveys/new">
            <Button>
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nova Pesquisa
            </Button>
          </Link>
        </div>

        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Busca */}
          <div className="flex-1">
            <Input
              placeholder="Buscar pesquisas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filtro de status */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Todos' },
              { value: 'active', label: 'Ativos' },
              { value: 'draft', label: 'Rascunhos' },
              { value: 'paused', label: 'Pausados' },
              { value: 'closed', label: 'Encerrados' },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={filterStatus === filter.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(filter.value as FilterStatus)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {/* Lista de pesquisas */}
        {!isLoading && filteredSurveys.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSurveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                id={survey.id}
                title={survey.title}
                description={survey.description}
                status={survey.status}
                responseCount={survey.responseCount}
                questionCount={survey.questionCount}
                createdAt={survey.createdAt}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {!isLoading && filteredSurveys.length === 0 && (
          <EmptyState
            title={searchTerm ? 'Nenhuma pesquisa encontrada' : 'Nenhuma pesquisa ainda'}
            description={
              searchTerm
                ? 'Tente ajustar os filtros ou termos de busca.'
                : 'Crie sua primeira pesquisa para comecar a coletar feedbacks.'
            }
            showCreateButton={!searchTerm}
          />
        )}

        {/* Metricas rapidas */}
        {!isLoading && MOCK_SURVEYS.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total de Pesquisas</p>
              <p className="text-2xl font-bold">{MOCK_SURVEYS.length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Pesquisas Ativas</p>
              <p className="text-2xl font-bold text-green-600">
                {MOCK_SURVEYS.filter((s) => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total de Respostas</p>
              <p className="text-2xl font-bold">
                {MOCK_SURVEYS.reduce((acc, s) => acc + s.responseCount, 0)}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Media por Pesquisa</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  MOCK_SURVEYS.reduce((acc, s) => acc + s.responseCount, 0) /
                    MOCK_SURVEYS.length
                )}
              </p>
            </div>
          </div>
        )}
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
