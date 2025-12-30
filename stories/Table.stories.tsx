import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

/**
 * Componente Table
 *
 * Tabela estilizada com suporte a dark mode.
 * Estrutura semantica HTML.
 */
const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Componente de tabela para exibicao de dados.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

// Dados de exemplo
const surveys = [
  { id: '1', name: 'Pesquisa de Satisfacao Q4', responses: 245, status: 'active', nps: 72 },
  { id: '2', name: 'Feedback do Produto', responses: 128, status: 'active', nps: 65 },
  { id: '3', name: 'Avaliacao de Atendimento', responses: 89, status: 'closed', nps: 81 },
  { id: '4', name: 'Pesquisa Interna', responses: 56, status: 'draft', nps: null },
  { id: '5', name: 'NPS Mensal', responses: 312, status: 'active', nps: 68 },
];

const users = [
  { id: '1', name: 'Joao Silva', email: 'joao@email.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'User', status: 'active' },
  { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', role: 'User', status: 'inactive' },
  { id: '4', name: 'Ana Oliveira', email: 'ana@email.com', role: 'Editor', status: 'active' },
];

/**
 * Tabela basica
 */
export const Basic: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                {user.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * Com caption
 */
export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista de usuarios do sistema</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Cargo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.slice(0, 3).map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * Com footer
 */
export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pesquisa</TableHead>
          <TableHead className="text-right">Respostas</TableHead>
          <TableHead className="text-right">NPS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {surveys.filter(s => s.nps).map((survey) => (
          <TableRow key={survey.id}>
            <TableCell className="font-medium">{survey.name}</TableCell>
            <TableCell className="text-right">{survey.responses}</TableCell>
            <TableCell className="text-right">{survey.nps}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right">
            {surveys.filter(s => s.nps).reduce((acc, s) => acc + s.responses, 0)}
          </TableCell>
          <TableCell className="text-right font-medium">
            NPS Medio: {Math.round(surveys.filter(s => s.nps).reduce((acc, s) => acc + (s.nps || 0), 0) / surveys.filter(s => s.nps).length)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/**
 * Tabela de pesquisas (exemplo DevForge)
 */
export const SurveysTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">
            <div className="flex items-center gap-2">
              Pesquisa
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Respostas</TableHead>
          <TableHead className="text-right">NPS</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {surveys.map((survey) => (
          <TableRow key={survey.id}>
            <TableCell className="font-medium">{survey.name}</TableCell>
            <TableCell>
              <Badge
                variant={
                  survey.status === 'active'
                    ? 'success'
                    : survey.status === 'closed'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {survey.status === 'active' ? 'Ativa' : survey.status === 'closed' ? 'Encerrada' : 'Rascunho'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{survey.responses}</TableCell>
            <TableCell className="text-right">
              {survey.nps !== null ? (
                <span className={survey.nps >= 70 ? 'text-green-600' : survey.nps >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                  {survey.nps}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * Linhas selecionaveis
 */
export const SelectableRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <input type="checkbox" className="rounded" />
          </TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id} data-state={index === 1 ? 'selected' : undefined}>
            <TableCell>
              <input type="checkbox" className="rounded" defaultChecked={index === 1} />
            </TableCell>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                {user.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
