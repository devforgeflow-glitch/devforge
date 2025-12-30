import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

/**
 * Componente Footer
 *
 * Rodape da aplicacao com links, redes sociais e copyright.
 * Design responsivo com grid adaptativo.
 *
 * @version 2.0.0
 */

/**
 * Links de redes sociais
 */
const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/devforge', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/devforge', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/devforge', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/devforge', label: 'Instagram' },
];

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container-app py-8 sm:py-12">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Logo e Descricao */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
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
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {t('footer.description')}
            </p>

            {/* Redes Sociais */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Produto */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              {t('footer.product')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/features" className="hover:text-foreground transition-colors">
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/recursos" className="hover:text-foreground transition-colors">
                  {t('nav.features')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Empresa */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              {t('footer.company')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/como-foi-feito" className="hover:text-foreground transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Legal */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contato@devforge.com" className="hover:text-foreground transition-colors">
                  contato@devforge.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} DevForge. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
