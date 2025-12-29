/**
 * Componente indicador de status offline
 *
 * Exibe um banner quando o usuario esta sem conexao
 *
 * @version 1.0.0
 */

'use client';

import { usePWA } from '@/hooks/usePWA';

// Textos padrão (fallback para SSG)
const DEFAULT_TEXTS = {
  message: 'Você está offline. Algumas funcionalidades podem estar limitadas.',
  retry: 'Tentar novamente',
};

interface OfflineIndicatorProps {
  /** Posicao do indicador */
  position?: 'top' | 'bottom';
}

export function OfflineIndicator({ position = 'top' }: OfflineIndicatorProps) {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div
      className={`fixed left-0 right-0 z-50 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      }`}
    >
      <div className="bg-amber-500 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
            <span className="text-sm font-medium">
              {DEFAULT_TEXTS.message}
            </span>
          </div>

          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium transition-colors"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {DEFAULT_TEXTS.retry}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfflineIndicator;
