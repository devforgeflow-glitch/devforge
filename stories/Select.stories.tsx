import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, type SelectOption } from '../src/components/ui/Select';

/**
 * Story do componente Select
 *
 * Demonstra dropdowns de selecao acessiveis.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label do campo',
    },
    placeholder: {
      control: 'text',
      description: 'Texto placeholder',
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

const surveyTypes: SelectOption[] = [
  { value: 'nps', label: 'NPS' },
  { value: 'csat', label: 'CSAT' },
  { value: 'ces', label: 'CES' },
  { value: 'custom', label: 'Personalizada' },
];

const statusOptions: SelectOption[] = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'active', label: 'Ativo' },
  { value: 'paused', label: 'Pausado' },
  { value: 'closed', label: 'Encerrado' },
];

// ===== BASICO =====

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState<SelectOption | undefined>(undefined);

    return (
      <div className="w-64">
        <Select
          options={surveyTypes}
          value={value}
          onChange={setValue}
          placeholder="Selecione o tipo..."
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: function WithLabelStory() {
    const [value, setValue] = useState<SelectOption | undefined>(undefined);

    return (
      <div className="w-64">
        <Select
          label="Tipo de Pesquisa"
          options={surveyTypes}
          value={value}
          onChange={setValue}
          placeholder="Selecione..."
        />
      </div>
    );
  },
};

export const WithPreselected: Story = {
  render: function PreselectedStory() {
    const [value, setValue] = useState<SelectOption | undefined>(surveyTypes[0]);

    return (
      <div className="w-64">
        <Select
          label="Tipo de Pesquisa"
          options={surveyTypes}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// ===== ESTADOS =====

export const WithError: Story = {
  render: function ErrorStory() {
    const [value, setValue] = useState<SelectOption | undefined>(undefined);

    return (
      <div className="w-64">
        <Select
          label="Status"
          options={statusOptions}
          value={value}
          onChange={setValue}
          placeholder="Selecione..."
          error="Selecione um status"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Select
        label="Tipo de Pesquisa"
        options={surveyTypes}
        value={surveyTypes[0]}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
};

export const Required: Story = {
  render: function RequiredStory() {
    const [value, setValue] = useState<SelectOption | undefined>(undefined);

    return (
      <div className="w-64">
        <Select
          label="Status"
          options={statusOptions}
          value={value}
          onChange={setValue}
          placeholder="Selecione..."
          required
        />
      </div>
    );
  },
};

// ===== CASOS DE USO =====

export const SurveyFilters: Story = {
  render: function FiltersStory() {
    const [type, setType] = useState<SelectOption | undefined>(undefined);
    const [status, setStatus] = useState<SelectOption | undefined>(undefined);

    return (
      <div className="flex gap-4">
        <div className="w-48">
          <Select
            label="Tipo"
            options={surveyTypes}
            value={type}
            onChange={setType}
            placeholder="Todos os tipos"
          />
        </div>
        <div className="w-48">
          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Todos os status"
          />
        </div>
      </div>
    );
  },
};

export const FormField: Story = {
  render: function FormStory() {
    const [type, setType] = useState<SelectOption | undefined>(undefined);

    return (
      <div className="max-w-md space-y-4 p-6 border rounded-lg dark:border-gray-700">
        <h3 className="font-medium text-lg">Nova Pesquisa</h3>
        <Select
          label="Tipo de Pesquisa"
          options={surveyTypes}
          value={type}
          onChange={setType}
          placeholder="Selecione o tipo..."
          required
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {type?.value === 'nps' && 'Net Promoter Score - mede a lealdade do cliente'}
          {type?.value === 'csat' && 'Customer Satisfaction - mede a satisfacao geral'}
          {type?.value === 'ces' && 'Customer Effort Score - mede o esforco do cliente'}
          {type?.value === 'custom' && 'Crie suas proprias perguntas personalizadas'}
        </p>
      </div>
    );
  },
};
