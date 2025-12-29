import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../src/components/ui/Badge';

/**
 * Story do componente Badge
 *
 * Demonstra badges para status e categorias.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'success', 'warning', 'destructive', 'outline'],
      description: 'Variante visual do badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== VARIANTES =====

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secundario',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'Ativo',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Pendente',
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Erro',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

// ===== TAMANHOS =====

export const Small: Story = {
  args: {
    children: 'Pequeno',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medio',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Grande',
    size: 'lg',
  },
};

// ===== CASOS DE USO =====

export const SurveyStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">Rascunho</Badge>
      <Badge variant="success">Ativo</Badge>
      <Badge variant="warning">Pausado</Badge>
      <Badge variant="destructive">Encerrado</Badge>
    </div>
  ),
};

export const Categories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">NPS</Badge>
      <Badge variant="default">CSAT</Badge>
      <Badge variant="default">CES</Badge>
      <Badge variant="secondary">Personalizada</Badge>
    </div>
  ),
};

export const WithCount: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="font-medium">Notificacoes</span>
      <Badge variant="destructive" size="sm">5</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    </div>
  ),
};
