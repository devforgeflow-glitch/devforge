'use client';

import { Fragment, type ReactNode } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

/**
 * Componente Select
 *
 * Dropdown de selecao acessivel usando Headless UI.
 *
 * @example
 * ```tsx
 * const [selected, setSelected] = useState(options[0]);
 *
 * <Select
 *   label="Categoria"
 *   value={selected}
 *   onChange={setSelected}
 *   options={options}
 * />
 * ```
 *
 * @version 1.0.0
 */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  value: SelectOption | undefined;
  onChange: (value: SelectOption) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  error,
  hint,
  disabled,
  className,
}: SelectProps) {
  const hasError = !!error;

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            {label && (
              <Listbox.Label className="text-sm font-medium leading-none">
                {label}
              </Listbox.Label>
            )}
            <div className="relative mt-1.5">
              <Listbox.Button
                className={cn(
                  'relative w-full cursor-pointer rounded-lg border bg-background py-2.5 pl-4 pr-10 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  hasError ? 'border-destructive' : 'border-input',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <span className={cn('block truncate', !value && 'text-muted-foreground')}>
                  {value?.label || placeholder}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className={cn(
                      'h-5 w-5 text-muted-foreground transition-transform',
                      open && 'rotate-180'
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-card py-1 text-sm shadow-lg focus:outline-none">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option}
                      disabled={option.disabled}
                      className={({ active, selected }) =>
                        cn(
                          'relative cursor-pointer select-none py-2 pl-10 pr-4',
                          active && 'bg-muted',
                          selected && 'font-medium text-primary',
                          option.disabled && 'cursor-not-allowed opacity-50'
                        )
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className="block truncate">{option.label}</span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

export { Select };
