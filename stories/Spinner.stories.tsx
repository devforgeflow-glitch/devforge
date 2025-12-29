import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../src/components/ui/Spinner';
import { Button } from '../src/components/ui/Button';

/**
 * Story do componente Spinner
 *
 * Demonstra indicadores de carregamento.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Tamanho do spinner',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'white'],
      description: 'Variante de cor',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== TAMANHOS =====

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'primary',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

// ===== VARIANTES =====

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
  },
};

export const WhiteOnDark: Story = {
  render: () => (
    <div className="bg-brand-primary p-8 rounded-lg inline-block">
      <Spinner variant="white" size="lg" />
    </div>
  ),
};

// ===== CASOS DE USO =====

export const LoadingPage: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
    </div>
  ),
};

export const InlineLoading: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      <span>Salvando alteracoes...</span>
    </div>
  ),
};

export const ButtonLoading: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button isLoading>Salvando...</Button>
      <Button variant="outline" disabled>
        <Spinner size="sm" className="mr-2" />
        Processando
      </Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <Spinner size="sm" />
        <p className="mt-2 text-sm text-gray-600">sm</p>
      </div>
      <div className="text-center">
        <Spinner size="md" />
        <p className="mt-2 text-sm text-gray-600">md</p>
      </div>
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-2 text-sm text-gray-600">lg</p>
      </div>
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-2 text-sm text-gray-600">xl</p>
      </div>
    </div>
  ),
};
