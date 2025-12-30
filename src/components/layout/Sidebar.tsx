'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  MessageSquare,
  Star,
  Zap,
  X,
  LogIn,
  UserPlus,
  Shield,
  MessageCircle,
  Users,
  Phone,
  Code2,
  Mail,
  User,
  Award,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth, useLayout } from '@/contexts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

/**
 * Sidebar - Menu Lateral de Navegacao
 *
 * Menu lateral colapsavel com navegacao para usuarios
 * publicos e autenticados.
 *
 * @version 1.0.0
 */

interface NavLink {
  href: string;
  labelKey: string;
  icon: React.ElementType;
  badge?: string;
}

/**
 * Links publicos (visiveis para usuarios NAO logados)
 */
const PUBLIC_LINKS: NavLink[] = [
  { href: '/', labelKey: 'nav.home', icon: Home },
  { href: '/features', labelKey: 'nav.features', icon: Zap },
  { href: '/pricing', labelKey: 'nav.pricing', icon: Star },
  { href: '/about', labelKey: 'nav.about', icon: HelpCircle },
  { href: '/como-foi-feito', labelKey: 'nav.howItWasMade', icon: Code2 },
  { href: '/contact', labelKey: 'nav.contact', icon: Mail },
];

/**
 * Links para usuários autenticados
 */
const USER_LINKS: NavLink[] = [
  { href: '/app/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/app/surveys', labelKey: 'nav.surveys', icon: FileText },
  { href: '/app/responses', labelKey: 'nav.responses', icon: MessageSquare },
  { href: '/app/analytics', labelKey: 'nav.analytics', icon: BarChart3 },
  { href: '/app/testimonial', labelKey: 'nav.testimonial', icon: Award },
  { href: '/app/profile', labelKey: 'nav.profile', icon: User },
  { href: '/app/settings', labelKey: 'nav.settings', icon: Settings },
];

/**
 * Links administrativos (apenas para admins)
 */
const ADMIN_LINKS: NavLink[] = [
  { href: '/app/admin/messages', labelKey: 'nav.messages', icon: MessageCircle },
  { href: '/app/admin/testimonials', labelKey: 'nav.testimonials', icon: Users },
  { href: '/app/admin/whatsapp', labelKey: 'nav.whatsapp', icon: Phone },
];

/**
 * Componente de Link do Menu
 */
function NavItem({ link, isActive, onClick, t }: { link: NavLink; isActive: boolean; onClick: () => void; t: ReturnType<typeof useTranslations> }) {
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span>{t(link.labelKey)}</span>
      {link.badge && (
        <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
          {link.badge}
        </span>
      )}
    </Link>
  );
}

/**
 * Sidebar Component
 */
export function Sidebar() {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuth();
  const { isSidebarOpen, closeSidebar } = useLayout();

  // Fechar sidebar ao navegar
  useEffect(() => {
    const handleRouteChange = () => {
      closeSidebar();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, closeSidebar]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevenir scroll do body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen, closeSidebar]);

  const links = user ? USER_LINKS : PUBLIC_LINKS;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-background border-r shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between h-14 px-4 border-b">
          <Link href="/" className="flex items-center gap-2" onClick={closeSidebar}>
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
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col h-[calc(100%-3.5rem)] overflow-y-auto">
          <div className="flex-1 p-4 space-y-1">
            {links.map((link) => (
              <NavItem
                key={link.href}
                link={link}
                isActive={router.pathname === link.href}
                onClick={closeSidebar}
                t={t}
              />
            ))}

            {/* Painel Administrativo - apenas para admins */}
            {user?.role === 'admin' && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 px-4 py-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                    {t('nav.adminPanel')}
                  </span>
                </div>
                {ADMIN_LINKS.map((link) => (
                  <NavItem
                    key={link.href}
                    link={link}
                    isActive={router.pathname === link.href}
                    onClick={closeSidebar}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer da Sidebar */}
          <div className="p-4 border-t">
            {user ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-sm text-primary-foreground">
                  {user.displayName?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.displayName || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/login" onClick={closeSidebar} className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <LogIn className="h-4 w-4" />
                    {t('actions.login')}
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={closeSidebar} className="block">
                  <Button className="w-full justify-start gap-2">
                    <UserPlus className="h-4 w-4" />
                    {t('actions.signup')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
