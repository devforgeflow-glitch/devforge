import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { AlertCircle, CheckCircle, Info as InfoIcon, AlertTriangle } from 'lucide-react';

/**
 * Componente Alert
 *
 * Exibe mensagens de alerta com diferentes variantes.
 * Suporta icones, titulos e descricoes.
 */
const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Componente de alerta para feedback ao usuario.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
      description: 'Variante visual do alerta',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

/**
 * Alerta padrao
 */
export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Aviso</AlertTitle>
      <AlertDescription>
        Esta e uma mensagem de alerta padrao.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alerta de erro/destrutivo
 */
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>
        Ocorreu um erro ao processar sua solicitacao.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alerta de sucesso
 */
export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Sucesso</AlertTitle>
      <AlertDescription>
        Sua operacao foi concluida com sucesso.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alerta de aviso
 */
export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Atencao</AlertTitle>
      <AlertDescription>
        Esta acao pode ter consequencias irreversiveis.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alerta informativo
 */
export const InfoVariant: Story = {
  render: () => (
    <Alert variant="info">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Informacao</AlertTitle>
      <AlertDescription>
        Novos recursos foram adicionados a plataforma.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Todas as variantes
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Alerta padrao sem variante especifica.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Usado para erros e acoes criticas.</AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Usado para confirmacoes de sucesso.</AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Usado para avisos importantes.</AlertDescription>
      </Alert>

      <Alert variant="info">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Usado para informacoes gerais.</AlertDescription>
      </Alert>
    </div>
  ),
};
