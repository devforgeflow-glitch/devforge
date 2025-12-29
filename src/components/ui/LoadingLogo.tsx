/**
 * LoadingLogo - Componente de loading com logo da DevForge
 *
 * Exibe a logo da empresa com animacao de pulsacao e spinner circular.
 * Usado durante carregamento de autenticacao e outras operacoes assincronas.
 *
 * Features:
 * - Logo pulsando suavemente
 * - Spinner circular ao redor
 * - Responsivo
 * - Suporte a dark mode
 *
 * @module components/ui/LoadingLogo
 * @version 1.0.0
 */

import { cn } from '@/lib/utils';

interface LoadingLogoProps {
  /**
   * Tamanho da logo em pixels
   * @default 80
   */
  size?: number;

  /**
   * Mostrar spinner circular ao redor da logo
   * @default true
   */
  showSpinner?: boolean;

  /**
   * Texto opcional abaixo da logo
   */
  text?: string;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Logo SVG do DevForge (icone de codigo)
 */
function DevForgeLogo({ size, className }: { size: number; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-primary shadow-lg',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        className="text-primary-foreground"
        style={{ width: size * 0.6, height: size * 0.6 }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    </div>
  );
}

/**
 * Componente de loading com logo da DevForge
 *
 * @example
 * ```tsx
 * <LoadingLogo size={100} showSpinner={true} text="Carregando..." />
 * ```
 */
export function LoadingLogo({
  size = 80,
  showSpinner = true,
  text,
  className,
}: LoadingLogoProps) {
  const spinnerSize = size + 32;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Container da logo com spinner */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: spinnerSize, height: spinnerSize }}
      >
        {/* Spinner circular ao redor */}
        {showSpinner && (
          <svg
            className="absolute inset-0 animate-spin"
            style={{ width: spinnerSize, height: spinnerSize }}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              className="stroke-muted"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              className="stroke-primary"
              strokeWidth="3"
              strokeDasharray="70 213"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Logo com animacao de pulsacao */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <DevForgeLogo size={size} />
        </div>
      </div>

      {/* Texto opcional */}
      {text && (
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Variante fullscreen - ocupa toda a tela
 * Usado no AuthContext durante autenticacao inicial
 *
 * @example
 * ```tsx
 * <LoadingLogoFullscreen text="Verificando autenticacao..." />
 * ```
 */
export function LoadingLogoFullscreen({
  size = 100,
  showSpinner = true,
  text,
}: LoadingLogoProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingLogo size={size} showSpinner={showSpinner} text={text} />
    </div>
  );
}

/**
 * Variante para overlay - colocado sobre outros conteudos
 *
 * @example
 * ```tsx
 * <LoadingLogoOverlay text="Salvando..." />
 * ```
 */
export function LoadingLogoOverlay({
  size = 80,
  showSpinner = true,
  text,
}: LoadingLogoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingLogo size={size} showSpinner={showSpinner} text={text} />
    </div>
  );
}
