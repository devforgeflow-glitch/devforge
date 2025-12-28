/**
 * Testes do componente Button
 *
 * Valida renderizacao, variantes, estados e interacoes.
 *
 * @version 1.0.0
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  describe('Renderizacao', () => {
    it('deve renderizar o texto do botao', () => {
      render(<Button>Clique aqui</Button>);
      expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
    });

    it('deve renderizar com a classe rounded-full (formato pilula)', () => {
      render(<Button>Botao</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-full');
    });
  });

  describe('Variantes', () => {
    it('deve aplicar estilo primary por padrao', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('deve aplicar estilo secondary quando especificado', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
    });

    it('deve aplicar estilo outline quando especificado', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-2', 'border-primary');
    });

    it('deve aplicar estilo destructive quando especificado', () => {
      render(<Button variant="destructive">Excluir</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive');
    });

    it('deve aplicar estilo ghost quando especificado', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-muted');
    });
  });

  describe('Tamanhos', () => {
    it('deve aplicar tamanho md por padrao', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-6');
    });

    it('deve aplicar tamanho sm quando especificado', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'px-4');
    });

    it('deve aplicar tamanho lg quando especificado', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-8');
    });

    it('deve aplicar tamanho icon quando especificado', () => {
      render(<Button size="icon">+</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Estados', () => {
    it('deve estar desabilitado quando disabled=true', () => {
      render(<Button disabled>Desabilitado</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('deve mostrar estado de loading quando isLoading=true', () => {
      render(<Button isLoading>Salvando</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it('deve mostrar spinner SVG durante loading', () => {
      render(<Button isLoading>Salvando</Button>);
      const spinner = document.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Interacoes', () => {
    it('deve chamar onClick quando clicado', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clique</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('nao deve chamar onClick quando desabilitado', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Desabilitado
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('nao deve chamar onClick durante loading', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} isLoading>
          Loading
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Acessibilidade', () => {
    it('deve suportar aria-label', () => {
      render(<Button aria-label="Adicionar item">+</Button>);
      expect(screen.getByRole('button', { name: /adicionar item/i })).toBeInTheDocument();
    });

    it('deve ter foco visivel', () => {
      render(<Button>Focavel</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Classes customizadas', () => {
    it('deve aceitar className adicional', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });
});
