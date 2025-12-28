import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';

/**
 * Story do componente ThemeToggle
 *
 * Botao para alternar entre temas Light/Dark/System.
 * Use a toolbar de backgrounds do Storybook para ver o efeito.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof ThemeToggle> = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botao que alterna entre os temas claro, escuro e sistema. Utiliza next-themes para persistencia.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Estado padrao do toggle de tema. Clique para alternar entre light/dark.',
      },
    },
  },
};

export const InHeader: Story = {
  render: () => (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <span className="text-sm text-muted-foreground">Navbar simulada</span>
      <div className="flex-1" />
      <ThemeToggle />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de como o toggle aparece em uma navbar.',
      },
    },
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="text-sm">Tema:</span>
      <ThemeToggle />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toggle com label ao lado.',
      },
    },
  },
};
