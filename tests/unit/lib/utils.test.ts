/**
 * Testes das funcoes utilitarias
 *
 * Valida funcoes helper usadas em todo o projeto.
 *
 * @version 1.0.0
 */

import { cn } from '@/lib/utils';

describe('cn (classNames utility)', () => {
  it('deve concatenar classes simples', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('deve ignorar valores falsy', () => {
    const result = cn('class1', null, undefined, false, 'class2');
    expect(result).toBe('class1 class2');
  });

  it('deve aceitar classes condicionais', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn('base', isActive && 'active', isDisabled && 'disabled');
    expect(result).toBe('base active');
  });

  it('deve fazer merge de classes Tailwind conflitantes', () => {
    // tailwind-merge deve resolver conflitos
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('deve resolver conflitos de padding', () => {
    const result = cn('p-4', 'px-2');
    // px-2 sobrescreve apenas o padding horizontal
    expect(result).toContain('px-2');
  });

  it('deve resolver conflitos de cor de texto', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('deve resolver conflitos de background', () => {
    const result = cn('bg-white', 'bg-black');
    expect(result).toBe('bg-black');
  });

  it('deve aceitar arrays de classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('deve aceitar objetos de classes', () => {
    const result = cn({
      base: true,
      active: true,
      disabled: false,
    });
    expect(result).toBe('base active');
  });

  it('deve combinar diferentes formatos', () => {
    const result = cn(
      'base-class',
      ['array-class'],
      { 'object-class': true, 'false-class': false },
      true && 'conditional-class'
    );
    expect(result).toContain('base-class');
    expect(result).toContain('array-class');
    expect(result).toContain('object-class');
    expect(result).toContain('conditional-class');
    expect(result).not.toContain('false-class');
  });

  it('deve retornar string vazia para entrada vazia', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('deve retornar string vazia para apenas valores falsy', () => {
    const result = cn(null, undefined, false);
    expect(result).toBe('');
  });
});
