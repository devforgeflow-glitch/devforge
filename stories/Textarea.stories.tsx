import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../src/components/ui/Textarea';

/**
 * Story do componente Textarea
 *
 * Demonstra areas de texto com diferentes estados.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
      description: 'Variante visual',
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
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'Comportamento de redimensionamento',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== BASICO =====

export const Default: Story = {
  args: {
    placeholder: 'Digite sua mensagem...',
    rows: 4,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Descricao',
    placeholder: 'Descreva sua pesquisa...',
    rows: 4,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Compartilhe sua experiencia...',
    hint: 'Minimo de 50 caracteres',
    rows: 4,
  },
};

export const Required: Story = {
  args: {
    label: 'Comentario',
    placeholder: 'Seu comentario...',
    required: true,
    rows: 4,
  },
};

// ===== ESTADOS =====

export const WithError: Story = {
  args: {
    label: 'Descricao',
    placeholder: 'Descreva...',
    error: 'A descricao deve ter pelo menos 50 caracteres',
    defaultValue: 'Texto curto',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Descricao',
    placeholder: 'Campo desabilitado',
    disabled: true,
    defaultValue: 'Este campo esta desabilitado',
    rows: 4,
  },
};

// ===== REDIMENSIONAMENTO =====

export const NoResize: Story = {
  args: {
    label: 'Sem redimensionamento',
    placeholder: 'Nao pode ser redimensionado',
    resize: 'none',
    rows: 4,
  },
};

export const VerticalResize: Story = {
  args: {
    label: 'Redimensionamento vertical',
    placeholder: 'Pode ser redimensionado verticalmente',
    resize: 'vertical',
    rows: 4,
  },
};

// ===== CASOS DE USO =====

export const SurveyDescription: Story = {
  render: () => (
    <div className="max-w-lg">
      <Textarea
        label="Descricao da pesquisa"
        placeholder="Explique o objetivo da sua pesquisa e o que voce espera descobrir com as respostas..."
        hint="Esta descricao sera exibida para os respondentes"
        rows={5}
      />
    </div>
  ),
};

export const FeedbackForm: Story = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <Textarea
        label="O que voce gostou?"
        placeholder="Conte-nos o que funcionou bem..."
        rows={3}
      />
      <Textarea
        label="O que podemos melhorar?"
        placeholder="Suas sugestoes sao muito importantes..."
        rows={3}
      />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <Textarea
        label="Normal"
        placeholder="Campo normal"
        rows={2}
      />
      <Textarea
        label="Com dica"
        placeholder="Campo com hint"
        hint="Dica de preenchimento"
        rows={2}
      />
      <Textarea
        label="Com erro"
        placeholder="Campo com erro"
        error="Este campo tem um erro"
        rows={2}
      />
      <Textarea
        label="Desabilitado"
        placeholder="Campo desabilitado"
        disabled
        rows={2}
      />
    </div>
  ),
};
