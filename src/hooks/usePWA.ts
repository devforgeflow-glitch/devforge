/**
 * Hook para funcionalidades PWA
 *
 * Gerencia instalacao do PWA, push notifications e status offline
 *
 * @example
 * const { isInstallable, isOffline, installApp, requestNotificationPermission } = usePWA();
 *
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UsePWAReturn {
  /** Se o app pode ser instalado */
  isInstallable: boolean;
  /** Se o app ja esta instalado */
  isInstalled: boolean;
  /** Se o dispositivo esta offline */
  isOffline: boolean;
  /** Status da permissao de notificacao */
  notificationPermission: NotificationPermission | 'unsupported';
  /** Funcao para instalar o PWA */
  installApp: () => Promise<boolean>;
  /** Funcao para solicitar permissao de notificacao */
  requestNotificationPermission: () => Promise<NotificationPermission>;
  /** Funcao para enviar notificacao local */
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

export function usePWA(): UsePWAReturn {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Verificar se esta instalado como PWA
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verifica se esta rodando como standalone (instalado)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;

    setIsInstalled(isStandalone);

    // Verificar permissao de notificacao
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Listener para evento de instalacao
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Listener para status offline
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Estado inicial
    setIsOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Funcao para instalar o PWA
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('PWA: Instalacao nao disponivel');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error('PWA: Erro ao instalar', error);
      return false;
    }
  }, [deferredPrompt]);

  // Funcao para solicitar permissao de notificacao
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('PWA: Notificacoes nao suportadas');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    } catch (error) {
      console.error('PWA: Erro ao solicitar permissao', error);
      return 'denied';
    }
  }, []);

  // Funcao para enviar notificacao local
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) {
      console.warn('PWA: Notificacoes nao suportadas');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.warn('PWA: Permissao de notificacao nao concedida');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      });

      // Auto-fechar apos 5 segundos
      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('PWA: Erro ao enviar notificacao', error);
    }
  }, []);

  return {
    isInstallable,
    isInstalled,
    isOffline,
    notificationPermission,
    installApp,
    requestNotificationPermission,
    sendNotification,
  };
}

export default usePWA;
