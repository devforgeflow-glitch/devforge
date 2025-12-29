'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

/**
 * Contexto de White-label / Branding
 *
 * Permite customizacao da marca e cores da aplicacao.
 * Util para SaaS multi-tenant ou personalizacao por cliente.
 *
 * @version 1.0.0
 */

/**
 * Configuracao de cores da marca
 */
export interface BrandColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
}

/**
 * Configuracao completa de branding
 */
export interface BrandConfig {
  /** Nome da aplicacao */
  name: string;
  /** Slogan/tagline */
  tagline: string;
  /** URL do logo (modo claro) */
  logoUrl?: string;
  /** URL do logo (modo escuro) */
  logoDarkUrl?: string;
  /** URL do favicon */
  faviconUrl?: string;
  /** Cores da marca */
  colors: BrandColors;
  /** Email de suporte */
  supportEmail?: string;
  /** URL do site/docs */
  websiteUrl?: string;
  /** Mostrar "Powered by DevForge" */
  showPoweredBy: boolean;
}

/**
 * Configuracao padrao DevForge
 */
export const DEFAULT_BRAND: BrandConfig = {
  name: 'DevForge',
  tagline: 'Plataforma de Pesquisas e Feedbacks',
  colors: {
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    secondary: '#06b6d4',
    secondaryLight: '#22d3ee',
    secondaryDark: '#0891b2',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    accentDark: '#d97706',
  },
  supportEmail: 'suporte@devforge.com',
  websiteUrl: 'https://devforge.com',
  showPoweredBy: false,
};

/**
 * Tipo do contexto
 */
interface BrandContextType {
  brand: BrandConfig;
  updateBrand: (config: Partial<BrandConfig>) => void;
  updateColors: (colors: Partial<BrandColors>) => void;
  resetBrand: () => void;
  isCustomized: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

/**
 * Provider de Branding
 */
export function BrandProvider({
  children,
  initialConfig,
}: {
  children: ReactNode;
  initialConfig?: Partial<BrandConfig>;
}) {
  const [brand, setBrand] = useState<BrandConfig>(() => ({
    ...DEFAULT_BRAND,
    ...initialConfig,
    colors: {
      ...DEFAULT_BRAND.colors,
      ...initialConfig?.colors,
    },
  }));

  const [isCustomized, setIsCustomized] = useState(!!initialConfig);

  // Aplica as cores como CSS variables
  useEffect(() => {
    const root = document.documentElement;

    // Converte hex para HSL para as CSS variables
    const setColorVariable = (name: string, hex: string) => {
      const hsl = hexToHSL(hex);
      root.style.setProperty(`--brand-${name}`, hex);
      root.style.setProperty(`--brand-${name}-hsl`, hsl);
    };

    setColorVariable('primary', brand.colors.primary);
    setColorVariable('primary-light', brand.colors.primaryLight);
    setColorVariable('primary-dark', brand.colors.primaryDark);
    setColorVariable('secondary', brand.colors.secondary);
    setColorVariable('secondary-light', brand.colors.secondaryLight);
    setColorVariable('secondary-dark', brand.colors.secondaryDark);
    setColorVariable('accent', brand.colors.accent);
    setColorVariable('accent-light', brand.colors.accentLight);
    setColorVariable('accent-dark', brand.colors.accentDark);

    // Atualiza o titulo da pagina
    if (typeof document !== 'undefined') {
      const currentTitle = document.title;
      if (!currentTitle.includes(brand.name)) {
        document.title = currentTitle.replace(/DevForge/g, brand.name);
      }
    }
  }, [brand]);

  const updateBrand = (config: Partial<BrandConfig>) => {
    setBrand((prev) => ({
      ...prev,
      ...config,
      colors: {
        ...prev.colors,
        ...config.colors,
      },
    }));
    setIsCustomized(true);
  };

  const updateColors = (colors: Partial<BrandColors>) => {
    setBrand((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...colors,
      },
    }));
    setIsCustomized(true);
  };

  const resetBrand = () => {
    setBrand(DEFAULT_BRAND);
    setIsCustomized(false);
  };

  return (
    <BrandContext.Provider
      value={{
        brand,
        updateBrand,
        updateColors,
        resetBrand,
        isCustomized,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

/**
 * Hook para acessar o branding
 */
export function useBrand() {
  const context = useContext(BrandContext);

  if (context === undefined) {
    // Retorna valores padrao se usado fora do provider
    return {
      brand: DEFAULT_BRAND,
      updateBrand: () => {},
      updateColors: () => {},
      resetBrand: () => {},
      isCustomized: false,
    };
  }

  return context;
}

/**
 * Converte cor HEX para HSL string
 */
function hexToHSL(hex: string): string {
  // Remove o # se presente
  hex = hex.replace('#', '');

  // Converte para RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Presets de temas populares
 */
export const BRAND_PRESETS = {
  devforge: DEFAULT_BRAND.colors,
  ocean: {
    primary: '#0ea5e9',
    primaryLight: '#38bdf8',
    primaryDark: '#0284c7',
    secondary: '#14b8a6',
    secondaryLight: '#2dd4bf',
    secondaryDark: '#0d9488',
    accent: '#f97316',
    accentLight: '#fb923c',
    accentDark: '#ea580c',
  },
  forest: {
    primary: '#22c55e',
    primaryLight: '#4ade80',
    primaryDark: '#16a34a',
    secondary: '#84cc16',
    secondaryLight: '#a3e635',
    secondaryDark: '#65a30d',
    accent: '#eab308',
    accentLight: '#facc15',
    accentDark: '#ca8a04',
  },
  sunset: {
    primary: '#f43f5e',
    primaryLight: '#fb7185',
    primaryDark: '#e11d48',
    secondary: '#ec4899',
    secondaryLight: '#f472b6',
    secondaryDark: '#db2777',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    accentDark: '#d97706',
  },
  midnight: {
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
    secondary: '#6366f1',
    secondaryLight: '#818cf8',
    secondaryDark: '#4f46e5',
    accent: '#06b6d4',
    accentLight: '#22d3ee',
    accentDark: '#0891b2',
  },
} as const;

export type BrandPreset = keyof typeof BRAND_PRESETS;
