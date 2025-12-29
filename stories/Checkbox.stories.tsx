import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '../src/components/ui/Checkbox';

/**
 * Story do componente Checkbox
 *
 * Demonstra checkboxes acessiveis com diferentes estados.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label do checkbox',
    },
    description: {
      control: 'text',
      description: 'Descricao adicional',
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
  render: function DefaultStory() {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        label="Aceito os termos de uso"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

export const WithDescription: Story = {
  render: function DescriptionStory() {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        label="Receber notificacoes"
        description="Voce recebera emails sobre atualizacoes importantes"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

export const Checked: Story = {
  render: function CheckedStory() {
    const [checked, setChecked] = useState(true);

    return (
      <Checkbox
        label="Opcao selecionada"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

// ===== ESTADOS =====

export const WithError: Story = {
  render: function ErrorStory() {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        label="Aceito os termos de uso"
        error="Voce precisa aceitar os termos para continuar"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox
        label="Opcao desabilitada (nao marcada)"
        disabled
        checked={false}
        onChange={() => {}}
      />
      <Checkbox
        label="Opcao desabilitada (marcada)"
        disabled
        checked={true}
        onChange={() => {}}
      />
    </div>
  ),
};

// ===== CASOS DE USO =====

export const TermsAcceptance: Story = {
  render: function TermsStory() {
    const [terms, setTerms] = useState(false);
    const [privacy, setPrivacy] = useState(false);

    return (
      <div className="space-y-4 max-w-md">
        <Checkbox
          label="Aceito os Termos de Uso"
          description="Li e concordo com os termos e condicoes do servico"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
        />
        <Checkbox
          label="Aceito a Politica de Privacidade"
          description="Entendo como meus dados serao utilizados"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
        />
      </div>
    );
  },
};

export const NotificationPreferences: Story = {
  render: function PreferencesStory() {
    const [email, setEmail] = useState(true);
    const [push, setPush] = useState(true);
    const [sms, setSms] = useState(false);

    return (
      <div className="space-y-4 max-w-md p-4 border rounded-lg dark:border-gray-700">
        <h3 className="font-medium">Preferencias de Notificacao</h3>
        <Checkbox
          label="Email"
          description="Receber notificacoes por email"
          checked={email}
          onChange={(e) => setEmail(e.target.checked)}
        />
        <Checkbox
          label="Push"
          description="Notificacoes no navegador"
          checked={push}
          onChange={(e) => setPush(e.target.checked)}
        />
        <Checkbox
          label="SMS"
          description="Notificacoes por mensagem de texto"
          checked={sms}
          onChange={(e) => setSms(e.target.checked)}
        />
      </div>
    );
  },
};

export const SurveyOptions: Story = {
  render: function OptionsStory() {
    const [anonymous, setAnonymous] = useState(false);
    const [notification, setNotification] = useState(true);
    const [aiAnalysis, setAiAnalysis] = useState(true);

    return (
      <div className="space-y-4 max-w-md p-4 border rounded-lg dark:border-gray-700">
        <h3 className="font-medium">Configuracoes da Pesquisa</h3>
        <Checkbox
          label="Respostas anonimas"
          description="Nao coletar dados de identificacao dos respondentes"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
        />
        <Checkbox
          label="Notificar novas respostas"
          description="Receber email quando houver novas respostas"
          checked={notification}
          onChange={(e) => setNotification(e.target.checked)}
        />
        <Checkbox
          label="Analise com IA"
          description="Usar inteligencia artificial para analisar sentimentos"
          checked={aiAnalysis}
          onChange={(e) => setAiAnalysis(e.target.checked)}
        />
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox
        label="Normal (nao marcado)"
        checked={false}
        onChange={() => {}}
      />
      <Checkbox
        label="Normal (marcado)"
        checked={true}
        onChange={() => {}}
      />
      <Checkbox
        label="Com descricao"
        description="Uma descricao adicional"
        checked={false}
        onChange={() => {}}
      />
      <Checkbox
        label="Com erro"
        error="Este campo e obrigatorio"
        checked={false}
        onChange={() => {}}
      />
      <Checkbox
        label="Desabilitado"
        disabled
        checked={false}
        onChange={() => {}}
      />
    </div>
  ),
};
