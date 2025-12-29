import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../src/components/ui/Input';

/**
 * Story do componente Input
 *
 * Demonstra campos de entrada com diferentes estados e variantes.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
      description: 'Variante visual do input',
    },
    label: {
      control: 'text',
      description: 'Label do campo',
    },
    hint: {
      control: 'text',
      description: 'Texto de ajuda',
    },
    error: {
      control: 'text',
      description: 'Mensagem de erro',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== BASICO =====

export const Default: Story = {
  args: {
    placeholder: 'Digite algo...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Nome completo',
    placeholder: 'Seu nome',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Email',
    placeholder: 'seu@email.com',
    hint: 'Usaremos este email para enviar notificacoes',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'seu@email.com',
    required: true,
  },
};

// ===== ESTADOS =====

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'seu@email.com',
    error: 'Este email ja esta em uso',
    defaultValue: 'usuario@email.com',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'seu@email.com',
    disabled: true,
    defaultValue: 'desabilitado@email.com',
  },
};

// ===== TIPOS =====

export const Password: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
  },
};

export const Email: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'seu@email.com',
  },
};

export const Number: Story = {
  args: {
    label: 'Quantidade',
    type: 'number',
    placeholder: '0',
    min: 0,
    max: 100,
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Buscar...',
  },
};

// ===== COMPOSICOES =====

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input label="Normal" placeholder="Campo normal" />
      <Input label="Com dica" placeholder="Campo com hint" hint="Dica de preenchimento" />
      <Input label="Com erro" placeholder="Campo com erro" error="Erro de validacao" />
      <Input label="Desabilitado" placeholder="Campo desabilitado" disabled />
      <Input label="Obrigatorio" placeholder="Campo obrigatorio" required />
    </div>
  ),
};
