import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

/**
 * Pagina de Login
 *
 * Permite usuarios existentes entrarem na plataforma.
 *
 * @version 1.1.0
 */

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { signIn, loading, error, clearError, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Validacao basica
    if (!email || !password) {
      setLocalError(t('auth.login.errors.fillAllFields'));
      return;
    }

    try {
      await signIn(email, password);
      // Redireciona para dashboard apos login
      const redirectTo = (router.query.redirect as string) || '/app/dashboard';
      router.push(redirectTo);
    } catch {
      // Erro ja esta no contexto
    }
  };

  const displayError = localError || error;

  return (
    <>
      <Head>
        <title>{t('auth.login.meta.title')}</title>
        <meta name="description" content={t('auth.login.meta.description')} />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md" variant="elevated">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl">{t('auth.login.title')}</CardTitle>
            <CardDescription>{t('auth.login.description')}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!isConfigured && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-2">{t('auth.login.demoMode.title')}</p>
                  <p className="mb-3">
                    {t('auth.login.demoMode.description')}
                  </p>
                  <Link
                    href="/seed-demo"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('auth.login.demoMode.setupButton')}
                  </Link>
                </div>
              )}

              {displayError && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  {displayError}
                </div>
              )}

              <Input
                label={t('auth.login.email')}
                type="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">
                  {t('auth.login.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.login.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
              >
                {t('auth.login.submit')}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t('auth.login.noAccount')}{' '}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  {t('auth.login.createAccount')}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

// Carregar traducoes
export async function getStaticProps({ locale }: { locale?: string }) {
  const { loadMessages } = await import('@/i18n');
  return {
    props: {
      messages: await loadMessages(locale || 'pt-BR'),
    },
  };
}
