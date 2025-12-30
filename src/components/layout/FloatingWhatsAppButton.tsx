/**
 * Componente: Botao Flutuante de WhatsApp
 *
 * Renderiza um botao de acao flutuante fixo na tela para iniciar
 * conversa no WhatsApp com mensagem pre-preenchida.
 *
 * Caracteristicas:
 * - Position fixed (canto inferior direito)
 * - Popup com informacoes antes de redirecionar
 * - Animacao hover (scale 110%)
 * - Acessibilidade (aria-label, target blank)
 * - Verde WhatsApp (#25D366)
 * - Icone SVG do WhatsApp oficial
 *
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  /** Link completo do WhatsApp (gerado pelo utilitario) */
  whatsappLink: string;

  /** Estilos CSS adicionais (principalmente para `bottom` dinamico) */
  style?: React.CSSProperties;

  /** Classe CSS adicional (opcional) */
  className?: string;

  /** Nome do atendente (opcional) */
  agentName?: string;

  /** Mensagem de boas-vindas no popup (opcional) */
  welcomeMessage?: string;
}

/**
 * Icone SVG do WhatsApp oficial
 */
const WhatsAppIcon = () => (
  <svg
    width="23"
    height="32"
    viewBox="0 0 448 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 439.7c-33.8 0-66.3-8.8-94.3-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5c.1 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.4-2.3-5.1-3.7-10.6-6.6z"/>
  </svg>
);

/**
 * Componente de botao flutuante do WhatsApp
 *
 * Se whatsappLink estiver vazio, o componente nao renderiza nada.
 */
export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  whatsappLink,
  style,
  className = '',
  agentName = 'Suporte DevForge',
  welcomeMessage = 'Ola! Como podemos ajudar voce hoje?',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Nao renderiza se nao houver link
  if (!whatsappLink || whatsappLink.trim() === '') {
    return null;
  }

  return (
    <div className="fixed right-6 z-50" style={{ bottom: '24px', ...style }}>
      {/* Popup de chat */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-green-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <WhatsAppIcon />
                </div>
                <div>
                  <p className="font-semibold">{agentName}</p>
                  <p className="text-xs text-white/80">Online agora</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conteudo */}
          <div className="p-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {welcomeMessage}
              </p>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Clique abaixo para iniciar uma conversa no WhatsApp
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-full text-center hover:bg-green-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Conversa
            </a>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-center">
            <p className="text-xs text-gray-400">
              Atendimento via WhatsApp
            </p>
          </div>
        </div>
      )}

      {/* Botao principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-300 hover:scale-110
          ${isOpen ? 'bg-gray-600 text-white' : 'bg-green-500 text-white'}
          ${className}
        `}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat de suporte'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <WhatsAppIcon />
        )}
      </button>

      {/* Indicador de novo (pulsa) - apenas quando fechado */}
      {!isOpen && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}
    </div>
  );
};

export default FloatingWhatsAppButton;
