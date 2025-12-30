'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Componente Accordion
 *
 * Acordeao expansivel para exibir conteudo de forma organizada.
 * Suporta multiplos itens abertos ou modo single (apenas um aberto).
 *
 * @version 1.0.0
 */

// === Tipos ===
export interface AccordionProps {
  children: ReactNode;
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  className?: string;
}

export interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export interface AccordionTriggerProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

// === Contexts ===
interface AccordionContextType {
  openItems: string[];
  toggleItem: (id: string) => void;
  type: 'single' | 'multiple';
}

interface AccordionItemContextType {
  id: string;
}

const AccordionContext = createContext<AccordionContextType | null>(null);
const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
}

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger/Content must be used within AccordionItem');
  }
  return context;
}

// === Componentes ===

/**
 * Container principal do Accordion
 */
export function Accordion({
  children,
  type = 'multiple',
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(id) ? [] : [id]);
    } else {
      setOpenItems(
        openItems.includes(id)
          ? openItems.filter((item) => item !== id)
          : [...openItems, id]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

/**
 * Item individual do Accordion
 */
export function AccordionItem({ id, children, className }: AccordionItemProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.includes(id);

  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div
        className={cn(
          'rounded-lg border border-border bg-background overflow-hidden transition-all',
          isOpen && 'ring-1 ring-primary/20',
          className
        )}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

/**
 * Botao para expandir/colapsar o item
 */
export function AccordionTrigger({
  children,
  icon,
  className,
}: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion();
  const { id } = useAccordionItem();
  const isOpen = openItems.includes(id);

  return (
    <button
      type="button"
      onClick={() => toggleItem(id)}
      className={cn(
        'flex w-full items-center justify-between p-4 text-left',
        'hover:bg-muted/50 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
        className
      )}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl shrink-0">{icon}</span>}
        <span className="font-medium">{children}</span>
      </div>
      <ChevronDown
        className={cn(
          'h-5 w-5 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
}

/**
 * Conteudo expansivel do item
 */
export function AccordionContent({ children, className }: AccordionContentProps) {
  const { openItems } = useAccordion();
  const { id } = useAccordionItem();
  const isOpen = openItems.includes(id);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'px-4 pb-4 pt-0 text-muted-foreground',
        'animate-in fade-in-0 slide-in-from-top-1 duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}
