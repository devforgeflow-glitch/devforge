'use client';

import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Componente LanguageSelector
 *
 * Dropdown para selecao de idioma.
 * Suporta: pt-BR, en, es
 *
 * @example
 * ```tsx
 * <LanguageSelector />
 * ```
 *
 * @version 1.0.0
 */

const languages = [
  { code: 'pt-BR', name: 'Portugues', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Espanol', flag: '🇪🇸' },
] as const;

export function LanguageSelector() {
  const router = useRouter();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = router.locale || 'pt-BR';
  const currentLanguage = languages.find((l) => l.code === currentLocale) || languages[0];

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (locale: string) => {
    // Salva preferencia no cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    // Navega para a mesma pagina com novo locale
    router.push(router.pathname, router.asPath, { locale });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-full px-3 py-2',
          'text-sm font-medium transition-colors',
          'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring'
        )}
        aria-label={t('language')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.code.split('-')[0].toUpperCase()}</span>
        <svg
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-40',
            'rounded-lg border bg-popover p-1 shadow-lg',
            'animate-fade-in'
          )}
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
                'transition-colors hover:bg-muted',
                currentLocale === lang.code && 'bg-muted font-medium'
              )}
              role="option"
              aria-selected={currentLocale === lang.code}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
