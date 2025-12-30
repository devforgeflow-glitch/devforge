import type { Meta, StoryObj } from '@storybook/react';
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonForm,
  SkeletonStatCard,
  SkeletonSurveyCard,
  SkeletonGrid,
} from '@/components/ui/Skeleton';

/**
 * Componente Skeleton
 *
 * Placeholders animados para estados de carregamento.
 * Melhora a percepcao de performance.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Componentes de skeleton para loading states.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/**
 * Skeleton basico
 */
export const Basic: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};

/**
 * Avatar skeleton
 */
export const Avatar: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <SkeletonAvatar size="sm" />
      <SkeletonAvatar size="md" />
      <SkeletonAvatar size="lg" />
      <SkeletonAvatar size="xl" />
    </div>
  ),
};

/**
 * Texto com multiplas linhas
 */
export const Text: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">2 linhas:</p>
        <SkeletonText lines={2} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">4 linhas:</p>
        <SkeletonText lines={4} lastLineWidth="1/2" />
      </div>
    </div>
  ),
};

/**
 * Card skeleton
 */
export const Card: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-4xl">
      <SkeletonCard hasImage hasAction />
      <SkeletonCard hasImage={false} hasAvatar hasAction />
      <SkeletonCard hasImage hasAvatar={false} hasAction={false} />
    </div>
  ),
};

/**
 * Tabela skeleton
 */
export const Table: Story = {
  render: () => (
    <div className="max-w-2xl">
      <SkeletonTable rows={5} columns={4} />
    </div>
  ),
};

/**
 * Lista skeleton
 */
export const List: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Sem avatar:</p>
        <SkeletonList count={3} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Com avatar:</p>
        <SkeletonList count={3} hasAvatar />
      </div>
    </div>
  ),
};

/**
 * Formulario skeleton
 */
export const Form: Story = {
  render: () => (
    <div className="max-w-md">
      <SkeletonForm fields={4} hasSubmit />
    </div>
  ),
};

/**
 * Stat card skeleton (dashboard)
 */
export const StatCard: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4 max-w-4xl">
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </div>
  ),
};

/**
 * Survey card skeleton (especifico DevForge)
 */
export const SurveyCard: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-4xl">
      <SkeletonSurveyCard />
      <SkeletonSurveyCard />
      <SkeletonSurveyCard />
    </div>
  ),
};

/**
 * Grid de cards
 */
export const Grid: Story = {
  render: () => (
    <SkeletonGrid count={6} columns={3} />
  ),
};

/**
 * Exemplo de uso em pagina
 */
export const PageExample: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        <SkeletonCard hasImage hasAction />
        <SkeletonCard hasImage hasAction />
        <SkeletonCard hasImage hasAction />
      </div>
    </div>
  ),
};
