'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, ThemeToggle, LanguageSelector } from '@/components/ui';
import { useAuth } from '@/contexts';
import { cn } from '@/lib/utils';

/**
 * Componente Header
 *
 * Cabecalho principal da aplicacao.
 * Inclui: logo, navegacao, theme toggle, language selector, auth.
 *
 * @version 1.0.0
 */

export function Header() {
  const t = useTranslations('common');
  const { user, signOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              className="h-5 w-5 text-primary-foreground"
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
          <span className="text-xl font-bold gradient-text">DevForge</span>
        </Link>

        {/* Navegacao Central */}
        <nav className="hidden md:flex items-center gap-6">
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
            href="/docs"
            className={cn(
              'text-sm font-medium text-muted-foreground',
              'hover:text-foreground transition-colors'
            )}
          >
            {t('nav.docs')}
          </Link>
        </nav>

        {/* Acoes */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    {t('actions.logout')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      {t('actions.login')}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">{t('actions.signup')}</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
