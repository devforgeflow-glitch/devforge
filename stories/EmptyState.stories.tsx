import type { Meta, StoryObj } from '@storybook/react';
import {
  EmptyState,
  EmptyStateSearch,
  EmptyStateNoResults,
  EmptyStateFavorites,
  EmptyStateSurveys,
  EmptyStateAnalytics,
} from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Plus, Search, RefreshCw } from 'lucide-react';

/**
 * Componente EmptyState
 *
 * Exibe estados vazios com icone, titulo, descricao e acao opcional.
 * Usado quando nao ha dados para exibir.
 */
const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente para exibir estados vazios em listas, tabelas e dashboards.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'search', 'no-results', 'folder', 'favorites', 'cart', 'notifications', 'users', 'surveys', 'analytics'],
      description: 'Variante com icone pre-definido',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Tamanho do componente',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

/**
 * Estado vazio padrao
 */
export const Default: Story = {
  args: {
    title: 'Nenhum item encontrado',
    description: 'Nao ha itens para exibir no momento.',
  },
};

/**
 * Com acao
 */
export const WithAction: Story = {
  render: () => (
    <EmptyState
      title="Nenhuma pesquisa criada"
      description="Crie sua primeira pesquisa para comecar a coletar feedback."
      action={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Criar Pesquisa
        </Button>
      }
    />
  ),
};

/**
 * Variante de busca
 */
export const SearchVariant: Story = {
  render: () => (
    <EmptyStateSearch
      title="Nenhum resultado"
      description="Tente buscar por outros termos ou ajuste os filtros."
      action={
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Limpar filtros
        </Button>
      }
    />
  ),
};

/**
 * Variante de favoritos
 */
export const FavoritesVariant: Story = {
  render: () => (
    <EmptyStateFavorites
      title="Nenhum favorito"
      description="Adicione itens aos favoritos para acessa-los rapidamente."
    />
  ),
};

/**
 * Variante de pesquisas (especifico DevForge)
 */
export const SurveysVariant: Story = {
  render: () => (
    <EmptyStateSurveys
      title="Nenhuma pesquisa"
      description="Crie sua primeira pesquisa para comecar a coletar feedback dos seus clientes."
      action={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Pesquisa
        </Button>
      }
    />
  ),
};

/**
 * Variante de analytics
 */
export const AnalyticsVariant: Story = {
  render: () => (
    <EmptyStateAnalytics
      title="Sem dados disponiveis"
      description="Os dados aparecerao aqui apos voce coletar as primeiras respostas."
    />
  ),
};

/**
 * Tamanho pequeno
 */
export const SmallSize: Story = {
  args: {
    size: 'sm',
    title: 'Lista vazia',
    description: 'Nenhum item disponivel.',
  },
};

/**
 * Tamanho grande
 */
export const LargeSize: Story = {
  args: {
    size: 'lg',
    title: 'Bem-vindo!',
    description: 'Esta area esta vazia porque voce acabou de comecar. Explore as opcoes para adicionar conteudo.',
  },
};

/**
 * Todas as variantes
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 max-w-4xl">
      <EmptyState variant="default" title="Default" description="Variante padrao" />
      <EmptyState variant="search" title="Search" description="Busca sem resultados" />
      <EmptyState variant="no-results" title="No Results" description="Lista vazia" />
      <EmptyState variant="favorites" title="Favorites" description="Sem favoritos" />
      <EmptyState variant="surveys" title="Surveys" description="Sem pesquisas" />
      <EmptyState variant="analytics" title="Analytics" description="Sem dados" />
    </div>
  ),
};
