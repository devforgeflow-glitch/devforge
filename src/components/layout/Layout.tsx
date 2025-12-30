import { type ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { FloatingWhatsAppButton } from './FloatingWhatsAppButton';
import { generateWhatsAppLink } from '@/utils/whatsapp';

/**
 * Componente Layout
 *
 * Layout padrao com Header, conteudo, Footer e botao flutuante do WhatsApp.
 *
 * @example
 * ```tsx
 * <Layout title="Pagina Inicial">
 *   <HomePage />
 * </Layout>
 * ```
 *
 * @version 2.0.0
 */

// Chave do localStorage para configuracoes do WhatsApp
const WHATSAPP_SETTINGS_KEY = 'devforge_whatsapp_settings';

interface WhatsAppSettings {
  whatsappNumber?: string;
  whatsappMessage?: string;
  agentName?: string;
  welcomeMessage?: string;
}

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({
  children,
  title = 'DevForge',
  description = 'Plataforma completa para feedback e gestao de produtos',
}: LayoutProps) {
  const fullTitle = title === 'DevForge' ? title : `${title} | DevForge`;
  const [whatsappLink, setWhatsappLink] = useState('');
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings>({});

  // Carregar configuracoes do WhatsApp
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem(WHATSAPP_SETTINGS_KEY);
        if (saved) {
          const settings: WhatsAppSettings = JSON.parse(saved);
          setWhatsappSettings(settings);
          if (settings.whatsappNumber) {
            setWhatsappLink(generateWhatsAppLink(settings.whatsappNumber, settings.whatsappMessage));
          }
        }
      } catch (e) {
        console.error('Erro ao carregar configuracoes do WhatsApp:', e);
      }
    };

    loadSettings();

    // Escutar atualizacoes das configuracoes
    const handleSettingsUpdate = (event: CustomEvent<WhatsAppSettings>) => {
      const settings = event.detail;
      setWhatsappSettings(settings);
      if (settings.whatsappNumber) {
        setWhatsappLink(generateWhatsAppLink(settings.whatsappNumber, settings.whatsappMessage));
      } else {
        setWhatsappLink('');
      }
    };

    window.addEventListener('whatsapp-settings-updated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('whatsapp-settings-updated', handleSettingsUpdate as EventListener);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
      </Head>

      <div className="flex min-h-screen flex-col">
        <Header />
        <Sidebar />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Botao flutuante do WhatsApp */}
        <FloatingWhatsAppButton
          whatsappLink={whatsappLink}
          agentName={whatsappSettings.agentName}
          welcomeMessage={whatsappSettings.welcomeMessage}
        />
      </div>
    </>
  );
}
