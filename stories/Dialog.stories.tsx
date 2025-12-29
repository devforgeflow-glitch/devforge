import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '../src/components/ui/Dialog';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';

/**
 * Story do componente Dialog
 *
 * Demonstra modais acessiveis com diferentes conteudos.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Estado de visibilidade',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== BASICO =====

export const Default: Story = {
  render: function DialogStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Abrir Dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogPanel>
            <DialogTitle>Titulo do Dialog</DialogTitle>
            <DialogDescription>
              Uma descricao explicando o proposito deste dialog.
            </DialogDescription>
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Conteudo adicional do modal.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setOpen(false)}>
                Confirmar
              </Button>
            </div>
          </DialogPanel>
        </Dialog>
      </>
    );
  },
};

export const Confirmation: Story = {
  render: function ConfirmationStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Excluir Pesquisa
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogPanel>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <DialogTitle>Excluir pesquisa?</DialogTitle>
                <DialogDescription>
                  Esta acao nao pode ser desfeita. Todos os dados e respostas serao
                  permanentemente excluidos.
                </DialogDescription>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Sim, excluir
              </Button>
            </div>
          </DialogPanel>
        </Dialog>
      </>
    );
  },
};

export const WithForm: Story = {
  render: function FormStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Criar Pesquisa</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogPanel className="max-w-lg">
            <DialogTitle>Nova Pesquisa</DialogTitle>
            <DialogDescription>
              Preencha as informacoes basicas da sua nova pesquisa.
            </DialogDescription>
            <form className="mt-4 space-y-4">
              <Input
                label="Titulo da pesquisa"
                placeholder="Ex: Pesquisa de satisfacao 2024"
                required
              />
              <Input
                label="Descricao (opcional)"
                placeholder="Uma breve descricao..."
              />
            </form>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setOpen(false)}>
                Criar Pesquisa
              </Button>
            </div>
          </DialogPanel>
        </Dialog>
      </>
    );
  },
};

export const Success: Story = {
  render: function SuccessStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Mostrar Sucesso</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogPanel className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="text-center">Pesquisa publicada!</DialogTitle>
            <DialogDescription className="text-center">
              Sua pesquisa esta disponivel para receber respostas.
            </DialogDescription>
            <div className="mt-6">
              <Button className="w-full" onClick={() => setOpen(false)}>
                Continuar
              </Button>
            </div>
          </DialogPanel>
        </Dialog>
      </>
    );
  },
};
