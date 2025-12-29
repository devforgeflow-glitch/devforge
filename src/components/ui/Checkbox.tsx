'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Componente Checkbox
 *
 * Caixa de selecao acessivel.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   id="terms"
 *   label="Aceito os termos de uso"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 * ```
 *
 * @version 1.0.0
 */

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="flex items-start space-x-3">
        <div className="flex h-6 items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              'h-4 w-4 rounded border-input bg-background text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-destructive',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${checkboxId}-error`
                : description
                ? `${checkboxId}-description`
                : undefined
            }
            {...props}
          />
        </div>
        {(label || description || error) && (
          <div className="space-y-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && !error && (
              <p id={`${checkboxId}-description`} className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {error && (
              <p id={`${checkboxId}-error`} className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
