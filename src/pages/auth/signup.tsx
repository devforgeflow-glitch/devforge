import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Checkbox, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

/**
 * Pagina de Cadastro
 *
 * Permite novos usuarios criarem conta na plataforma.
 *
 * @version 1.0.0
 */

export default function SignupPage() {
  const t = useTranslations();
  const router = useRouter();
  const { signUp, loading, error, clearError, isConfigured } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Validacao
    if (!name || !email || !password || !confirmPassword) {
      setLocalError(t('auth.signup.errors.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      setLocalError(t('auth.signup.errors.passwordsDoNotMatch'));
      return;
    }

    if (password.length < 6) {
      setLocalError(t('auth.signup.errors.passwordTooShort'));
      return;
    }

    if (!acceptTerms) {
      setLocalError(t('auth.signup.errors.acceptTermsRequired'));
      return;
    }

    try {
      await signUp(email, password, name);
      // Redireciona para dashboard após cadastro
      router.push('/app/dashboard');
    } catch {
      // Erro já está no contexto
    }
  };

  const displayError = localError || error;

  return (
    <>
      <Head>
        <title>{t('auth.signup.meta.title')}</title>
        <meta name="description" content={t('auth.signup.meta.description')} />
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl">{t('auth.signup.title')}</CardTitle>
            <CardDescription>{t('auth.signup.description')}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!isConfigured && (
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 text-sm text-yellow-800 dark:text-yellow-200">
                  {t('auth.signup.firebaseNotConfigured')}
                </div>
              )}

              {displayError && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  {displayError}
                </div>
              )}

              <Input
                label={t('auth.signup.fullName')}
                type="text"
                placeholder={t('auth.signup.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || !isConfigured}
                autoComplete="name"
              />

              <Input
                label={t('auth.signup.email')}
                type="email"
                placeholder={t('auth.signup.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || !isConfigured}
                autoComplete="email"
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">
                  {t('auth.signup.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.signup.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || !isConfigured}
                    autoComplete="new-password"
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
                <p className="text-xs text-muted-foreground">{t('auth.signup.passwordHint')}</p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">
                  {t('auth.signup.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading || !isConfigured}
                    autoComplete="new-password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Checkbox
                label={t('auth.signup.acceptTerms')}
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={loading || !isConfigured}
              />
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
                disabled={!isConfigured}
              >
                {t('auth.signup.submit')}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t('auth.signup.hasAccount')}{' '}
                <Link href="/auth/login" className="text-primary hover:underline">
                  {t('auth.signup.login')}
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
