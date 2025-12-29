/**
 * Componente de prompt para instalacao do PWA
 *
 * Exibe um banner sugerindo a instalacao do app quando disponivel
 *
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';

// Textos padrão (fallback quando traduções não disponíveis durante SSG)
const DEFAULT_TEXTS = {
  title: 'Instalar DevForge',
  description: 'Acesse mais rápido direto da sua tela inicial',
  button: 'Instalar',
  later: 'Agora não',
};

interface InstallPromptProps {
  /** Delay em ms antes de mostrar o prompt (default: 30000 = 30s) */
  delay?: number;
  /** Callback quando o usuario instala */
  onInstall?: () => void;
  /** Callback quando o usuario dispensa */
  onDismiss?: () => void;
}

export function InstallPrompt({ delay = 30000, onInstall, onDismiss }: InstallPromptProps) {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Verificar se foi dispensado anteriormente
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      // Mostrar novamente apos 7 dias
      if (now.getTime() - dismissedDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }
  }, []);

  // Mostrar prompt apos delay
  useEffect(() => {
    if (!isInstallable || isInstalled || isDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isDismissed, delay]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsVisible(false);
      onInstall?.();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-background rounded-2xl shadow-xl border border-border p-4">
        <div className="flex items-start gap-3">
          {/* Icone */}
          <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Conteudo */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">
              {DEFAULT_TEXTS.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {DEFAULT_TEXTS.description}
            </p>

            {/* Botoes */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {DEFAULT_TEXTS.button}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-muted-foreground text-xs font-medium hover:text-foreground transition-colors"
              >
                {DEFAULT_TEXTS.later}
              </button>
            </div>
          </div>

          {/* Botao fechar */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;
