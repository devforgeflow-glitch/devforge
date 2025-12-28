import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/ui/Button';

/**
 * Story do componente Button
 *
 * Demonstra todas as variantes e tamanhos do botao.
 * Todos os botoes usam formato pilula (rounded-full).
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'destructive', 'outline', 'ghost', 'link'],
      description: 'Estilo visual do botao',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Tamanho do botao',
    },
    isLoading: {
      control: 'boolean',
      description: 'Estado de carregamento',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== VARIANTES =====

export const Primary: Story = {
  args: {
    children: 'Botao Primario',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Botao Secundario',
    variant: 'secondary',
  },
};

export const Accent: Story = {
  args: {
    children: 'Botao Accent',
    variant: 'accent',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Excluir',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
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

export const Icon: Story = {
  args: {
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    size: 'icon',
    'aria-label': 'Adicionar',
  },
};

// ===== ESTADOS =====

export const Loading: Story = {
  args: {
    children: 'Salvando...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Desabilitado',
    disabled: true,
  },
};

// ===== COMPOSICOES =====

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Pequeno</Button>
      <Button size="md">Medio</Button>
      <Button size="lg">Grande</Button>
      <Button size="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Button>
    </div>
  ),
};
