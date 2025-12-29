'use client';

/**
 * Banner de Consentimento de Cookies (LGPD/GDPR)
 *
 * Implementa o requisito de consentimento para coleta de dados
 * conforme LGPD (Lei 13.709/2018) e GDPR.
 *
 * Funcionalidades:
 * - Banner fixo no rodape da pagina
 * - Opcoes de aceitar todos, rejeitar nao-essenciais, ou personalizar
 * - Salva preferencias no localStorage
 * - Registra timestamp do consentimento
 * - Suporte completo a dark mode
 *
 * @module components/ui/CookieConsent
 * @version 1.0.0
 * @compliance LGPD Art. 7, GDPR Art. 6
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// ============================================================================
// TYPES
// ============================================================================

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  consentedAt: string;
  version: string;
}

const COOKIE_CONSENT_KEY = 'devforge_cookie_consent';
const COOKIE_POLICY_VERSION = '1.0.0';

// ============================================================================
// COMPONENT
// ============================================================================

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: true,
    consentedAt: '',
    version: COOKIE_POLICY_VERSION,
  });

  // Verificar se ja tem consentimento salvo
  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (saved) {
      try {
        const parsed: CookiePreferences = JSON.parse(saved);

        if (parsed.version === COOKIE_POLICY_VERSION) {
          setPreferences(parsed);
          setShowBanner(false);
          return;
        }
      } catch {
        // Consentimento invalido, mostrar banner
      }
    }

    // Mostrar banner apos pequeno delay (melhor UX)
    const timer = setTimeout(() => setShowBanner(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Salvar preferencias
  const savePreferences = (prefs: CookiePreferences) => {
    const toSave: CookiePreferences = {
      ...prefs,
      consentedAt: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(toSave));
    setPreferences(toSave);
    setShowBanner(false);
    setShowSettings(false);

    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: toSave }));
  };

  const handleAcceptAll = () => {
    savePreferences({
      ...preferences,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const handleAcceptEssential = () => {
    savePreferences({
      ...preferences,
      analytics: false,
      marketing: false,
      preferences: true,
    });
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay quando settings estao abertos */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Banner Principal */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4 md:p-6">
        <div className="max-w-3xl mx-auto bg-background rounded-2xl shadow-2xl border overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Cookie className="h-5 w-5 sm:h-6 sm:w-6" />
              <h2 className="text-base sm:text-lg font-semibold">Politica de Cookies</h2>
            </div>
            <button
              onClick={handleAcceptEssential}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Conteudo */}
          <div className="p-4 sm:p-6">
            {!showSettings ? (
              <>
                <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed">
                  Utilizamos cookies para melhorar sua experiencia, analisar o trafego do site e
                  personalizar conteudo. Ao clicar em &quot;Aceitar todos&quot;, voce consente com o uso de
                  todos os cookies conforme nossa{' '}
                  <Link href="/privacy" className="text-primary hover:underline font-medium">
                    Politica de Privacidade
                  </Link>
                  .
                </p>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-6">
                  <Shield className="h-4 w-4" />
                  <span>Em conformidade com a LGPD (Lei 13.709/2018)</span>
                </div>

                {/* Botoes */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button onClick={handleAcceptAll} className="flex-1 rounded-full">
                    Aceitar Todos
                  </Button>
                  <Button
                    onClick={handleAcceptEssential}
                    variant="outline"
                    className="flex-1 rounded-full"
                  >
                    Apenas Essenciais
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Personalizar</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Configuracoes Detalhadas */}
                <h3 className="text-lg font-semibold mb-4">
                  Configuracoes de Cookies
                </h3>

                <div className="space-y-3 sm:space-y-4 mb-6 max-h-[40vh] overflow-y-auto">
                  {/* Essenciais - sempre ativo */}
                  <div className="flex items-start justify-between p-3 sm:p-4 bg-muted rounded-lg">
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm sm:text-base">Cookies Essenciais</span>
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          Obrigatorio
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Necessarios para o funcionamento do site.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="mt-1 h-5 w-5 rounded cursor-not-allowed accent-primary"
                    />
                  </div>

                  {/* Analytics */}
                  <label className="flex items-start justify-between p-3 sm:p-4 bg-muted/50 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex-1 pr-3">
                      <span className="font-medium text-sm sm:text-base">Cookies de Analise</span>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Permitem entender como voce usa o site.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="mt-1 h-5 w-5 rounded cursor-pointer accent-primary"
                    />
                  </label>

                  {/* Marketing */}
                  <label className="flex items-start justify-between p-3 sm:p-4 bg-muted/50 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex-1 pr-3">
                      <span className="font-medium text-sm sm:text-base">Cookies de Marketing</span>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Usados para anuncios relevantes.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="mt-1 h-5 w-5 rounded cursor-pointer accent-primary"
                    />
                  </label>

                  {/* Preferencias */}
                  <label className="flex items-start justify-between p-3 sm:p-4 bg-muted/50 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex-1 pr-3">
                      <span className="font-medium text-sm sm:text-base">Cookies de Preferencias</span>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Lembram suas preferencias como idioma e tema.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={(e) =>
                        setPreferences({ ...preferences, preferences: e.target.checked })
                      }
                      className="mt-1 h-5 w-5 rounded cursor-pointer accent-primary"
                    />
                  </label>
                </div>

                {/* Botoes Settings */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button onClick={handleSaveSettings} className="flex-1 rounded-full">
                    Salvar Preferencias
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="outline"
                    className="flex-1 rounded-full"
                  >
                    Voltar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// HOOK para verificar consentimento
// ============================================================================

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const loadConsent = () => {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (saved) {
        try {
          setConsent(JSON.parse(saved));
        } catch {
          setConsent(null);
        }
      }
    };

    loadConsent();

    const handleUpdate = (e: CustomEvent<CookiePreferences>) => {
      setConsent(e.detail);
    };

    window.addEventListener('cookieConsentUpdated', handleUpdate as EventListener);
    return () => window.removeEventListener('cookieConsentUpdated', handleUpdate as EventListener);
  }, []);

  return {
    consent,
    hasConsented: !!consent?.consentedAt,
    canUseAnalytics: consent?.analytics ?? false,
    canUseMarketing: consent?.marketing ?? false,
    canUsePreferences: consent?.preferences ?? true,
  };
}

export default CookieConsent;
