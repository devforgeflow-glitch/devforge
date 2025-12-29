/**
 * Layout Context - Gerenciamento de Estado do Layout Global
 *
 * Gerencia o estado da sidebar (aberta/fechada) e fornece
 * funcoes para controle do layout da aplicacao.
 *
 * @module contexts/LayoutContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Interface do contexto de layout
 */
interface LayoutContextType {
  /** Indica se a sidebar esta aberta */
  isSidebarOpen: boolean;

  /** Alterna o estado da sidebar (aberto/fechado) */
  toggleSidebar: () => void;

  /** Abre a sidebar */
  openSidebar: () => void;

  /** Fecha a sidebar */
  closeSidebar: () => void;
}

/**
 * Context para gerenciamento do layout
 */
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

/**
 * Props do provider de layout
 */
interface LayoutProviderProps {
  /** Componentes filhos */
  children: ReactNode;
}

/**
 * Provider do contexto de layout
 */
export function LayoutProvider({ children }: LayoutProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const value: LayoutContextType = {
    isSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de layout
 */
export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);

  if (context === undefined) {
    throw new Error('useLayout deve ser usado dentro de um LayoutProvider');
  }

  return context;
}

export { LayoutContext };
