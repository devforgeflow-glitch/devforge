'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Bell, User, LogOut, Settings, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, ThemeToggle, LanguageSelector } from '@/components/ui';
import { useAuth, useLayout } from '@/contexts';
import { cn } from '@/lib/utils';

/**
 * Componente Header
 *
 * Cabecalho responsivo com suporte a menu mobile.
 * Dual rendering: HeaderPublic (nao autenticado) vs HeaderApp (autenticado)
 *
 * @version 2.0.0
 */

/**
 * Hook para fechar dropdown ao clicar fora
 */
function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/**
 * HeaderPublic - Header para usuarios nao autenticados
 */
function HeaderPublic() {
  const t = useTranslations();
  const { toggleSidebar } = useLayout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="w-full mx-auto px-3 sm:px-4 lg:px-6 h-14 flex justify-between items-center">
        {/* ESQUERDA: Menu + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground"
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
            <span className="text-lg sm:text-xl font-bold gradient-text hidden xs:inline">DevForge</span>
          </Link>
        </div>

        {/* CENTRO: Navegacao (apenas desktop) */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/features"
            className={cn(
              'text-sm font-medium text-muted-foreground',
              'hover:text-foreground transition-colors'
            )}
          >
            {t('nav.features')}
          </Link>
          <Link
            href="/pricing"
            className={cn(
              'text-sm font-medium text-muted-foreground',
              'hover:text-foreground transition-colors'
            )}
          >
            {t('nav.pricing')}
          </Link>
          <Link
            href="/about"
            className={cn(
              'text-sm font-medium text-muted-foreground',
              'hover:text-foreground transition-colors'
            )}
          >
            {t('nav.about')}
          </Link>
        </nav>

        {/* DIREITA: Acoes */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <ThemeToggle />

          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                {t('actions.login')}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-4 rounded-full">
                <span className="hidden sm:inline">{t('actions.signup')}</span>
                <span className="sm:hidden">Criar</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

/**
 * HeaderApp - Header para usuarios autenticados
 */
function HeaderApp() {
  const t = useTranslations();
  const router = useRouter();
  const { toggleSidebar } = useLayout();
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  const userInitials = user?.displayName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="w-full mx-auto px-3 sm:px-4 lg:px-6 h-14 flex justify-between items-center">
        {/* ESQUERDA: Menu + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/app/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground"
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
            <span className="text-lg sm:text-xl font-bold gradient-text hidden xs:inline">DevForge</span>
          </Link>
        </div>

        {/* DIREITA: Acoes */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <ThemeToggle />

          {/* Notificacoes */}
          <Link
            href="/app/notifications"
            className="relative p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Notificacoes"
          >
            <Bell className="h-5 w-5" />
          </Link>

          {/* Menu Usuario */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-1 rounded-full hover:bg-accent transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-sm text-primary-foreground">
                {userInitials}
              </div>
            </button>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-background rounded-lg shadow-xl border py-2 z-[9999]">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold truncate">
                    {user?.displayName || 'Usuario'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <Link
                  href="/app/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </Link>

                <Link
                  href="/app/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  {t('nav.settings')}
                </Link>

                <div className="border-t my-1" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

/**
 * Header - Componente principal
 * Renderiza HeaderPublic ou HeaderApp baseado no estado de autenticacao
 */
export function Header() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur h-14" />
    );
  }

  return user ? <HeaderApp /> : <HeaderPublic />;
}

export default Header;
