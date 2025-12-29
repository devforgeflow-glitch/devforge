import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';

/**
 * Story do componente Card
 *
 * Demonstra containers de conteudo com diferentes variantes.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'ghost', 'interactive'],
      description: 'Variante visual do card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Espacamento interno',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== VARIANTES =====

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Padrao</CardTitle>
        <CardDescription>Uma descricao simples do card</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          Conteudo do card vai aqui.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-80">
      <CardHeader>
        <CardTitle>Card Elevado</CardTitle>
        <CardDescription>Com sombra mais pronunciada</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          Destaque visual com sombra.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Ghost: Story = {
  render: () => (
    <Card variant="ghost" className="w-80">
      <CardHeader>
        <CardTitle>Card Ghost</CardTitle>
        <CardDescription>Sem borda, fundo sutil</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          Minimalista e discreto.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card variant="interactive" className="w-80">
      <CardHeader>
        <CardTitle>Card Interativo</CardTitle>
        <CardDescription>Hover para ver efeito</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          Ideal para itens clicaveis.
        </p>
      </CardContent>
    </Card>
  ),
};

// ===== COMPOSICOES =====

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Pesquisa de Satisfacao</CardTitle>
        <CardDescription>Criada em 28/12/2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Respostas</span>
            <span className="font-medium">247</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">NPS</span>
            <span className="font-medium text-green-600">+72</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm">Editar</Button>
        <Button size="sm">Ver Resultados</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatCard: Story = {
  render: () => (
    <Card className="w-64">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-light dark:bg-brand-primary/20 rounded-full">
            <svg
              className="h-6 w-6 text-brand-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Respostas</p>
            <p className="text-2xl font-bold">1,247</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card variant="default" className="p-4">
        <p className="font-medium">Default</p>
        <p className="text-sm text-gray-600">Borda sutil</p>
      </Card>
      <Card variant="elevated" className="p-4">
        <p className="font-medium">Elevated</p>
        <p className="text-sm text-gray-600">Com sombra</p>
      </Card>
      <Card variant="ghost" className="p-4">
        <p className="font-medium">Ghost</p>
        <p className="text-sm text-gray-600">Sem borda</p>
      </Card>
      <Card variant="interactive" className="p-4">
        <p className="font-medium">Interactive</p>
        <p className="text-sm text-gray-600">Hover effect</p>
      </Card>
    </div>
  ),
};
